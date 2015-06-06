function checkNotNull(obj) {
    if (!obj) throw new Error("Null argument.");
    return obj;
}

Array.prototype.pushUnique = function (element) {
    if (this.indexOf(element) < 0) {
        this.push(element);
    }
};

var fasta;
(function (fasta) {

    function getBestSequences(dataBySequences, calculateScore) {
        var scoredSequences = [],
            data,
            score,
            half_length,
            result = {};

        for (var sequence in dataBySequences) {
            data = dataBySequences[sequence];
            score = calculateScore(data);
            scoredSequences.push({sequence: sequence, score: score});
        }

        scoredSequences.sort(function(a,b) {return b.score - a.score});
        half_length = Math.ceil(scoredSequences.length / 2);
        scoredSequences = scoredSequences.slice(0, half_length);
        for (var i = 0; i < scoredSequences.length; i++ ) {
            result[scoredSequences[i].sequence] = dataBySequences[scoredSequences[i].sequence];
        }

        return result;
    }

    fasta.utils = fasta.utils || {};
    fasta.utils.getBestSequences = getBestSequences;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

    function Alignment(baseAlignment, queryAlignment, baseOffset, queryOffset) {
        this.baseAlignment = baseAlignment;
        this.queryAlignment = queryAlignment;
        this.baseOffset = baseOffset;
        this.queryOffset = queryOffset;
    }

    fasta.Alignment = Alignment;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

    function Diagonal(startPoint, endPoint, score) {
        this.startPoint = startPoint; // [int x, int y]
        this.endPoint = endPoint; // [int x, int y]
        this.score = score;
    }

    fasta.Diagonal = Diagonal;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

    function DiagonalsPath(diagonals, score, alignment) {
        this.diagonals = diagonals;
        this.score = score;
        this.alignment = alignment;
    }

    fasta.DiagonalsPath = DiagonalsPath;
})(fasta = fasta || {});

var fasta;
(function(fasta) {

    function HotSpot(difference, startIndices) {
        this.difference = difference;
        this.startIndices = startIndices;
    }

fasta.HotSpot = HotSpot;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

// Calcucalte difference of indexes in same tuples in query and example.
//
// @param example the IndexingArray of sequence from database
// @param query the IndexingArray of query sequence
// @return object with hotspots
    function findHotspots(query, base) {
        checkNotNull(query);
        checkNotNull(base);
        var hotspots = {};

        for (var tuple in query) {
            if (base[tuple]) {

                var queryOffset = query[tuple];
                for (var i = 0; i < queryOffset.length; i++) {

                    var exampleOffset = base[tuple];
                    for (var j = 0; j < exampleOffset.length; j++) {
                        var hotSpot = new fasta.HotSpot(exampleOffset[j] - queryOffset[i],
                            {query: queryOffset[i], base: exampleOffset[j]});
                        if (!hotspots[tuple]) {
                            hotspots[tuple] = [];
                        }
                        hotspots[tuple].pushUnique(hotSpot);
                    }
                }

            }
        }
        return hotspots;
    }

    function findHotspotsForMultipleSequences(query, baseArrays) {
        var hotspots = {};

        for (var baseSequence in baseArrays) {
            var base = baseArrays[baseSequence];
            hotspots[baseSequence] = findHotspots(query, base);
        }
        return hotspots;
    }

    fasta.findHotspots = findHotspots;
    fasta.findHotspotsForMultipleSequences = findHotspotsForMultipleSequences;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

    function getHotSpotsForBestSequences(hotSpotsBySequences) {

        return fasta.utils.getBestSequences(hotSpotsBySequences, function(hotSpots) {
            var score = 0;
            for (var hotSpotSequence in hotSpots) {
                score += hotSpots[hotSpotSequence].length;
            }
            return score;
        });
    }

    fasta.getHotSpotsForBestSequences = getHotSpotsForBestSequences;
})(fasta = fasta || {});


