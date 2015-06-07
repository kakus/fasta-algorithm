(function () {
    angular.
        module('fastaView').
        directive('fastaNavigationFooter', ['$location', 'CurrentStageService', navigationFooter]);

    function navigationFooter($location, CurrentStageService) {
        return {
            restrict: 'A',
            scope: {
                previousUrl: '@',
                nextUrl: '@',
                lastStep: '=',
                saveStep: '&',
                config: '=',
                nextStageNumber: '=',
                currentStep: '='
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
                scope.currentStep = scope.currentStep || 0;
                scope.description = scope.config[scope.currentStep].description;
                scope.disabledStepButton = false;
            }

            function initializeScopeFunctions() {
                scope.nextStep = nextStep;
                scope.previousStep = previousStep;
                scope.isLastStep = isLastStep;
                scope.isFirstStep = isFirstStep;
                scope.isLastStage = isLastStage;

                scope.nextStage = nextStage;
                scope.previousStage = previousStage;
            }

            function nextStep() {
                var promise;

                scope.disabledStepButton = true;
                ++scope.currentStep;

                scope.description = scope.config[scope.currentStep].description;
                promise = scope.config[scope.currentStep].action();
                return promise.then(function() {
                    scope.saveStep({lastStep: scope.currentStep});
                    scope.disabledStepButton = false;
                });
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

            function isLastStage() {
                return scope.nextUrl ? false : true;
            }

            function nextStage() {
                if (isLastStep()) {
                    CurrentStageService.currentStage = scope.nextStageNumber;
                    $location.url(scope.nextUrl);
                } else {
                    finishStage();
                }
            }

            function finishStage() {
                if (!isLastStep()) {
                    nextStep().then(function() {
                        finishStage();
                    });
                }
            }

            function previousStage() {
                scope.currentStep = 0;
                scope.saveStep({lastStep: scope.currentStep});
                CurrentStageService.currentStage -= 1;
                scope.config[0].reverse();
            }
        }
    }
})();
