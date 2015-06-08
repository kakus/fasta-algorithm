(function () {
    angular.
        module('fastaView').
        directive('fastaNavigationFooter', ['$location', 'CurrentStageService', navigationFooter]);

    /**
     * Directive for footer fixed navigation. Allows to unify actions taken on each stage for making next/previous steps/stages.
     *
     * Allows to "Finish Stage" by doing all steps at once.
     * When going to previous stage, function callback from controller is called that should clear stage data
     *
     * Many attributes are necessary to provide:
     *      - previousUrl - url to go when previous stage button is clicked
     *      - nextUrl (optional) - url to go when next stage button is clicked
     *      - saveStep - callback function to remember last performed step - necessary to restore state on controller
     *      - nextStageNumber (optional) - number of next stage, necessary to set globally current stage
     *      - currentStep - currently performed step - necessary to properly restore state after manually switching stage
     *      - config - array containing object for steps definition.
     *          First element should be "initial" step with description property and reverse function as property to clear data after doing "Previous Stage" action
     *          Rest should be as follows:
     *          {
     *              description: short description of step,
     *              action: function callback to be called when "next step" is done,
     *              reverse: function callback to be called when "previous step" is done
     *          }
     */
    function navigationFooter($location, CurrentStageService) {
        return {
            restrict: 'A',
            scope: {
                previousUrl: '@',
                nextUrl: '@',
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
                return promise.then(function () {
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
                    nextStep().then(function () {
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
