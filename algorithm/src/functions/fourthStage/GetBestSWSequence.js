var fasta;
(function (fasta) {

    function getPathsForBestSequences(solutionsBySequences) {
        var bestSolutions = fasta.utils.getBestSequences(solutionsBySequences, function(solution) {
            return solution[0].score;
        });

        return Object.keys(bestSolutions).length ? Object.keys(bestSolutions)[0] : null;
    }

    fasta.getBestSWSequence = getPathsForBestSequences;
})(fasta = fasta || {});