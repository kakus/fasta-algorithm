(function () {
    angular.
        module('fastaView').
        directive('fastaNumberInputValidator', [numberInputValidator]);

    /**
     * Directive for validating that only numbers are entered in "number" input.
     */
    function numberInputValidator() {
        return {
            restrict: 'A',
            link: link,
            scope : {
                allowMinus: '='
            },
            require: 'ngModel'
        };

        function link(scope, element, attrs, ngModel) {

            initialize();

            function initialize() {
                element.on('keypress', function(event) {
                    var pressed = String.fromCharCode(event.which);
                    if (isNaN(parseInt(pressed))) {
                        if(pressed === '-' ) {
                            if (!scope.allowMinus || ngModel.$modelValue !== null) {
                                event.preventDefault();
                            }
                        } else {
                            event.preventDefault();
                        }
                    }
                });
            }
        }
    }
})();
