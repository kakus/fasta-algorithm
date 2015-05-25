(function () {
    angular.
        module('fastaView').
        directive('fastaNavigationFooter', [navigationFooter]);

    function navigationFooter() {
        return {
            restrict: 'A',
            scope: {
                previousUrl: '@',
                nextUrl: '@'
            },
            link: link,
            templateUrl: 'shared/navigationFooter/fasta-navigation-footer.html'
        };

        function link() {
            initialize();

            function initialize() {

            }
        }
    }
})();
