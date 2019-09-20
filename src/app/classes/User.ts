export class User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryRole: string;
  secondaryRole: string;
  location: string;
  likedTrackIds: string[];
  currentCollaboratorIds: string[];
  connectionIds: string[];
  followingIds: string[];
  followerIds: string[];
  signUpDate: string;
  salt: string;
  hash: string;
  admin: boolean;

  constructor(firstName: string,
    lastName: string,
    email: string,
    primaryRole: string,
    secondaryRole: string,
    location: string,
    likedTrackIds: string[],
    currentCollaboratorIds: string[],
    connectionIds: string[],
    followingIds: string[],
    followerIds: string[],
    signUpDate: string,
    salt: string,
    hash: string,
    _id?: string,
    admin?: boolean) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.primaryRole = primaryRole;
    this.secondaryRole = secondaryRole;
    this.location = location;
    this.likedTrackIds = likedTrackIds;
    this.currentCollaboratorIds = currentCollaboratorIds;
    this.connectionIds = connectionIds;
    this.followingIds = followingIds;
    this.followerIds = followerIds;
    this.signUpDate = signUpDate;
    this.salt = salt;
    this.hash = hash;
    this.admin = admin;
    this._id = _id;
  }

  public static fromJSON(json: any) {
    return new User(json.name.first, json.name.last, json.email, json.role.primary, json.role.secondary,
      json.location, json.likedTrackIds, json.currentCollaboratorIds, json.connectionIds,
      json.followingIds, json.followerIds, json.signUpDate, json.salt, json.hash, json._id, json.admin);
  }

  getJSON() {
    return {
      "_id": this._id,
      "name": {
        "first": this.firstName,
        "last": this.lastName
      },
      "email": this.email,
      "role": {
        "primary": this.primaryRole,
        "secondary": this.secondaryRole
      },
      "location": this.location,
      "likedTrackIds": this.likedTrackIds,
      "currentCollaboratorIds": this.currentCollaboratorIds,
      "connectionIds": this.connectionIds,
      "followingIds": this.followingIds,
      "followerIds": this.followerIds,
      "salt": this.salt,
      "hash": this.hash,
      "signUpDate": this.signUpDate,
      "admin": this.admin,
    };
  }

}

