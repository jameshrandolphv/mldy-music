# MldyMusic

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4444/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component components/component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further Angular CLI help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Code Repository
All the code for this project was hosted on Heroku Git. You will need to install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line).

### Clone the repo
```
$ heroku git:clone -a mldy-music
$ cd mldy-music
```
### Deploy your changes
```
$ git add .
$ git commit -am "make it better"
$ git push heroku master
```

## Developer Environment Setup

### 1. Install Node.js
### 2. Run `npm install`
### 3. Install [MongoDB](https://www.mongodb.com/download-center/community)
### 4. Launch MongoDB Server
Navigate to MongoDB program files location, launch via `./mongo` from terminal.
### 5. Start Node server
Start server by running `node server.js` from terminal.
### 6. MONGO_DEBUG
Change variable `MONGO_DEBUG` to be `true`. Located in `src/app/app.component.ts`.
### 7. Build and launch the app
Run `ng serve -o` in terminal.
