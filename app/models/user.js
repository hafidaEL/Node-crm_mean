var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var dbURI = 'mongodb://localhost/Users';

if (process.env.NODE_ENV == 'production')
	dbURI=process.env.MONGOLAB_URI ;

console.log(" env : "+ process.env.NODE_ENV );
console.log("db URI : "+dbURI);

mongoose.connect(dbURI);

var db = mongoose.connection;

db.on('error', function (error) {
	console.log('WARNING ! ***** DB connection error *****');
	console.log(error);
});

db.once('open', function () {
	console.log('DB connection OK !');
});

var userSchema = mongoose.Schema({
	name      : String,
	username  : String,
	password  : String
});

// hash the password before the user is saved
 userSchema.pre('save', function(next) {
 var user = this;

 // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();
    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) { if (err) return next(err);
            // change the password to the hashed version
            user.password = hash;
    next(); 
    });

});

// method to compare a given password with the database hash
userSchema.methods.comparePassword = function(password) { var user = this;
	console.log("password : " + password);
	console.log("user.password : " + user.password);
return bcrypt.compareSync(password, user.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;