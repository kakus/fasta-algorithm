(function () {
    angular.
        module('fastaView').
        directive('fastaMenu', ['$location', 'CurrentStageService', menu]);

    function menu($location, CurrentStageService) {
        return {
            restrict: 'A',
            link: link,
            templateUrl: 'view/shared/menu/fasta-menu.html'
        };

        function link(scope) {
            initialize();

            function initialize() {
                initializeScopeFunctions();
            }

            function initializeScopeFunctions() {
                scope.menuSelected = menuSelected;
                scope.getCurrentStage = getCurrentStage;
            }

            function menuSelected(selected) {
                return $location.path() === selected;
            }

            function getCurrentStage() {
                return CurrentStageService.currentStage;
            }
        }
    }
})();
