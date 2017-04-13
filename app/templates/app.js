angular.module('<%= namespace %>', ['<%= subscription %>.app', 'app.components'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: 'partials/index.html'})
            .when('/contact', {templateUrl: 'partials/contact.html'})
            .when('/contact/:subject', {templateUrl: 'partials/contact.html'})
            .when('/conditions', {templateUrl: 'partials/conditions.html'})
            .when('/404', {templateUrl: 'partials/404.html'})
            .when('/:locale/', {templateUrl: 'partials/index.html'})
            .when('/:locale/contact', {templateUrl: 'partials/contact.html'})
            .when('/:locale/contact/:subject', {templateUrl: 'partials/contact.html'})
            .when('/:locale/conditions', {templateUrl: 'partials/conditions.html'})
            .when('/:locale/404', {templateUrl: 'partials/404.html'})
            .otherwise({redirectTo: '/404'});
    }]);