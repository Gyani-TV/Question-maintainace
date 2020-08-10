#!/usr/bin/env node
"use strict";

const chalk = require( "chalk" );
const dotenv = require( "dotenv" );
const authClient = require( "./login/authClient" );

// read in settings
dotenv.config();

const config = {
 oktaOrgUrl: process.env.OKTA_ORG_URL,
 clientId: process.env.OKTA_CLIENT_ID,
 scopes: process.env.OKTA_SCOPES,
 serverPort: process.env.OKTA_REDIRECT_PORT
};

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   databaseURL: process.env.DATABASE_URL,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID
// };

module.exports = async () => {
 try {
   const auth = authClient( config );
   const { token, userInfo } = await auth.executeAuthFlow();
   if(!token || !userInfo){
    console.error("cannot logins")
   }else{
    console.log( token, userInfo );
    console.log( chalk.bold( "You have successfully authenticated your CLI application!" ) );
    // store the auth token to the config files in ~/.config/* folder
   }

 } catch ( err ) {
   console.log( chalk.red( err ) );
 }
};
