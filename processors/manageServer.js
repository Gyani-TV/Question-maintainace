// const CLI = require('clui');
// const fs = require('fs');
// var nconf = require('nconf');
const dotenv = require( "dotenv" );
const chalk = require('chalk');
// const files= require("../utils/files")
const startup= require('./handlers/startup')
const cleanup= require('./handlers/cleanup')

dotenv.config();

const devConfig = {
 serverPort: process.env.HTTP_ENDPOINT,
 serverHostAddress: process.env.ROUTE_ADDRESS,
 dbName: process.env.DB_STRING
};
module.exports = async (args) => {   // extra paprameters sent by the commander

    /** @tasks start off the server and make a solid standpoint
     *  @ HouseKeeping keep using nconf --- for additions to the systems in later editions 
     */
    // nconf.argv()
    // .env()
    // .file({ file: files.getRepoSettingsFilePath });

    //
    // Set a few variables on `nconf`.
    //
    // nconf.set('database:host', '127.0.0.1');
    // nconf.set('database:port', 5984);

    //
    // Get the entire database object from nconf. This will output
    // { host: '127.0.0.1', port: 5984 }
    //
    // console.log('foo: ' + nconf.get('foo'));
    // console.log('NODE_ENV: ' + nconf.get('NODE_ENV'));
    // console.log('database: ' + nconf.get('database'));

    //
    // Save the configuration object to disk
    //
    // nconf.save(function (err) {
    //   fs.readFile(files.getRepoSettingsFilePath, function (err, data) {
    //     console.dir(JSON.parse(data.toString()))
    //   });
    // });

    var server = startup(devConfig);
    var shadowServer;
    const startServer = () => {
        shadowServer = await server.executeServerFlow();
        if (!shadowServer) {
          console.error("cannot logins")
        } else {
          console.log(shadowServer);
          console.log(chalk.bold("You have successfully started your system Server"));
          // store the auth token to the config files in ~/.config/* folder
        }
    }
    const stopServer = () => {
      var stopBit = cleanup(shadowServer).executeCleanup()
      if(stopBit){
        console.log(chalk.bold('You have successfully stopped the system application'))
      }
    }

};


  //
