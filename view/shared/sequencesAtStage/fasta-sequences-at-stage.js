(function () {
    angular.
        module('fastaView').
        directive('fastaSequencesAtStage', [sequencesAtStage]);

    function sequencesAtStage() {
        return {
            restrict: 'A',
            scope: {
                sequences: '='
            },
            link: link,
            templateUrl: 'view/shared/sequencesAtStage/fasta-sequences-at-stage.html'
        };

        function link() {
        }
    }
})();
