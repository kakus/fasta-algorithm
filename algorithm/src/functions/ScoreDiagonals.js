var fasta;
(function (fasta) {

    /**
     * Scores given array of diagonals. Returns same array as input, but with scored diagonals.
     * WARNING: Objects in original array will be modified by setting score!
     *
     * @param diagonals
     * @param scoreMatrix
     * @param baseSequence
     * @param querySequence
     * @returns {*}
     */
    function scoreDiagonals(diagonals, scoreMatrix, baseSequence, querySequence) {
        var diagonal,
            querySubsequence,
            baseSubsequence,
            score;
        for (var i = 0; i < diagonals.length; i++) {
            score = 0;
            diagonal = diagonals[i];
            baseSubsequence = baseSequence.substring(diagonal.startPoint[0], diagonal.endPoint[0] + 1);
            querySubsequence = querySequence.substring(diagonal.startPoint[1], diagonal.endPoint[1] + 1);

            //TODO: move to diagonal object?
            for (var j = 0; j < baseSubsequence.length; j++) {
                score += scoreMatrix[baseSubsequence[j]][querySubsequence[j]];
            }

            diagonal.score = score;
        }
        return diagonals;
    }

    fasta.scoreDiagonals = scoreDiagonals;
})(fasta = fasta || {});
