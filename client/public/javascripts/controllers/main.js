angular.module('nodeTodo').controller('mainCtrl', function ($scope, $http, $routeParams, $location, $window, SessionService) {
    $scope.mainData = {};
    //$scope.mainData.push($cookieStore.get('user'));
    //if (SessionService.getAuthenticatedUser()) {
        $scope.mainData = (JSON.parse(SessionService.getAuthenticatedUser()));
//    } else {
//        $location.path('/');
//    }
});