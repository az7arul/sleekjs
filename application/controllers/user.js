
/*
 * GET users listing.
 */

var PostModel = system.getModel('user');

//system.setPartial('home/index', 'indq');

exports.list = function(req, res){
    
//
//    req.on("newPost", function (name,cont) {
    /* Adding the post to a database
     * Then calling an event to say a new post was created
     * and emit a new signal with the new data */
//        console.log(123);
        req.emit("newPost", 'name', 'cont');
//    });
    
    PostModel.list(function(person){
        var data = {'data': person};
         system.loadView(res,'user', data);
        
    });
};