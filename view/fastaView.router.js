(function () {
    angular
        .module('fastaView')
        .config(['$routeProvider', router]);

    function router($routeProvider) {

        $routeProvider.
            when('/home', {
                templateUrl: 'view/home/home.html'
            }).
            when('/config', {
                templateUrl: 'view/configStep/config-panel.html',
                controller: 'ConfigController'
            }).
            when('/first_stage', {
                templateUrl: 'view/firstStage/first-panel.html',
                controller: 'FirstController'
            }).
            when('/second_stage', {
                templateUrl: 'view/secondStage/second-panel.html',
                controller: 'SecondController'
            }).
            when('/third_stage', {
                templateUrl: 'view/thirdStage/third-panel.html',
                controller: 'ThirdController'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }
})();
