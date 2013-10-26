/* 
 * Database intialization
 * 
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

global.mongoose = require('mongoose');
var options = {
  user: sleekConfig.dbUser,
  pass: sleekConfig.dbPass
}

try {
    mongoose.connect('mongodb://'+sleekConfig.dbHost+':'+sleekConfig.dbPort+'/' + sleekConfig.dbName, options);
}
catch (err) {
    console.log(err);
}


