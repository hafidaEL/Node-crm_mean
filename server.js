var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

var jwt = require('jsonwebtoken');
require('dotenv').load();


/* 
  protection de l'api  ==> authentification des routes avec jwt 
  mettre auth sur chaque route à proteger par token JWT
*/
var expressJwt = require('express-jwt');
var auth = expressJwt({
  secret : process.env.JWT_SECRET,
  userProperty: 'user'
});


var app = express();
var morgan = require('morgan');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

var User = require('./app/models/user');

var apiRouter = express.Router();
app.use("/api", apiRouter);


/* gestion des rejets */
app.use(function(err, req, res, next){
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + " : " + err.message});
  }
});

apiRouter.get('/', function(req, res) {
         res.json({ message: 'hooray! welcome to our api!' });
 });


app.get('/list_users', auth, function(req, res){
    User.find(function (err, users) {
      if (err) {
        console.log(err);
      } else {
      	console.log('users  : ' + users);
        res.json(users);
      }
    });
});

app.post('/create_user', auth, function(req, res){
  var user = new User({
  	  name: req.body.name,
      username: req.body.username,
      password: req.body.password
  });
  user.save(function (err, data) {
    if (err) {
      console.log("ERROR");
      console.log(err);
    } else {
      res.redirect('/list_users');
    }
  });
});


apiRouter.route('/get_user/:id', auth)
       .get(function(req, res) {
            User.findById(req.params.id, function(err, user) { 
        if (err) res.send(err);
        res.json(user);
        });
     })
    .put(function(req, res) {
      User.findById(req.params.id, function(err, user) {
        console.log("user.name : " + req.body.name);
        console.log("user.username : " + req.body.username);
        console.log("user.password : " + req.body.password);
        if (err) res.send(err);
          if (req.body.name) user.name = req.body.name;
          if (req.body.username) user.username = req.body.username; 
          if (req.body.password) user.password = req.body.password;
        user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'User updated!' });
          });
         });
    })
    .delete(function(req, res){
      console.log('suppression de '+ req.params.id);
      User.findOneAndRemove({'_id' : req.params.id}, function (err) {
        if (err) res.send(err);
        //res.json({ message: 'User deleted !' });
        User.find(function (err, users) {
            if (err) {
              res.send(err);
            } else {
              console.log('users  : ' + users);
              res.json(users);
            }
        });

      });
});




// GESTION DU JSON WEB TOKEN
 apiRouter.post('/authenticate', function(req, res, next){
     // find the user
// select the name username and password explicitly 
console.log(' post authenticate username : '+ req.body.username);
console.log(' post authenticate password : '+ req.body.password);
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function(err, user) {
            if (err) throw err;
                // no user with that username was found
            if (!user) {
                console.log("authentif failed . user not found") ;
	            res.json({
	            success: false,
	            message: 'Authentication failed. User not found.'
            	});
    		} 
    		else if (user) 
    		{
				  // check if password matches
				var validPassword = user.comparePassword(req.body.password); 
				if (!validPassword) {
             console.log("Authentication failed. Wrong password.") ;
				      res.json({
				    success: false,
				    message: 'Authentication failed. Wrong password.'
				        });
				    } else {
				// if user
				// create a token
				var token = jwt.sign({
				          name: user.name,
				          username: user.username
				        }, process.env.JWT_SECRET, {
                //expiresIn : 60 
				        expiresIn : 60*60*24
				    });

				// return the information including token as JSON
				    res.json({
				    success: true,
				    message: 'Enjoy your token!', 
            token: token
				                }); 
				            }
				        }
    	});
});


app.listen(port);
console.log("Serveur en cours sur le port: " + port);