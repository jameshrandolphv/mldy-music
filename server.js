var express = require("express");
var cors = require('cors');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var ms = require('mediaserver');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var fs = require("fs");
var address = require('public-ip');

var EMAIL_COLLECTION = "emails";
var USER_COLLECTION = "users";
var TRACK_COLLECTION = "tracks";
var AUDIO_COLLECTION = "audio";
var SESSION_COLLECTION = "sessions";
var COLLABORATION_COLLECTION = "collaborations";

// Structure of a collaboration object
// let a_collaboration = {
//   "_id": string,
//   "trackId": number,
//   "authorIds": [],
//   "startDate": string,
// }

var app = express();
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
}));

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname)
  }
});

var upload = multer({ storage: storage }).any();

var whitelist = ['http://localhost:4444', 'https://mldymusic.com', 'https://www.mldymusic.com/#/', 'https://www.mldymusic.com'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// app.use(cors([credentials: true, origin: 'http://localhost:8080', secure: false]))

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool the app
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// =============== USER AUTHENTICATION =============== //

/* JWT + Express JWT Impl */
  app.route('/login').post(loginRoute);

  let ipaddress = "";
  address.v4().then(res => {
    ipaddress = res;
  });

  // Generate private and public keys for generating and reading JWTs
  const RSA_PRIVATE_KEY = fs.readFileSync('./private_key.pem');
  const RSA_PUBLIC_KEY = fs.readFileSync('./public_key.pem');

  // given the email and login of a user, validate said credentials
  // upon confirmed validation -> 
  //  response { access_token..., refresh_token... }
  // TODO: write JWT helper methods
  function loginRoute(req, res) {
    const email = req.body.email,
          password = req.body.password;

    db.collection(USER_COLLECTION).findOne({email: email}).then(user => {
      if (bcrypt.compareSync(password, user.hash)) {
        // access token is made on login and expires in 15min
        // -> contains access policies from backend
        // refresh token is made on login and expires after ~week, used to refresh access token
        // -> contains user._id
        const access_token = jwt.sign({
          "admin": user.admin != undefined ? false : user.admin,
          "userId": user._id,
        }, RSA_PRIVATE_KEY, {
          algorithm: 'RS256',
          expiresIn: "15m",
          subject: JSON.stringify(user._id),
        });

        let refresh_token;
        db.collection(SESSION_COLLECTION).findOne({ ip: ipaddress, userId: new ObjectID(user._id) }).then(refresh => {
          if(!refresh) {
            // no existing token for this ip
            refresh_token = {
              "ip": ipaddress,
              "token": jwt.sign({
                  "userId": user._id,
                }, RSA_PRIVATE_KEY, {
                  algorithm: 'RS256',
                  expiresIn: '1w',
                  subject: JSON.stringify(user._id),
                }),
              "userId": user._id,
            }
              
            db.collection(SESSION_COLLECTION).insertOne(refresh_token).then(added => {
              // added new session from login
              // send the JWT back to the client in the HTTP response body
              res.status(200).json({
                access: {
                  idToken: access_token, 
                  expiresIn: 15,
                },
                refresh: refresh_token,
                userId: user._id,
              });    
            }, err => {
              // error adding session on login
              handleError(err, "Error adding session", "Couldn't add session with ip: " + ipaddress)
            })
          } else {
            // found existing session
            // verify refresh and remove from db if invalid
            jwt.verify(refresh.token, RSA_PUBLIC_KEY, {
              algorithms: ['RS256'],
            }, (err, decoded) => {
              if(err) {
                db.collection(SESSION_COLLECTION).deleteOne(refresh).then(res => {}, err => { handleError(err, "Session Delete", "Failed to delete invalid refresh token")});
              } else {
                refresh_token = refresh;
              }
            });
            // send the JWT back to the client in the HTTP response body
            res.status(200).json({
              access: {
                idToken: access_token, 
                expiresIn: 15,
              },
              refresh: refresh_token,
              userId: user._id,
            });    
          }
        }, err => {
          handleError(err, "Error finding session", "Couldn't find session with ip: " + ipaddress)
        })
      } else {
          // send status 401 Unauthorized
          res.sendStatus(401); 
      }
    }, err => {
      handleError(err, "Error")
    });
  }

// ==================== API ROUTES ==================== //

// ========== Refresh Route ========== //
app.post("/api/refresh", cors(corsOptions), (req, res) => {
  const refresh = req.body.token;
  jwt.verify(refresh, RSA_PUBLIC_KEY, (err, decoded) => {
    if(err) {
      // refresh token expired
      res.sendStatus(401);
    } else {
      db.collection(USER_COLLECTION).findOne({ _id: new ObjectID(decoded.userId) }).then(user => {
        console.log(user.admin != undefined ? user.admin : false)
        const access_token = jwt.sign({
          "admin": user.admin != undefined ? user.admin : false,
        }, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: "15m",
                subject: JSON.stringify(user._id),
        });
        
        // if user found, generate new access token
        res.status(200).json({
          idToken: access_token, 
          expiresIn: 15,
        });
      }, err => {
        // no valid user found
        res.sendStatus(401);
      });
    }
  })
});

