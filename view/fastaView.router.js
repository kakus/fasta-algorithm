(function () {
    angular
        .module('fastaView')
        .config(['$routeProvider', router]);

    function router($routeProvider) {

        $routeProvider.
            when('/home', {
                templateUrl: 'home/home.html'
            }).
            when('/config', {
                templateUrl: 'configStep/config-panel.html',
                controller: 'ConfigController'
            }).
            when('/first_stage', {
                templateUrl: 'firstStage/first-panel.html',
                controller: 'FirstController'
            }).
            when('/second_stage', {
                templateUrl: 'secondStage/second-panel.html',
                controller: 'SecondController'
            }).
            when('/third_stage', {
                templateUrl: 'thirdStage/third-panel.html',
                controller: 'ThirdController'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }
})();
