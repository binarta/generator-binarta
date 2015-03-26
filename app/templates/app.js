angular.module("<%= appname %>", ['basic.app'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {templateUrl: 'partials/index.html'})
      .when('/contact', {templateUrl: 'partials/contact.html'})
      .when('/conditions', {templateUrl: 'partials/conditions.html'})
      .when('/admin', {templateUrl: 'partials/admin.html'})
      .when('/404', {templateUrl: 'partials/404.html'})
      .otherwise({redirectTo: '/404'});
  }])
  .controller('MainCtrl', [function () {
  }])
  .controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (route) {
      return route == $location.path();
    };

    $scope.collapse = function () {
      if ($scope.viewport.xs) angular.element('#navbar').collapse('hide');
    };
  }]);
