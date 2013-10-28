
/*
 * Sample Welcome page Controller
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

   
exports.index = function(req, res){
    var data = {
//        layout: 'main',
        title: "Sleek.js",
        home: "An MVC for Node js.. combining handlebars, express & mongodb together"
    }
    
    system.loadView(res,'home/index', data);
};