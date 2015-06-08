var fasta;
(function (fasta) {

    /**
     * Creates Smith-Waterman matrices for all base sequences
     * @param baseSequences
     * @param querySequence
     * @param scoreMatrix
     * @param gapPenalty
     * @returns matrices with cells format as follows: {value: cellValue, source: cellSource}
     *          cellValue - calculated value for this cell,
     *          cellSource - source, from which cell this cell was calculated
     */
    function createSmithWatermanMatrixForEachSequence(baseSequences, querySequence, scoreMatrix, gapPenalty) {
        var matrices = {},
            sequence;
        for (var i = 0; i < baseSequences.length; i++) {
            sequence = baseSequences[i];
            matrices[sequence] = createSmithWatermanMatrix(sequence, querySequence, scoreMatrix, gapPenalty);
        }
        return matrices;
    }

    /**
     * Creates Smith-Waterman matrix for given sequences
     * @param baseSequence
     * @param querySequence
     * @param scoreMatrix
     * @param gapPenalty
     * @returns matrix with cells format as follows: {value: cellValue, source: cellSource}
     *          cellValue - calculated value for this cell,
     *          cellSource - source, from which cell this cell was calculated
     */
    function createSmithWatermanMatrix(baseSequence, querySequence, scoreMatrix, gapPenalty) {
        var resultMatrix = initializeMatrix(baseSequence, querySequence),
            diagonal, left, top,
            cellValue, cellResult;

        for (var i = 1; i < (querySequence.length + 1); i++) {
            for (var j = 1; j < (baseSequence.length + 1); j++) {
                diagonal = resultMatrix[j-1][i-1].value + scoreMatrix[baseSequence[j-1]][querySequence[i-1]];
                left = resultMatrix[j][i - 1].value + gapPenalty;
                top = resultMatrix[j - 1][i].value + gapPenalty;

                cellValue = Math.max(0, diagonal, left, top);
                cellResult = {value: cellValue};

                if (cellValue !== 0) {
                    cellResult.source = getSource(cellValue, i, j, diagonal, left, top);
                }
                resultMatrix[j][i] = cellResult;
            }
        }
        return resultMatrix;
    }

    function getSource(value, i, j, diagonal, left, top) {
        if (value === diagonal) {
            return [j - 1, i -1];
        }
        if (value === left) {
            return [j, i - 1];
        }
        if (value === top) {
            return [j-1, i];
        }
    }

    function initializeMatrix(baseSequence, querySequence) {
        var matrix = new Array(baseSequence.length + 1);

        matrix[0] = Array.apply(null, new Array(querySequence.length + 1)).map(function() {
            return {value: 0};
        });
        for (var i = 1; i < matrix.length; i++) {
            matrix[i] = new Array(querySequence.length + 1);
            matrix[i][0] = {value: 0};
        }
        return matrix;
    }

    fasta.createSmithWatermanMatrixForEachSequence = createSmithWatermanMatrixForEachSequence;
    fasta.createSmithWatermanMatrix = createSmithWatermanMatrix;
})(fasta = fasta || {});
