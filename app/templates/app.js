angular.module("<%= appname %>", ['basic.app'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: 'partials/index.html'})
            .when('/404', {templateUrl: 'partials/404.html'})
            .otherwise({redirectTo: '/404'});
    }])
    .controller('MainCtrl', [function () {

    }]);