var fasta;
(function(fasta) {

// First step in FASTA algorithm.
// Find all tuples/fragments (unique combination of symbols) of length ktup in given
// sequence, also store offset of appearance of tuple in sequence.
//
// This object is a map where key <String> is the tuple, and value <Array<number>> is
// array of offsets where this tuple appears.
// @example
//    var array = new IndexingArray('ABA', 2);
//    array['AB']; // will return [0]
function IndexingArray(sequence, ktup)
{
   checkNotNull(sequence);
   checkNotNull(ktup);

   if (sequence.length < ktup) {
      throw new Error("ktup must be greater or equal to sequence length");
   }

   for(var i = 0; i <= sequence.length - ktup; ++i) {

      var tuple = sequence.substring(i, i + ktup);

      if (this[tuple]) {
         this[tuple].push(i);
      }
      else {
         this[tuple] = [i];
      }
   }
}

fasta.IndexingArray = IndexingArray;
})(fasta = fasta || {});

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
var fasta;
(function (fasta) {

    function getSWAlignmentsForEachSequence(solutionsBySequences, querySequence) {
        var alignments = {},
            sequence, solutions;
        for (sequence in solutionsBySequences) {
            solutions = solutionsBySequences[sequence];
            alignments[sequence] = getSWAlignments(solutions, sequence, querySequence);
        }

        return alignments;
    }

    function getSWAlignments(solutions, baseSequence, querySequence) {
        var alignments = [];
        for (var i = 0; i < solutions.length; i++) {
            alignments.push(getSWAlignment(solutions[i], baseSequence, querySequence));
        }
        return alignments;
    }

    function getSWAlignment(solution, baseSequence, querySequence) {
        var path = solution.path,
            current,
            previous = path[0],
            baseOffset = previous[0] - 1,
            queryOffset = previous[1] - 1,
            baseAlignment = baseSequence.substr(previous[0] - 1, 1),
            queryAlignment = querySequence.substr(previous[1] - 1, 1);

        for (var i = 1; i < path.length; i++) {
            current = path[i];
            if (current[0] === previous[0]) {
                baseAlignment += '-';
                queryAlignment += querySequence.substr(current[1] - 1, 1);
            } else if (current[1] === previous[1]) {
                baseAlignment += baseSequence.substr(current[0] - 1, 1);
                queryAlignment += '-';
            } else {
                baseAlignment += baseSequence.substr(current[0] - 1, 1);
                queryAlignment += querySequence.substr(current[1] - 1, 1);
            }
            previous = current;
        }

        return new fasta.Alignment(baseAlignment, queryAlignment, baseOffset, queryOffset);
    }

    fasta.getSWAlignmentsForEachSequence = getSWAlignmentsForEachSequence;
    fasta.getSWAlignments = getSWAlignments;
})(fasta = fasta || {});
var fasta;
(function (fasta) {

    function findDiagonalsForEachBaseSequence(hotspotsBySequences, ktup, maxGapLength) {
        var diagonals = {};

        for (var sequence in hotspotsBySequences) {
            var hotSpots = hotspotsBySequences[sequence];
            diagonals[sequence] = findDiagonals(hotSpots, ktup, maxGapLength);
        }
        return diagonals;
    }

    function findDiagonals(hotspots, ktup, maxGapLength) {
        var diagonals = [],
            diagonalsOnLine,
            partialDiagonals,
            diagonalsOnLines = splitDiagonalsByLines(hotspots, ktup);

        for (var line in diagonalsOnLines) {
            diagonalsOnLine = diagonalsOnLines[line];

            partialDiagonals = generateJoinedDiagonals(diagonalsOnLine.sort(compareDiagonals), maxGapLength);

            diagonals = diagonals.concat(partialDiagonals);
        }

        return diagonals;
    }

    function splitDiagonalsByLines(hotspots, ktup) {
        var diagonalsOnLines = {},
            hotspotsForSequence,
            diagonal;
        for (var sequence in hotspots) {
            hotspotsForSequence = hotspots[sequence];
            for (var i = 0; i < hotspotsForSequence.length; i++) {
                var hotspot = hotspotsForSequence[i];
                diagonal = new fasta.Diagonal([hotspot.startIndices.base, hotspot.startIndices.query],
                    [hotspot.startIndices.base + (ktup - 1), hotspot.startIndices.query + (ktup - 1)]);
                if (!diagonalsOnLines[hotspot.difference]) {
                    diagonalsOnLines[hotspot.difference] = [];
                }
                diagonalsOnLines[hotspot.difference].pushUnique(diagonal);
            }
        }
        return diagonalsOnLines;
    }

    function generateJoinedDiagonals(diagonals, maxGapLength) {

        return generate(diagonals[0], diagonals.slice(1), []);

        function generate(active, rest, result) {
            var nextDiagonal;
            if (active.length === 0 && rest.length === 0)
                return;
            if (rest.length === 0) {
                if (notIsDuplicate(result, active)) {
                    result.push(active);
                }
            } else {
                nextDiagonal = rest[0];
                if (shouldBeJoinedWithGap(active.endPoint[0], nextDiagonal.startPoint[0])) {
                    //create new diagonal with gap and generate next ones from it
                    var diagonal = new fasta.Diagonal(active.startPoint, nextDiagonal.endPoint);
                    generate(diagonal, rest.slice(1), result);
                }
                if (areDiagonalsNotOverlapping(active.endPoint[0], nextDiagonal.startPoint[0])) {
                    generate(active, [], result);   //add current diagonal (just to avoid check in 2 places)

                    //continue without current diagonal - diagonals are sorted by start points,
                    //so if current diagonal is not overlapping with next one, it won't overlap with any other
                    generate(nextDiagonal, rest.slice(1), result);
                }
            }
            return result;
        }

        function shouldBeJoinedWithGap(endPoint, nextStartPoint) {
            return endPoint + (maxGapLength + 1) >= nextStartPoint;
        }

        function areDiagonalsNotOverlapping(endPoint, nextStartPoint) {
            return endPoint < nextStartPoint;
        }
    }

    function compareDiagonals(first, second) {
        if (first.startPoint[0] < second.startPoint[0])
            return -1;
        if (first.startPoint[0] > second.startPoint[0])
            return 1;
        return 0;
    }

    function notIsDuplicate(array, element) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].startPoint === element.startPoint && array[i].endPoint === element.endPoint) {
                return false;
            }
        }
        return true;
    }

    fasta.findDiagonals = findDiagonals;
    fasta.findDiagonalsForEachBaseSequence = findDiagonalsForEachBaseSequence;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

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

