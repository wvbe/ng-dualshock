angular.module('xf.dualshock.dsmotion', ['ngdualshock'])
    .directive('dsMotion', ['$rootScope',function($rootScope) {
    return {
        link: function ($scope, $element, $attr, $controller) {
            var keyName = $attr.key;
            if(!keyName)
                return console.error('dsMotion needs a key!');
            var value = 0;
            var maxValue = 100;
            var inverse = false;
            $rootScope.$on('dualshock:motion:'+keyName+':motion', function(evnt, data){
                value = Math.abs(data.value)-128;
                inverse = data.direction=='1'?false:true;
            });
            $scope.getValue = function () {
                return value/maxValue;
            }
            $scope.getRaw = function(){return value;};
            $scope.getInverse = function() { return inverse;};
            $scope.getStyle = function() {
                var magnitude = value/255*100;
                return [
                        'width: '+magnitude+'%',
                        (inverse?'right':'left')+': 50%'
                ].join(';');
            }

        },
        'restrict': 'EA',
        scope: true
    };
}]);