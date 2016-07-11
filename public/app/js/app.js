angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngStorage'])
       .config(config);


console.log('coucou') ;

function config($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: './app/views/pages/home.html',
			controller: 'mainCtrl'
		})
		.when('/login', {
			templateUrl: './app/views/pages/login.html',
			controller: 'mainCtrl'
		})
		.when('/create_user', {
			templateUrl: './app/views/users/single.html',
			controller: 'userCtrl',
			mode : 'creation'
		})
		.when('/edit_user/:idUser', {                     // --> routeParams pour le recuperer
			templateUrl: './app/views/users/single.html',
			controller: 'userCtrl',
			mode : 'edition'
		})
		.when('/list_users', {
			templateUrl: './app/views/users/all.html',
			controller: 'userCtrl'
		});
		// .otherwise({ redirectTo: '/' });	

	// $locationProvider.html5Mode(true); 
};

/*


$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
   return {
       'request': function (config) {
           config.headers = config.headers || {};
           if ($localStorage.token) {
               config.headers.Authorization = 'Bearer ' + $localStorage.token;
           }
           return config;
       },
       'responseError': function (response) {
           if (response.status === 401 || response.status === 403) {
               $location.path('/login');
           }
           return $q.reject(response);
       }
   };
}]); */

