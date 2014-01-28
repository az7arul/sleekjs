
/*
 * Sample Welcome page Controller
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//index function
var indexController = {
    index:function(req,res,data,clbk){
        var M = system.getPluginModel('sample');
        M.list(function(resl){
           var data = {
            title: "Appended Comment Plugin"
            }
            try{
                clbk(system.getCompiledPluginView('home/index', data));
            } catch(err){
                system.log(err);
            }
        });
    },
    index1:function(req,res,data,clbk){
        var M = system.getPluginModel('sample');
        M.list(function(resl){
           var data = {
            title: "replaced Comment Plugin"
            }
            try{
                clbk(system.getCompiledPluginView('home/index', data));
            } catch(err){
                system.log(err);
            }
        });
    },
    main:function(req,res){
        var M = system.getPluginModel('sample');
        M.list(function(resl){
           var data = {
            title: "Comment Plugin"
            }
            system.loadPluginView(res,'home/index', data);
        });
    }
}

module.exports = indexController;