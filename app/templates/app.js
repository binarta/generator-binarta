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
  .controller('MainCtrl', ['$scope', 'activeUserHasPermission', 'publicConfigReader', 'config',
    function ($scope, activeUserHasPermission, publicConfigReader, config) {
      publicConfigReader({key: 'blog.enabled'});

      $scope.$watchCollection(function () {
        return config;
      }, function () {
        if (config['blog.enabled']) $scope.blogEnabled = config['blog.enabled'] == 'true';
      });

      activeUserHasPermission({
        no: function () {
          $scope.hasEditModePermission = false;
        },
        yes: function () {
          $scope.hasEditModePermission = true;
        },
        scope: $scope
      }, 'edit.mode');
    }])
  .controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (route) {
      return route == $location.path();
    };

    <% if (!useSidebar) { %>
    $scope.collapse = function () {
      if ($scope.viewport.xs) angular.element('#navbar').collapse('hide');
    };
    <% } %>
  }]);
