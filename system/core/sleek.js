/*
 * System library
 * 
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

var path = require('path');
var hbs = require('handlebars');
var fs = require('fs');
global.appPath = path.dirname(require.main.filename);

global.sleekConfig = {};
require(path.join(appPath,'application/config/config.js'));
require('./db.js');
    

//set loggings as in config
if(sleekConfig.logToFile == true) {
    var fs = require('fs');
    var access = fs.createWriteStream(path.join(appPath, sleekConfig.accesslog), {flags:'a'});
    process.stdout.write = (function(write) {
            return function(string, encoding, fd) {
                    access.write(string);
            }
    })(process.stdout.write)

    var errorLog = fs.createWriteStream(path.join(appPath, sleekConfig.errorlog), {flags:'a'});
    process.stderr.write = (function(write) {
            return function(string, encoding, fd) {
                    errorLog.write(string);
            }
    })(process.stdout.write)
}
    
global.system = {
    /**
     * get model object
     * pass model name. example; for userModel pass user
     * 
     * @param char name model name, ignoring trailing 'Model'
     * @returns model object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getModel: function(m){
        try {
            return require(path.join(appPath, 'application/models',m+'Model.js'));
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * get a library object
     * 
     * @param char name libraryname name
     * @returns library object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getLibrary: function(l){
        try {
            return require(path.join(appPath ,'lib',l+'.js'));
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * get a controller object
     * 
     * @param c controller name
     * @returns controller object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getController: function(c){
        try {
            return require(path.join(appPath,'application/controllers',c+'.js'));
        } catch (err) {
            this.log(err);
        }
        
    },
    /**
     * Set a partial file to load in view
     * can load partial from view, using {{> partialname data}}
     * 
     * @param char path file path from view folder
     * @param char name Set a name for partial to load in view
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    setPartial: function(partial, name){
        try {
            var realPath  = path.join(appPath,'application/views',sleekConfig.theme, partial+'.html');
            if (! fs.existsSync(realPath)) {
                realPath = path.join(appPath,'application/views/default',partial+'.html');
            }
            var template = fs.readFileSync(realPath, 'utf8');
            hbs.registerPartial(name, template);
        }
        catch (err) {
            this.log(err);
        }
        
    },
    
    loadView: function(res, view, passedData){
        try {
            var getpath  = path.join(sleekConfig.theme,view+'.html');
            var realPath = getpath;
            fs.exists(path.join(appPath,'application/views',getpath), function(exists){
                if(! exists) {
                    realPath = path.join('default',view+'.html');
                }
            });
            
            var assetFile = path.join(app.get('views'), path.dirname(realPath), 'assets.json');
            var scripts = '';
            fs.exists(assetFile, function(exists){
                if(exists) {
                    fs.readFile(assetFile, 'utf8', function (err, data) {
                        if (err) {
                          this.log(err);
                          return;
                        }
                        data = JSON.parse(data);

                        for(var count in data.css) {
                            if (fs.existsSync(path.join(appPath,'public', sleekConfig.theme, 'css', data.css[count]+'.css'))) {
                                scripts += '<link rel="stylesheet" href="'+path.join(sleekConfig.theme, 'css', data.css[count]+'.css')+'"/>\n';
                            } else {
                                scripts += '<link rel="stylesheet" href="'+path.join('default', 'css', data.css[count]+'.css')+'"/>\n';
                            }
                            
                        }

                        for(var count in data.js) {
                            if (fs.existsSync(path.join(appPath,'public', sleekConfig.theme, 'js', data.js[count]+'.js'))) {
                                scripts += '<script type="text/javascript" src="'+path.join(sleekConfig.theme, 'js', data.js[count]+'.js')+'" ></script>\n';
                            } else {
                                scripts += '<script type="text/javascript" src="'+path.join('default', 'js', data.js[count]+'.js')+'" ></script>\n';
                            }
                            
                        }
                        hbs.registerPartial('getSleekScripts', scripts);
                        res.render(realPath, passedData);

                    });
                } else {
                    hbs.registerPartial('getSleekScripts', scripts);
                    res.render(realPath, passedData);
                }

                
            });
        }
        catch (err) {
            this.log(err);
        }
    },
    
    log: function(str, status){
        if(!status) {
            status = 'Error';
        }
        if(str) {
            var log = status + ' :: ' + new Date() + ' :: ' + str + '\n';
            if(sleekConfig.logToFile == true) {
                fs.appendFile(path.join(appPath, sleekConfig.systemlog), log, function (err) {});
            } else {
                console.log(log);
            }
        }
    }
};