// ========== Admin Authentication Routes ========== //
app.post("/api/admin", cors(corsOptions), (req, res) => {
      const token = req.body.token;
      jwt.verify(token, RSA_PUBLIC_KEY, {
        algorithms: ['RS256'],
      }, (err, decoded) => {
        if(err) {
          // token is expired
          res.sendStatus(401);
        } else {
          if(decoded.admin) {
            res.status(200).json(decoded.admin);
          } else {
            // not admin
            res.sendStatus(401);
          }
        }
      });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

// ========== SESSIONS ========== //
// Post a session token
app.post("/api/" + SESSION_COLLECTION, cors(corsOptions), (req, res) => {
  // session JSON = { ip: string, token: JWT, userId: user._id }
  const session = req.body;
  jwt.verify(session.token, RSA_PUBLIC_KEY, {
    algorithms: ['RS256'],
  }, (err, decoded) => {
    if(err) {
      handleError(err, "Session token expired", "Must provide a valid JWT token", 400);
    } else {
      // Session object
      db.collection(SESSION_COLLECTION).insertOne(session, (err, doc) => {
        if(err) {
          handleError(res, err.message, "Failed to create new session.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
  });
});

// Get all sessions 
app.get("/api/" + SESSION_COLLECTION, cors(corsOptions), function (req, res) {
  db.collection(SESSION_COLLECTION).find({ userId: new ObjectID(req.query.userId) }).toArray(function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to find sessions with userId.");
    } else {
      res.status(200).json(doc);
    }
  });
});

// Delete a sessoin
app.delete("/api/" + SESSION_COLLECTION, cors(corsOptions), function (req, res) {
  db.collection(SESSION_COLLECTION).deleteOne({ ip: req.query.ip }, function (err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete session with ip " + req.params.ip);
    } else {
      res.status(200).json("Deleted session with ip " + req.params.ip);
    }
  });
});

// ========== EMAILS ========== //
// Get all emails
app.get("/api/" + EMAIL_COLLECTION, cors(corsOptions), function (req, res) {
  db.collection(EMAIL_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get emails");
    } else {
      res.status(200).json(docs);
    }
  });
});

// Post an email object
app.post("/api/" + EMAIL_COLLECTION, cors(corsOptions), function (req, res) {
  var newEmail = req.body;
  newEmail.createDate = new Date();

  if (!req.body.email) {
    handleError(res, "Missing email", "Must provide an email to post.", 400);
  } else {
    db.collection(EMAIL_COLLECTION).insertOne(newEmail, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new email.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

// ========== USERS ========== //
// Get ALL users
app.get("/api/" + USER_COLLECTION, cors(corsOptions), function (req, res) {
  db.collection(USER_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users");
    } else {
      res.status(200).json(docs);
    }
  });
});

// Get user matching an id
app.get("/api/" + USER_COLLECTION + "/:id", cors(corsOptions), function (req, res) {
  db.collection(USER_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to find user with id " + req.params.id);
    } else {
      res.status(200).json(doc);
    }
  });
});

// Get user given a specific email
app.get("/api/" + USER_COLLECTION, cors(corsOptions), function(req, res) {
  db.collection(USER_COLLECTION).findOne({ email: req.params.email }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to find user with email " + req.params.email);
    } else {
      res.status(200).json(doc);
    }
  });
});

