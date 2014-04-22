angular.module('xf.dualshock.dsbutton', ['ngdualshock'])
    .directive('dsButton', ['$rootScope', function ($rootScope) {
        return {
            link: function ($scope, $element, $attr, $controller) {
                var keyName = $attr.key;
                if (!keyName)
                    return console.error('dsButton needs a key!');
                $scope.state = false;
                $rootScope.$on('dualshock:button:' + keyName + ':press', function () {
                    $scope.state = true;
                });
                $rootScope.$on('dualshock:button:' + keyName + ':release', function () {
                    $scope.state = false;
                });
            },
            'restrict': 'EA',
            scope: true
        };
    }]);