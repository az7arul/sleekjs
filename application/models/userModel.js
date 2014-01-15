/**
 * Sample Model
 * 
 * @package Sleek.js
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

//write function here
var userModel = {
    list: function(callback){
        var collection =mongodb.collection('usercollections');
            // Locate all the entries using find
        collection.find().toArray(function(err, results) {
            callback(results);
        });
    }
}

module.exports = userModel;