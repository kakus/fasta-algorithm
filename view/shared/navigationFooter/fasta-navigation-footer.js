(function () {
    angular.
        module('fastaView').
        directive('fastaNavigationFooter', [navigationFooter]);

    function navigationFooter() {
        return {
            restrict: 'A',
            scope: {
                previousUrl: '@',
                nextUrl: '@',
                config: '='
            },
            link: link,
            templateUrl: 'view/shared/navigationFooter/fasta-navigation-footer.html'
        };

        function link(scope) {
            initialize();

            function initialize() {
                scope.currentStep = 0;
                scope.description = scope.config[scope.currentStep].description;
                scope.nextStep = nextStep;
                scope.previousStep = previousStep;
                scope.lastStep = lastStep;
                scope.firstStep = firstStep;
            }

            function nextStep() {
                ++scope.currentStep;
                scope.description = scope.config[scope.currentStep].description;
                scope.config[scope.currentStep].action();
            }

            function previousStep() {
                scope.config[scope.currentStep].reverse();
                --scope.currentStep;
                scope.description = scope.config[scope.currentStep].description;
            }

            function lastStep() {
                return scope.currentStep === scope.config.length - 1;
            }

            function firstStep() {
                return scope.currentStep === 0;
            }
        }
    }
})();
