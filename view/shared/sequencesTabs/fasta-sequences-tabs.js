(function () {
    angular.
        module('fastaView').
        directive('fastaSequencesTabs', [sequencesTabs]);

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

        function link() {
        }
    }
})();
