(function () {
    angular.
        module('fastaView').
        directive('fastaSequencesTabs', [sequencesTabs]);

    /**
     * Directive to be used as common for displaying sequences available at current stage
     *
     * changeSequence - callback to change sequence on controller
     */
    function sequencesTabs() {
        return {
            restrict: 'A',
            scope: {
                sequences: '=',
                changeSequence: '&'
            },
            link: link,
            templateUrl: 'view/shared/sequencesTabs/fasta-sequences-tabs.html'
        };

        function link(scope) {
            initialize();

            function initialize() {
                initializeScopeVariables();
                initializeScopeFunctions();
            }

            function initializeScopeVariables() {
                scope.selected = scope.sequences[0];
            }

            function initializeScopeFunctions() {
                scope.select = select;
            }

            function select(index) {
                scope.selected = scope.sequences[index];
                scope.changeSequence({index: index});
            }
        }
    }
})();
