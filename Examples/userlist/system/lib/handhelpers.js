/*
 * System helpers
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
 * @Date 12-11-2013
 */

var Handlebars = require('handlebars'),
path = require('path'), 
fs = require('fs');

//helper function
Handlebars.registerHelper('$', function(name, args) {
   if(args && (typeof args) != 'object') {
        var params = args.split(",");
   }
   if(params && params.length != 0) {
       return HELPER[name].apply(this,params);
   } else {
       return HELPER[name]();
   }
   
});

//helper function
Handlebars.registerHelper('$part', function(partial, data, plugin) {
     try {
          
        var realPath  = path.join(appPath,'application/views',sleekConfig.theme, partial+'.html');
        if(typeof(plugin) == 'string') {
            realPath  = path.join(appPath,'modules',plugin,'views',partial+'.html');
        } else if (! fs.existsSync(realPath)){
            realPath = path.join(appPath,'application/views/default',partial+'.html');
        }
        var templateFile = fs.readFileSync(realPath, 'utf8');
        var template = Handlebars.compile(templateFile);
        var compiled;
        if(data){
            compiled = template(data);
        } else {
            compiled = template();
        }
         
        //get plugin overrides
        var plugsDir = fs.readdirSync(path.join(appPath,'modules'));
        for(var p in plugsDir) {
            var stats = fs.statSync(path.join(appPath,'modules',plugsDir[p]));
            if(stats.isDirectory() && plugsDir[p].charAt(0) != '.'){
                var Ovr = require(path.join(appPath,'modules',plugsDir[p], 'override.js'));
                for(var c in Ovr.data) {
                    if(Ovr.data[c].view == partial){
                        var _m = Ovr.data[c].mode;
                        if(_m == 'override'){
                            compiled = system.getCompiledPluginView(partial,data,plugsDir[p]);
                        } else if (_m == 'prepend') {
                            compiled = system.getCompiledPluginView(partial,data,plugsDir[p]) + compiled;
                        } else if (_m == 'append') {
                            compiled += system.getCompiledPluginView(partial,data,plugsDir[p]);
                        } else if(_m != 'controll'){
                            compiled = system.getCompiledPluginView(partial,data,plugsDir[p]);
                        }
                    }
                }
            }
        }
        
        return new Handlebars.SafeString(compiled);
    }
    catch (err) {
        system.log(err);
    }   
});

