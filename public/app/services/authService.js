

//  faire un service qui prend un login et un mot de passe
// et qui fait un post vers  le serveur sur la route /api/authenticate


(function () {
angular.module('myApp')
    .factory('authService', function($http, $localStorage){
         var saveToken = function(token)
              {
                $localStorage.token = token;
              };
         var getToken = function()
              {
                return $localStorage.token ; 
              };
         var delToken = function()
         {
            delete $localStorage.token; 
         };
            // teste si token existe et pas expiré
         var isLoggedIn = function()
              {
                      var token = getToken(); 
                      if (token)
                      {
                          var p = JSON.parse(window.atob(token.split('.')[1]));
                          expire = p.exp > Date.now() / 1000 ;
                          console.log("isLoggedIn / date expiration token " + expire);
                          return p.exp > Date.now() / 1000 ; 
                      } 
                      else {
                        return false;
                      }
              };
         var services = 
           {
              saveToken : saveToken,
              getToken : getToken,
              delToken : delToken,
              authenticate : function(user) {
                               console.log('avant post vers api authenticate '+JSON.stringify(user));
                return $http.post('http://localhost:8080/api/authenticate/', user)
                			 .then(
                                function(response){
                                  //response.data.user = user ; 
                                  saveToken(response.data.token);
                                console.log(" authentif : "+ response.data.message + " " + response.data.success + " " + response.data.user);
                                   return  response.data ;  

                                }
                            )
              },
              isLoggedIn : isLoggedIn,
              currentUser : function()
              {
                if (isLoggedIn()) {
                  var token = getToken();
                  var p = JSON.parse(window.atob(token.split('.')[1]));
                  console.log("currentUser (trouvé dans token ) : "+p.username);
                  return {
                    name: p.name,
                    username: p.username
                  };
                }
              },
              logout : function () {
                          //console.log('logout');
                           delToken(); 
                           window.location = "#/login";
                      }

            };
            return services;
        });
}) ();