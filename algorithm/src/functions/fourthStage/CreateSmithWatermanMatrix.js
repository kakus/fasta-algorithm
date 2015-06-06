var fasta;
(function (fasta) {

    function createSmithWatermanMatrixForEachSequence(baseSequences, querySequence, scoreMatrix, gapPenalty) {
        var matrices = {},
            sequence;
        for (var i = 0; i < baseSequences.length; i++) {
            sequence = baseSequences[i];
            matrices[sequence] = createSmithWatermanMatrix(sequence, querySequence, scoreMatrix, gapPenalty);
        }
        return matrices;
    }

    function createSmithWatermanMatrix(baseSequence, querySequence, scoreMatrix, gapPenalty) {
        var resultMatrix = initializeMatrix(baseSequence, querySequence),
            diagonal, left, top,
            cellValue, cellSource, cellResult;

        for (var i = 1; i < (querySequence.length + 1); i++) {
            for (var j = 1; j < (baseSequence.length + 1); j++) {
                diagonal = resultMatrix[j-1][i-1].value + scoreMatrix[baseSequence[j-1]][querySequence[i-1]];
                left = resultMatrix[j][i - 1].value + gapPenalty;
                top = resultMatrix[j - 1][i].value + gapPenalty;

                cellValue = Math.max(0, diagonal, left, top);

                if (cellValue !== 0) {
                    cellSource = getSource(cellValue, i, j, diagonal, left, top);
                    cellResult = {value: cellValue, source: cellSource};
                } else {
                    cellResult = {value: cellValue};
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
