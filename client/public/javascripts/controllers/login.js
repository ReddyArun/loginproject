
angular.module('nodeTodo').controller('loginCtrl', function ($window, $scope, $http, $routeParams, $location, $window, SessionService) {
    $scope.loginData = {};
    if (SessionService.getAuthenticatedUser()) {
        $location.path('/main');
    }
// Login Staff
    $scope.loginUser = function () {
        $http.post('/loginuser', $scope.loginData)
                .success(function (data) {
                    SessionService.setAuthenticatedUser(JSON.stringify(data));
                    $window.sessionStorage["user"] = JSON.stringify(data);
                    $scope.loginData = {};
                    $location.path('/main');
                })
                .error(function (error) {
                    $scope.errorMsg = "Invalid UserName and Password!...";
                    console.log('Error: ' + error);
                    $location.path('/');
                });
    };
});