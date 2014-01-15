/*
 * System library
 * 
 * @package Sleek.js
 * @version 1.0
 * 
 * The MIT License (MIT)

 * Copyright Cubet Techno Labs, Cochin (c) 2013 <info@cubettech.com>

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

var path = require('path');
var hbs = require('handlebars');
var fs = require('fs');
global.appPath = path.dirname(require.main.filename);
global.HELPER ={};
require(path.join(appPath,'application/config/defines.js'));
require('./db.js');
require(path.join(appPath,'system/lib/handhelpers.js'));
var f = require(path.join(appPath,'system/lib/functions.js'));

//set loggings as in config
if(sleekConfig.logToFile == true) {
    var access = fs.createWriteStream(path.join(appPath, sleekConfig.accesslog), {
        flags:'a'
    });
    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            access.write(string);
        }
    })(process.stdout.write)

    var errorLog = fs.createWriteStream(path.join(appPath, sleekConfig.errorlog), {
        flags:'a'
    });
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
     * @param model model name, ignoring trailing 'Model'
     * @return model object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getModel: function(model){
        try {
            return require(path.join(appPath, 'application/models',model+'Model.js'));
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * get a library object
     * 
     * @param lib library name
     * @return library object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getLibrary: function(lib){
        try {
            return require(path.join(appPath ,'lib',lib+'.js'));
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * load a helpers object
     * 
     * @param helper helper name
     * @return helper object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    loadHelper: function(helper){
        try {
            if(helper instanceof Object) {
                for(var h in helper) {
                    f.extendJSON(global.HELPER, require(path.join(appPath ,'application/helpers',helper[h]+'.js')));
                }
            } else {
                f.extendJSON(global.HELPER, require(path.join(appPath ,'application/helpers',helper+'.js')));
            }
        } catch (err) {
            this.log(err);
        }
    },
    /**
     * get a controller object
     * 
     * @param controller controller name
     * @return controller object
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    getController: function(controller){
        try {
            return require(path.join(appPath,'application/controllers',controller+'.js'));
        } catch (err) {
            this.log(err);
        }
        
    },
    /**
     * Set a partial file to load in view
     * can load partial from view, using {{> partialname data}}
     * 
     * @param partial file path from view folder
     * @param name Set a name for partial to load in view
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
    setPartial: function(partial, name){
        try {
            if(!name){
                name = partial;
            }
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
    
    /**
     * Load view
     * 
     * @param res response object
     * @param view file path from view folder
     * @param passedData Set data to load in view
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
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
                                scripts += '<link rel="stylesheet" href="'+path.join('/',sleekConfig.theme, 'css', data.css[count]+'.css')+'"/>\n';
                            } else {
                                scripts += '<link rel="stylesheet" href="'+path.join('/default', 'css', data.css[count]+'.css')+'"/>\n';
                            }
                            
                        }

                        for(var count in data.js) {
                            if (fs.existsSync(path.join(appPath,'public', sleekConfig.theme, 'js', data.js[count]+'.js'))) {
                                scripts += '<script type="text/javascript" src="'+path.join('/',sleekConfig.theme, 'js', data.js[count]+'.js')+'" ></script>\n';
                            } else {
                                scripts += '<script type="text/javascript" src="'+path.join('/default', 'js', data.js[count]+'.js')+'" ></script>\n';
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
    /**
     * Write log
     * 
     * @param str string to log error
     * @param status Optional log status
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 23-10-2013
     */
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
    },
    /**
     * Get compiled handlebars template with data
     * 
     * @param name file path from view folder
     * @param data Data to compile with template
     * 
     * @author Robin <robin@cubettech.com>
     * @Date 13-11-2013
     */
    getCompiledView: function(name, data){
        try {
            if(!name){
                throw 'Please supply template name to compile'
            }
            var realPath  = path.join(appPath,'application/views',sleekConfig.theme, name+'.html');
            if (! fs.existsSync(realPath)) {
                realPath = path.join(appPath,'application/views/default',name+'.html');
            }
            var templateFile = fs.readFileSync(realPath, 'utf8');
            var template = hbs.compile(templateFile);
            var compiled;
            if(data){
                compiled = template(data);
            } else {
                compiled = template();
            }
            return compiled;
        }
        catch (err) {
            this.log(err);
        }
        
    }
};

module.exports = function(app){
    try {
        var R = require(path.join(appPath, 'application/config/routes.js'));
        var Helper = require(path.join(appPath, 'application/helpers/routes.js'));
         
        var commonfns = [];
        if(R.commonRouteFunctions) {
            for(var i in R.commonRouteFunctions){
                var ct = R.commonRouteFunctions[i];
                if(Helper[ct] instanceof Function) {
                    var sc = Helper[ct] ? Helper[ct] : function(req,res,next){
                        next();
                    };
                    commonfns.push(sc);
                }
            }
        } else {
            commonfns = function(req,res,next){ next(); };
        }
        var rts = [];
        for(var c in R.routes) {
            var rt = R.routes[c];
            rts[c] = system.getController(rt.controller);
            var act = rt.action;
            var rout = rt.route;
            for(var r in rt.params) {
                rout += '/' + rt.params[r] + '([A-Za-z0-9_]+)?'
            }
            var fn = Helper[rt.fn] ? Helper[rt.fn] : function(req,res,next){
                next();
            };
            
            if(rt.type && rt.type == "POST") {
                app.post(rout, commonfns, fn, rts[c][act]);
            } else {
                app.get(rout, commonfns, fn, rts[c][act]);
            }

        }
    } catch (e){
        system.log(e);
    }
    app.get('*/([A-Za-z0-9_]+)', function(req, res){
        system.loadView(res,'error');
    });                                                                                                                                                                                                               
}