var Schema = mongoose.Schema;

var userSchema = new Schema({
    author    : String
  , title     : String
});

var PostModel = mongoose.model('User', userSchema, 'usercollections');

function test() {
    console.log('hii');
    return 'hiii';
}

//write function here
exports.list = function(callback){
    PostModel.find(function (err, person) {
        if (err) return handleError(err);
        callback(person);
    });
}
//
////set routes
//module.exports ={
//    test: test,
//    list:list
//}