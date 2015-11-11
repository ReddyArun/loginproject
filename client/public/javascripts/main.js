var routerApp = angular.module('nodeTodo',
        ['ngRoute']);

routerApp.config(function ($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: '/templates/login.html',
                controller: 'loginCtrl',
                requireLogin: false
            })
            .when('/main', {
                templateUrl: '/templates/main.html',
                controller: 'mainCtrl',
                requireLogin: true
            });
})
        ;

routerApp.service('SessionService', function () {
    var authenticatedUser = null;

    this.setAuthenticatedUser = function (value) {
        authenticatedUser = value;
    };
    this.getAuthenticatedUser = function () {
        return authenticatedUser;
    };
});
routerApp.run(['$rootScope', '$location', 'SessionService', function ($rootScope, $location, SessionService) {
        $rootScope.$on('$locationChangeStart', function (event, next) {
            if (!SessionService.getAuthenticatedUser()){
                console.log("Authentication Error");
                $location.path('/');
            }
        });
    }]);

