
/*
 * GET home page.
 */

//get models
var PostModel = system.getModel('user');
system.setPartial('header', 'head');
system.getLibrary('handlebarsHelpers');
   
exports.index = function(req, res){
//    req.on("newPost", function (name,cont) {
//    /* Adding the post to a database
//     * Then calling an event to say a new post was created
//     * and emit a new signal with the new data */
//        res.send(name);
//    });
//    res.send('helo');
//    var user = system.getController('user');
//    user.list(req, res);
//    return;
//    
    var events = require('events');
    var socket = new events.EventEmitter();
    socket.on('newListGroup', function (data) {
        console.log(11);
    });
    var data = {
//        layout: 'main',
        title: "Sleek.js",
        home: "An MVC for Node js.. combining handlebars, express & mongodb together"
    }
    
    system.loadView(res,'home/index', data);
};

exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "userlist" : docs
            });
        });
    };
};
