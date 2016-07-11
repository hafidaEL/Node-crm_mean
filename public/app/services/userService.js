(function () {
angular.module('myApp')
    .factory('Users', function($http, authService){

         var users = 
           {
              list_users : function() {
                var config = {   headers : { 'Authorization': 'Bearer '+ authService.getToken()} };
                return $http.get('/list_users/', config)
                       .then(function(response) {   
                            return response.data;
                            });
              },
              get_user : function(id) {
                var config = {   headers : { 'Authorization': 'Bearer '+ authService.getToken()} };
                return $http.get('/api/get_user/'+id, config)
                       .then(function(response) {   
                            return response.data;
                            });
              },
              create_user : function (user) {
                var data =  JSON.stringify(user)  ;
                var config = {   headers : { 'Authorization': 'Bearer '+ authService.getToken()} };
                  return $http.post('/create_user/', data, config)
                         .then(
                              function(response){
                              console.log(" donnees envoyees ");
                          }, 
                              function(response){
                              alert(' erreur ' + response);
                         }
                    );          
              },
              update_user : function (user) {
                var data =  JSON.stringify(user)  ;
                var config = {   headers : { 'Authorization': 'Bearer '+ authService.getToken()} };
                return $http.put('/api/get_user/'+user._id, data, config)
                       .then(
                            function(response){
                            console.log(" donnees envoyees ");
                        }, 
                            function(response){
                            alert(' erreur ' + response);
                       }
                  );          
              },
              delete_user : function (id) {
                  var config = {   headers : { 'Authorization': 'Bearer '+ authService.getToken()} };
                 return $http.delete('/api/get_user/' + id, config).then(function(response) {   
                            return response.data;
                }); 
              }

            };
            return users;
        });
}) ();
