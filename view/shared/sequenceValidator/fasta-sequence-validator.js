(function () {
    angular.
        module('fastaView').
        directive('fastaSequenceValidator', [sequenceValidator]);

    function sequenceValidator() {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var possibleCharacters = attrs.fastaSequenceValidator || ['A', 'C', 'T', 'G'];

            initialize();

            function initialize() {
                element.on('keypress', function(event) {
                    var pressed = String.fromCharCode(event.which);
                    if (possibleCharacters.indexOf(pressed) === -1) {
                        event.preventDefault();
                    }
                });
            }
        }
    }
})();