(function () {

angular.module('myApp')
       .controller('mainCtrl', mainCtrl);

function mainCtrl($scope, authService, $localStorage) {
    
    //console.log("je suis dans controller mainCtrl");

    $scope.user = {};
    $scope.user.name = '';
    $scope.user.username = '';
    $scope.user.password = '';
  

    $scope.verifLogin = function() {

            // appelée lors du clic sur le bouton du formulaire Login
            // on appelle le service authService pour vérifier (sur le serveur) 
            // si le login et le password sont corrects

            //console.log('ici verifLogin '+$scope.user.name);

             authService.authenticate($scope.user).then(function(data) {

                 //console.log("service authService.authenticate  : " + JSON.stringify(data, null, 2) ); 
                    $scope.message = data.message ;
                    $scope.success = data.success ; 
                    $scope.token = data.token ; 
                    // //console.log('TOKEN : '+$scope.token );
                if ( ! $scope.success)
                {
                    Materialize.toast($scope.message, 2000);
                    return;
                }
                //console.log("success "+$scope.success);
                //$localStorage.username = $scope.user.username;
                authService.saveToken($scope.token);
                ////console.log("ecriture $localStorage.username : " + $localStorage.username);
                window.location = "#/list_users" ;
            });

    };



};

}) ();