(function () {
    angular.
        module('fastaView').
        directive('fastaSelectedSequences', [selectedSequences]);

    /**
     * Directive to be used as common for displaying sequences selected for next stage
     */
    function selectedSequences() {
        return {
            restrict: 'A',
            scope: {
                bestSequences: '='
            },
            link: link,
            templateUrl: 'view/shared/selectedSequences/fasta-selected-sequences.html'
        };

        function link() {
        }
    }
})();
