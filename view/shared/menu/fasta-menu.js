(function () {
    angular.
        module('fastaView').
        directive('fastaMenu', ['$location', menu]);

    function menu($location) {
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
            }

            function menuSelected(selected) {
                return $location.path() === selected;
            }
        }
    }
})();
