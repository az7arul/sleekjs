/* 
 * Configuration
 * 
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//port number
global.sleekConfig.appPort = 3000;

global.sleekConfig.siteUrl = 'http://localhost:3000/'

global.sleekConfig.env = 'development';

// mongodb database settings
global.sleekConfig.dbHost = 'localhost';
global.sleekConfig.dbPort = '';
global.sleekConfig.dbName = 'nodetest';
global.sleekConfig.dbUser = '';
global.sleekConfig.dbPass = '';


//themeing
global.sleekConfig.theme = 'default'

//logging
global.sleekConfig.logToFile = false; // if true, logs will write to file instead of console.
global.sleekConfig.accesslog = 'application/var/logs/access.log'; // logging each access
global.sleekConfig.errorlog = 'application/var/logs/error.log'; // application errors
global.sleekConfig.systemlog = 'application/var/logs/system.log'; // manual logging
