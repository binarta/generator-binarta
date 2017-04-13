(function () {
    angular.module('app.components', ['binarta-applicationjs-angular1', 'binarta-checkpointjs-angular1'])
        .component('mainNavbar', new MainNavbarComponent())
        .component('mainFooter', new MainFooterComponent());

    function MainNavbarComponent() {
        this.templateUrl = 'partials/components/main-navbar.html';
        this.controller = ['$scope', 'binarta', function ($scope, binarta) {
            var $ctrl = this, observers = [];

            $scope.$on('$routeChangeStart', function () {
                $ctrl.path = binarta.application.unlocalizedPath();
            });

            $ctrl.$onInit = function () {
                var checkpointObserver = binarta.checkpoint.profile.eventRegistry.observe({
                    signedin: onSignedIn,
                    signedout: onSignedOut
                });
                observers.push(checkpointObserver);
            };

            $ctrl.$onDestroy = function () {
                observers.forEach(function (observer) {
                    observer.disconnect();
                });
            };

            function onSignedIn() {
                $ctrl.authenticated = true;
            }

            function onSignedOut() {
                $ctrl.authenticated = false;
            }
        }];
    }

    function MainFooterComponent() {
        this.templateUrl = 'partials/components/main-footer.html';
    }
})();