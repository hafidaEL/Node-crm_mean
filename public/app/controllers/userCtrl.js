(function () {

angular.module('myApp')
       .controller('userCtrl', userCtrl);

// penser à recuperer le parametre "mode" pour savoir si edition ou creation d'un utilisateur 
  //  console.log("je suis avant controller userCtrl");


function userCtrl($scope, Users, $route, $routeParams, $localStorage, authService) {
    
    console.log("je suis dans controller userCtrl");

    // On vérifie si le token existe et qu'il est valide
    if ( ! authService.isLoggedIn() )
    {
            console.log("pas loggé ... au revoir ");
            authService.logout();
    }

    $scope.users = [];
    $scope.user = {};

    // $scope.currentUser = authService.currentUser();
   // $scope.isLoggedIn = authService.isLoggedIn();
   // console.log("isLoggedIn "+ $scope.isLoggedIn);

    //console.log("lecture $localStorage.username : " + $localStorage.username);
    /*if ($scope.currentUser != undefined) {
        $scope.user.username = $scope.currentUser.username ;
        console.log('donc $scope.user.username = '+ $scope.user.username);
    }*/

    $scope.mode = $route.current.$$route.mode;

    if ($scope.mode == "edition")
        Users.get_user($routeParams.idUser).then(function (data) {
             //console.log("mode : "+ $scope.mode + " "+ $routeParams.idUser);
            $scope.user = data ; 
        })

    // LIST USERS 
     Users.list_users().then(function(data) {
       $scope.users = data;
      
      
    }).catch(function() {
        $scope.error = 'erreur lors de la recup des utilisateurs';
    }); 

    

    $scope.Add = function () {
        console.log('Add : ' + $scope.user.name + " " +
                    'Name : ' + $scope.user.name + " " +
                    'Username : ' + $scope.user.username + " " +
                    'Password : ' + $scope.user.password);
       
        
         Users.create_user($scope.user).then(function (data) {
             console.log('Ajout effectué');

             $scope.user.name = '';
             $scope.user.username = '';
             $scope.user.password = '';
             $scope.users.push($scope.user);
             Materialize.toast("L'utilisateur a bien été ajouté !", 2000);
             window.location = "#/list_users";

         }).catch(function (err) {
             Materialize.toast("Erreur lors de l'ajout !", 2000);
              //console.log("Erreur lors de l'ajout de l'utilisateur" + err);
         });
    };

    $scope.Update = function () {
        console.log('Update : ' + $scope.user.name);
        console.log('id : '+ $scope.user._id);
        
         Users.update_user($scope.user).then(function (data) {
             console.log('Mise à jour effectuée');
             $scope.user.name = '';
             $scope.user.username = '';
             $scope.user.password = '';
             Materialize.toast("L'utilisateur a bien été modifié !", 2000);
             window.location = "#/list_users";

         }).catch(function (err) {
                Materialize.toast("Erreur lors de la mise à jour !", 2000);
              // console.log("Erreur lors de la mise à jour de l'utilisateur" + err);
         });
    };

    $scope.Del = function (id) {
        console.log('Del : ' + id); 
        console.log("avant "+$scope.users.length);
 
        Users.delete_user(id).then(function (data) {
             console.log('Suppression effectuée');
             $scope.users.splice(id,1);
             console.log("apres "+$scope.users.length);
             Materialize.toast("L'utilisateur a bien été supprimé!", 2000);

        }).catch(function (err) {
              Materialize.toast("Erreur lors de la suppression !", 2000);
              console.log("Erreur lors de la suppression " + err);
        });
    };   

    $scope.currentUser = function()
    {
        return authService.currentUser();
    }
     $scope.isLoggedIn = function()
     {
         return authService.isLoggedIn();
     }

    $scope.logout = function()
    {
        authService.logout();
        $scope.user.name = '';
        $scope.user.username = '';
        $scope.user.password = '';
       
        
    };

};

}) ();

