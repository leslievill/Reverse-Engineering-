'use strict';
//THIS COMES WITH SEQUELIZE CLI
// file system module to read/create files
var fs        = require('fs');
//allows directories to work together 
var path      = require('path');
var Sequelize = require('sequelize');
//extracts filename from file path
var basename  = path.basename(module.filename);
//allows path variable set accessible and make external calls
var env       = process.env.NODE_ENV || 'development';
// accessing utilities in config.json
var config    = require(__dirname + '/../config/config.json')[env];
//assign empty object to database
var db        = {};
// making sure use_env_variable is a key
if (config.use_env_variable) {
  //if it is a key when defined env variable is created
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  //when it ISNT a key that was defined when env variable was created
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs
//this returns the array with files in specified directory (__dirname)
  .readdirSync(__dirname)
  //filter returns items that are true passeed into new array
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  //passes array item to a cb function
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });
//returns array containing keys of db while forEach changes the array passed to it
//if statements saying modelName is a key in the db and will associate it with it's according model in the db
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
