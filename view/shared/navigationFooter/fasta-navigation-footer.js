(function () {
    angular.
        module('fastaView').
        directive('fastaNavigationFooter', ['$location', navigationFooter]);

    function navigationFooter($location) {
        return {
            restrict: 'A',
            scope: {
                previousUrl: '@',
                nextUrl: '@',
                lastStep: '=',
                saveStep: '&',
                config: '='
            },
            link: link,
            templateUrl: 'view/shared/navigationFooter/fasta-navigation-footer.html'
        };

        function link(scope) {
            initialize();

            function initialize() {
                initializeScopeVariables();
                initializeScopeFunctions();
            }

            function initializeScopeVariables() {
                scope.currentStep = scope.lastStep || 0;
                scope.description = scope.config[scope.currentStep].description;
            }

            function initializeScopeFunctions() {
                scope.nextStep = nextStep;
                scope.previousStep = previousStep;
                scope.isLastStep = isLastStep;
                scope.isFirstStep = isFirstStep;

                scope.nextStage = nextStage;
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

            function isLastStep() {
                return scope.currentStep === scope.config.length - 1;
            }

            function isFirstStep() {
                return scope.currentStep === 0;
            }

            function nextStage() {
                if (isLastStep()) {
                    scope.saveStep({lastStep: scope.currentStep});
                    $location.url(scope.nextUrl);
                } else {
                    finishStage();
                }
            }

            function finishStage() {
                while(!isLastStep()) {
                    nextStep();
                }
            }
        }
    }
})();
