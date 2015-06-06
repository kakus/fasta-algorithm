var fasta;
(function (fasta) {

    function findSWSolutionsForEachSequence(swMatricesBySequences) {
        var solutions = {},
            sequence, swMatrix;
        for (sequence in swMatricesBySequences) {
            swMatrix = swMatricesBySequences[sequence];
            solutions[sequence] = findSWSolutions(swMatrix);
        }

        return solutions;
    }

    function findSWSolutions(swMatrix) {
        var solutions = [],
            maxCellsIndices = findMaximumValues(swMatrix),
            maxCellIndices, maxCell, solution;

        for (var i = 0; i < maxCellsIndices.length; i++) {
            maxCellIndices = maxCellsIndices[i];
            maxCell = swMatrix[maxCellIndices[0]][maxCellIndices[1]];
            solution = {score: maxCell.value};
            solution.path = recreatePath(maxCellIndices, swMatrix);
            solutions.push(solution);
        }
        return solutions;
    }

    function findMaximumValues(swMatrix) {
        var row,
            cell, currentValue,
            maxValue = 0,
            maxCells = [];
        for (var i = 0; i < swMatrix.length; i++) {
            row = swMatrix[i];
            for (var j = 0; j < row.length; j++) {
                cell = row[j];
                currentValue = cell.value;
                if (currentValue === maxValue) {
                    maxCells.push([i, j]);
                } else if (currentValue > maxValue) {
                    maxValue = currentValue;
                    maxCells = [[i, j]];
                }
            }
        }
        return maxCells;
    }

    function recreatePath(maxCellIndices, swMatrix) {
        var path = [],
            cell = swMatrix[maxCellIndices[0]][maxCellIndices[1]],
            indices = [maxCellIndices[0], maxCellIndices[1]];

        while(cell.value > 0) {
            path.unshift(indices);
            indices = cell.source;
            cell = swMatrix[indices[0]][indices[1]];
        }
        return path;
    }

    fasta.findSWSolutionsForEachSequence = findSWSolutionsForEachSequence;
    fasta.findSWSolutions = findSWSolutions;
})(fasta = fasta || {});