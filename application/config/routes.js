/* 
 * Routes.
 * Add your routes here
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//define controllers
var routes = system.getController('index');
var user = system.getController('user');

module.exports = function (app) {
    //Add routes
    // use :param to get param, :param? for optional params
    app.get('/', routes.index);
    app.get('/users', user.list);
    app.get('/userlist', routes.userlist());
}


