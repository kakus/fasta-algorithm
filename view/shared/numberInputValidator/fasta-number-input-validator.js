(function () {
    angular.
        module('fastaView').
        directive('fastaNumberInputValidator', [numberInputValidator]);

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
                    console.log(pressed);
                    console.log(scope.allowMinus);
                    console.log(ngModel.$modelValue);


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
