/**
 * Sample Model
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//write function here
var collection = mongodb.collection('users');
var userModel = {
    list: function(callback){
        collection.find().sort([['time','desc']]).toArray(function(err, results) {
            callback(results);
        });
    },
    insert: function(user, callback){
        collection.insert(user, {safe:true}, function(err, newuser){
            if(err) console.log(err);
            
            callback(newuser[0]);
        });
    },
    remove: function(id){
        collection.remove({ _id:mongo.ObjectID(id) }, function(err) {
            if (err) return handleError(err);
        });
    }
}

module.exports = userModel;
