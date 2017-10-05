angular.module('app', ['app.config', 'carousel'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: 'partials/home.html'})
            .when('/features', {templateUrl: 'partials/features.html'})
            .when('/about', {templateUrl: 'partials/about.html'})
            .when('/conditions', {templateUrl: 'partials/conditions.html'})
            .when('/404', {templateUrl: 'partials/404.html'})
            .when('/:locale/', {templateUrl: 'partials/home.html'})
            .when('/:locale/features', {templateUrl: 'partials/features.html'})
            .when('/:locale/about', {templateUrl: 'partials/about.html'})
            .when('/:locale/conditions', {templateUrl: 'partials/conditions.html'})
            .when('/:locale/404', {templateUrl: 'partials/404.html'})
            .otherwise({redirectTo: '/404'});
    }]);