// Post a user
app.post("/api/" + USER_COLLECTION, cors(corsOptions), function (req, res) {
  var newUser = req.body.user;
  var password = req.body.password;
  if (!newUser) {
    handleError(res, "Missing user", "Must provide a user to post.", 400);
  }
  newUser.signUpDate = new Date();
  newUser.hash = bcrypt.hashSync(password, saltRounds);
  db.collection(USER_COLLECTION).findOne({ email: newUser.email }, (err, found) => {
    if(err) handleError(found, err.message, "Failed to find existing user while creating new user.");
    if(!found) {    
      db.collection(USER_COLLECTION).insertOne(newUser, function (err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new user.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    } else {
      // Conflict, user already with email already exists
      res.status(409).json(newUser.email);
    }
  });
});

// Update a user's info
app.put("/api/" + USER_COLLECTION + "/:id", cors(corsOptions), function (req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(USER_COLLECTION).updateOne({ "_id": ObjectID(req.params.id) }, { $set: updateDoc }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update user with id " + req.params.id);
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

// Delete a user
app.delete("/api/" + USER_COLLECTION + "/:id", cors(corsOptions), function (req, res) {
  db.collection(USER_COLLECTION).deleteOne({ "_id": ObjectID(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete user with id " + req.params.id);
    } else {
      res.status(200).json("Deleted user with id " + req.params.id);
    }
  });
});

// ========== TRACKS ========== //
// Get ALL tracks
app.get("/api/" + TRACK_COLLECTION, function (req, res) {
  db.collection(TRACK_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get tracks");
    } else {
      res.status(200).json(docs);
    }
  });
});

// Get track matching an id
app.get("/api/" + TRACK_COLLECTION + "/:id", function (req, res) {
  db.collection(TRACK_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to find track with id " + req.params.id);
    } else {
      res.status(200).json(doc);
    }
  });
});

// Post a track
app.post("/api/" + TRACK_COLLECTION, function (req, res) {
  var newTrack = req.body;
  if (!newTrack) {
    handleError(res, "Missing track", "Must provide a track to post.", 400);
  }
  newTrack.datePosted = new Date();

  db.collection(TRACK_COLLECTION).insertOne(newTrack, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new track.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

// Update a track's info
app.put("/api/" + TRACK_COLLECTION + "/:id", cors(corsOptions), function (req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(TRACK_COLLECTION).updateOne({ "_id": ObjectID(req.params.id) }, { $set: updateDoc }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update track with id " + req.params.id);
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

// Delete a track
app.delete("/api/" + TRACK_COLLECTION + "/:id", cors(corsOptions), function (req, res) {
  db.collection(TRACK_COLLECTION).deleteOne({ "_id": ObjectID(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete track with id " + req.params.id);
    } else {
      res.status(200).json("Deleted track with id " + req.params.id);
    }
  });
});

app.post('/api/' + AUDIO_COLLECTION, function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log('Error Occured');
      return;
    }

    res.end('Your File Uploaded');
    console.log('Track Uploaded');
    res.status(200);
  })
});

app.get('/api/audio/:file', function (req, res) {
  ms.pipe(req, res, './uploads/' + req.params.file);
});