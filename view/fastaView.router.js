(function () {
    angular
        .module('fastaView')
        .config(['$routeProvider', router])
        .run(['$location', '$rootScope', changePageListener]);

    var lastRoute;

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
                controller: 'FirstController',
                resolve: {
                    check: createCheckStageFunction(1)
                }
            }).
            when('/second_stage', {
                templateUrl: 'view/secondStage/second-panel.html',
                controller: 'SecondController',
                resolve: {
                    check: createCheckStageFunction(2)
                }
            }).
            when('/third_stage', {
                templateUrl: 'view/thirdStage/third-panel.html',
                controller: 'ThirdController',
                resolve: {
                    check: createCheckStageFunction(3)
                }
            }).
            when('/fourth_stage', {
                templateUrl: 'view/fourthStage/fourth-panel.html',
                controller: 'FourthController',
                resolve: {
                    check: createCheckStageFunction(4)
                }
            }).
            otherwise({
                redirectTo: '/home'
            });

        function createCheckStageFunction(stageNumber) {
            return ['$q', '$location', 'CurrentStageService', checkIfStageCanBeLoaded];

            function checkIfStageCanBeLoaded($q, $location, CurrentStageService) {
                if (CurrentStageService.currentStage < stageNumber) {
                    if (lastRoute !== undefined) {
                        $location.path(lastRoute).replace();
                    } else {
                        $location.path('/config').replace();
                    }
                    return $q.reject();
                }

            }
        }
    }

    function changePageListener($location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', rememberLastPage);

        function rememberLastPage(event, current) {
            if (current.$$route !== undefined) {
                lastRoute = $location.path();
            }
        }
    }
})();
