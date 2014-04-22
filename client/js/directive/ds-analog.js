angular.module('xf.dualshock.dsanalog', ['ngdualshock'])
    .directive('dsAnalog', ['$rootScope', function ($rootScope) {
        return {
            link: function ($scope, $element, $attr, $controller) {
                var keyName = $attr.key;
                if (!keyName)
                    return console.error('dsAnalog needs a key!');

                var position = {x: 128, y: 128};

                $rootScope.$on('dualshock:analog:' + keyName + ':move', function (evnt, data) {
                    position = data;
                });

                $scope.getValue = function () {
                    return Math.sqrt(position.x * position.x + position.y * position.y)
                }
                $scope.getMultiplier = function () {
                    return {
                        x: position.x / 255 * 2 - 1,
                        y: position.y / 255 * 2 - 1
                    }
                };
                $scope.getPercentile = function () {
                    return {
                        x: position.x / 255 * 100,
                        y: position.y / 255 * 100
                    }
                };
            },
            'restrict': 'EA',
            scope: true
        };
    }]);