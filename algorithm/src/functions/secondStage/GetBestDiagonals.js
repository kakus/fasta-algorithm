var fasta;
(function (fasta) {

    /**
     * Returns 10 best diagonals from input array of diagonals
     */
    function getBestDiagonals(diagonals) {
        if (diagonals.length <= 10) {
            return diagonals.slice();
        }

        var sorted = diagonals.sort(compareDiagonalsByScore);
        return sorted.slice(0, 10);
    }

    function getBestDiagonalsForEachSequence(diagonalsBySequences) {
        var bestDiagonals = {};

        for (var sequence in diagonalsBySequences) {
            var diagonals = diagonalsBySequences[sequence];
            bestDiagonals[sequence] = getBestDiagonals(diagonals);
        }
        return bestDiagonals;
    }

    function compareDiagonalsByScore(first, second) {
        if (first.score < second.score)
            return 1;
        if (first.score > second.score)
            return -1;
        return 0;
    }

    fasta.getBestDiagonalsForEachSequence = getBestDiagonalsForEachSequence;
    fasta.getBestDiagonals = getBestDiagonals;
})(fasta = fasta || {});
