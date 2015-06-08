(function () {
    angular.
        module('fastaView').
        directive('fastaSequenceValidator', [sequenceValidator]);

    /**
     * Directive for validating that only proper symbols are entered for inputs containing DNA sequences
     */
    function sequenceValidator() {
        return {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };

        function link(scope, element, attrs, ngModel) {
            var possibleCharacters = attrs.fastaSequenceValidator || ['A', 'C', 'T', 'G'];

            initialize();

            function initialize() {
                element.on('keypress', function(event) {
                    var pressed = String.fromCharCode(event.which),
                        pressedUpper = pressed.toUpperCase();
                    event.preventDefault();
                    if (possibleCharacters.indexOf(pressedUpper) !== -1) {
                        ngModel.$setViewValue(ngModel.$viewValue + pressedUpper);
                        ngModel.$render();
                    }
                });
            }
        }
    }
})();