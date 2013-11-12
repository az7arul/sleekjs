
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
    index:function(req, res){
        var user = system.getModel('user');
        user.list(function(users){
            var data = {
                users: users
            }
            //load index.html from home directory
            system.loadView(res,'home/index', data);
        });
        
    },
    add: function(req, res){
        var user = system.getModel('user');
        var data = {
            'name': req.body.name ? req.body.name : '',
            'place': req.body.name ? req.body.place : '',
            'age': req.body.name ? req.body.age : '',
            'time': new Date().getTime()
        };
        user.insert(data, function(newdata){
            var newuser = '<tr id="'+newdata._id+'">\
                  <td width="20%" bgcolor="#f4f4f4">'+ newdata.name + '</td>\
                  <td width="44%" bgcolor="#f4f4f4">' + newdata.place + '</td>\
                  <td width="43%" bgcolor="#f4f4f4">' + newdata.age + '</td>\
                  <td width="46%" bgcolor="#f4f4f4"><a class="removeUser" data-id="'+newdata._id+'" href="javascript:void(0);"></a></td>\
                </tr>';
            
            sleekio.sockets.emit('useradd', { 'user': newuser });
            res.end();
        });
        
    },
    remove: function(req, res){
        var user = system.getModel('user');
        user.remove(req.params.id);
        sleekio.sockets.emit('userremove', { 'id': req.params.id });
        res.end();
    }
}

var Handlebars = require('handlebars');
Handlebars.registerHelper('siteURL', function() {
  return sleekConfig.siteUrl;
});

module.exports = indexController;