var fasta;
(function (fasta) {

    function getDiagonalsForBestSequences(diagonalsBySequences) {

        return fasta.utils.getBestSequences(diagonalsBySequences, function(diagonals) {
            var score = 0;
            for (var j = 0; j < diagonals.length; j++) {
                score += diagonals[j].score;
            }
            return score;
        });
    }

    fasta.getDiagonalsForBestSequences = getDiagonalsForBestSequences;
})(fasta = fasta || {});
var fasta;
(function (fasta) {

    /**
     * Scores given array of diagonals. Returns same array as input, but with scored diagonals.
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
            score,
            scoredDiagonals = diagonals.slice();
        for (var i = 0; i < scoredDiagonals.length; i++) {
            score = 0;
            diagonal = scoredDiagonals[i];
            baseSubsequence = baseSequence.substring(diagonal.startPoint[0], diagonal.endPoint[0] + 1);
            querySubsequence = querySequence.substring(diagonal.startPoint[1], diagonal.endPoint[1] + 1);

            //TODO: move to diagonal object?
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

var fasta;
(function (fasta) {

    function createDiagonalsPathsForEachSequence(diagonalsBySequences) {
        var paths = {};

        for (var sequence in diagonalsBySequences) {
            var diagonals = diagonalsBySequences[sequence];
            paths[sequence] = createDiagonalsPaths(diagonals);
        }
        return paths;
    }

    function createDiagonalsPaths(diagonals) {
        var sortedDiagonals = diagonals.slice().sort(compareDiagonalsByStart),
            startingDiagonals = getStartingDiagonals(sortedDiagonals),
            partialPaths,
            resultPaths = [];

        for (var i = 0; i < startingDiagonals.length; i++) {
            partialPaths = create([startingDiagonals[i]], sortedDiagonals.slice(i + 1), [], []);
            resultPaths = resultPaths.concat(partialPaths);
        }
        return resultPaths;
    }

    function compareDiagonalsByStart(first, second) {
        return first.startPoint[1] - second.startPoint[1] || first.startPoint[0] - second.startPoint[0];
    }

    function getStartingDiagonals(diagonals) {
        var firstDiagonal = diagonals[0],
            startingDiagonals = [firstDiagonal];
        for (var i = 1; i < diagonals.length; i++) {
            if (nextCanBeJoinedWithCurrent([firstDiagonal], diagonals[i])) {
                continue;
            }
            startingDiagonals = startingDiagonals.concat(diagonals[i]);
        }

        return startingDiagonals;
    }

    function create(current, rest, result) {
        var nextDiagonal;
        if (current.length === 0 && rest.length === 0)
            return;

        if (rest.length === 0) {
            result.push(new fasta.DiagonalsPath(current));
            return result;
        }
        nextDiagonal = rest[0];

        //TODO: mo¿na dodaæ warunek, ¿eby nie dodawaæ kolejnego diagonala, jak zbyt ma³a ocena?
        //jedynie w celu optymalizacji, bo i tak one bêd¹ odrzucone na dalszych etapach

        if (nextCanBeJoinedWithCurrent(current, nextDiagonal)) {
            //go deeper with next diagonal joined current
            create(current.concat([nextDiagonal]), rest.slice(1), result);

            //continue without next diagonal
            create(current, rest.slice(1), result);
        } else {
            //skip next diagonal and continue
            create(current, rest.slice(1), result);
        }
        return result;
    }

    function nextCanBeJoinedWithCurrent(current, next) {
        var currentEnd = current[current.length - 1].endPoint,
            nextStart = next.startPoint;

        return (nextStart[0] >= currentEnd[0] && nextStart[1] >= currentEnd[1]);
    }

    fasta.createDiagonalsPathsForEachSequence = createDiagonalsPathsForEachSequence;
    fasta.createDiagonalsPaths = createDiagonalsPaths;
})(fasta = fasta || {});


var fasta;
(function (fasta) {

    function getAlignmentOfBestPathForEachSequence(pathsBySequences, querySequence) {
        var pathsWithAlignmentsBySequences = {};

        for (var sequence in pathsBySequences) {
            var path = pathsBySequences[sequence][0],
                alignment = getAlignment(path, sequence, querySequence);
            pathsWithAlignmentsBySequences[sequence] = [new fasta.DiagonalsPath(path.diagonals, path.score, alignment)];
        }
        return pathsWithAlignmentsBySequences;
    }

    function getAlignment(path, baseSequence, querySequence) {
        var diagonals = path.diagonals,
            previous = diagonals[0],
            baseAlignment = baseSequence.substring(previous.startPoint[0], previous.endPoint[0] + 1),
            queryAlignment = querySequence.substring(previous.startPoint[1], previous.endPoint[1] + 1);

        for (var i = 1; i < diagonals.length; i++) {
            var current = diagonals[i];
            baseAlignment += createBaseAlignment(current, previous, baseSequence);
            queryAlignment += createQueryAlignment(current, previous, querySequence);
            previous = current;
        }

        return new fasta.Alignment(baseAlignment, queryAlignment, diagonals[0].startPoint[0], diagonals[0].startPoint[1]);
    }

    function createBaseAlignment(current, previous, baseSequence) {
        var baseAlignment = Array((current.startPoint[1] - previous.endPoint[1])).join('-'),
            additionalBase = 0;

        if (current.startPoint[0] === previous.endPoint[0]) {
            baseAlignment += '-';
            additionalBase = 1;
        } else {
            baseAlignment += baseSequence.substring(previous.endPoint[0] + 1, current.startPoint[0]);
        }
        baseAlignment += baseSequence.substring(current.startPoint[0] + additionalBase, current.endPoint[0] + 1);

        return baseAlignment;
    }

    function createQueryAlignment(current, previous, querySequence) {
        var queryAlignment = "",
            additionalQuery = 0;
        if (current.startPoint[1] !== previous.endPoint[1]) {
            queryAlignment += querySequence.substring(previous.endPoint[1] + 1, current.startPoint[1]);
        } else {
            queryAlignment += '-';
            additionalQuery = 1;
        }
        queryAlignment += Array((current.startPoint[0] - previous.endPoint[0])).join('-');
        queryAlignment += querySequence.substring(current.startPoint[1] + additionalQuery, current.endPoint[1] + 1);

        return queryAlignment;
    }

    fasta.getAlignmentOfBestPathForEachSequence = getAlignmentOfBestPathForEachSequence;
    fasta.getAlignment = getAlignment;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

    function getBestPathsForEachSequence(pathsBySequences) {
        var bestPathsBySequences = {};

        for (var sequence in pathsBySequences) {
            var paths = pathsBySequences[sequence];
            bestPathsBySequences[sequence] = [getBestDiagonalsPath(paths)];
        }
        return bestPathsBySequences;
    }

    function getBestDiagonalsPath(paths) {
        var copy = paths.slice();
        copy.sort(compareByScore);
        return copy[0];
    }

    function compareByScore(first, second) {
        return second.score - first.score;
    }

    fasta.getBestPathsForEachSequence = getBestPathsForEachSequence;
    fasta.getBestDiagonalsPath = getBestDiagonalsPath;
})(fasta = fasta || {});
var fasta;
(function (fasta) {

    function getPathsForBestSequences(pathsBySequences) {

        return fasta.utils.getBestSequences(pathsBySequences, function(paths) {
            return paths[0].score;
        });
    }

    fasta.getPathsForBestSequences = getPathsForBestSequences;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

    function scoreDiagonalsPathsForEachSequence(pathsBySequences, gapPenalty) {
        var scoredPathsBySequences = {};

        for (var sequence in pathsBySequences) {
            var paths = pathsBySequences[sequence];
            scoredPathsBySequences[sequence] = scoreDiagonalsPaths(paths, gapPenalty);
        }
        return scoredPathsBySequences;
    }

    function scoreDiagonalsPaths(paths, gapPenalty) {
        var scoredPaths = [],
            path;
        for (var i = 0; i < paths.length; i++) {
            path = scorePath(paths[i], gapPenalty);
            scoredPaths.push(path);
        }
        return scoredPaths;
    }

    function scorePath(path, gapPenalty) {
        var diagonals = path.diagonals,
            previous = diagonals[0],
            current,
            totalScore = previous.score;
        for (var i = 1; i < diagonals.length; i++) {
            current = diagonals[i];

            totalScore += current.score;
            totalScore += gapPenalty *
                ((current.startPoint[0] - previous.endPoint[0]) + (current.startPoint[1] - previous.endPoint[1]));

            previous = current;
        }
        return new fasta.DiagonalsPath(diagonals, totalScore);
    }

    fasta.scoreDiagonalsPathsForEachSequence = scoreDiagonalsPathsForEachSequence;
    fasta.scoreDiagonalsPaths = scoreDiagonalsPaths;
})(fasta = fasta || {});
