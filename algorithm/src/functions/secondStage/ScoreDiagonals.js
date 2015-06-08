var fasta;
(function (fasta) {

    /**
     * Scores given array of diagonals. Returns same array as input, but with score assigned to diagonals.
     *
     * Scoring is done with use of given scoreMatrix, each pair of symbols are given some value.
     *
     * @param diagonals
     * @param scoreMatrix
     * @param baseSequence
     * @param querySequence
     * @returns {Array} of fasta.Diagonal objects with score property
     */
    function scoreDiagonals(diagonals, scoreMatrix, baseSequence, querySequence) {
        var diagonal,
            querySubsequence,
            baseSubsequence,
            score,
            scoredDiagonals = diagonals.slice();
        for (var i = 0; i < scoredDiagonals.length; i++) {
            score = 0;
            diagonal = scoredDiagonals[i];
            baseSubsequence = baseSequence.substring(diagonal.startPoint[0], diagonal.endPoint[0] + 1);
            querySubsequence = querySequence.substring(diagonal.startPoint[1], diagonal.endPoint[1] + 1);

            for (var j = 0; j < baseSubsequence.length; j++) {
                score += scoreMatrix[baseSubsequence[j]][querySubsequence[j]];
            }

            diagonal.score = score;
        }
        return scoredDiagonals;
    }

    function scoreDiagonalsForEachBaseSequence(diagonalsBySequences, scoreMatrix, querySequence) {
        var scoredDiagonals = {};

        for (var sequence in diagonalsBySequences) {
            var diagonals = diagonalsBySequences[sequence];
            scoredDiagonals[sequence] = scoreDiagonals(diagonals, scoreMatrix, sequence, querySequence);
        }
        return scoredDiagonals;
    }

    fasta.scoreDiagonalsForEachBaseSequence = scoreDiagonalsForEachBaseSequence;
    fasta.scoreDiagonals = scoreDiagonals;
})(fasta = fasta || {});
