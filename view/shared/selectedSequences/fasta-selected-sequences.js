(function () {
    angular.
        module('fastaView').
        directive('fastaSelectedSequences', [selectedSequences]);

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
