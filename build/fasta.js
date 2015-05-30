function checkNotNull(obj)
{
   if (!obj) throw new Error("Null argument.");
   return obj;
}

Array.prototype.pushUnique = function(element)
{
   if (this.indexOf(element) < 0) {
      this.push(element);
   }
};

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

    function DiagonalsPath(diagonals, score) {
        this.diagonals = diagonals;
        //TODO: start and end points calculated from array?
        this.score = score;
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

// Calucalte diffrence of indexes in same tulples in query and example.
//
// @param example the IndexingArray of sequence from database
// @param query the IndexingArray of query sequence
// @return IndexingArray with hotspots
    function findHotspots(query, example) {
        checkNotNull(query);
        checkNotNull(example);
        var hotspots = {};

        for (var tuple in query) {
            if (example[tuple]) {

                var queryOffset = query[tuple];
                for (var i = 0; i < queryOffset.length; i++) {

                    var exampleOffset = example[tuple];
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

    fasta.findHotspots = findHotspots;
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

    function findDiagonals(hotspots, ktup, maxGapLength) {
        var diagonals = [],
            diagonalsOnLine,
            partialDiagonals,
            diagonalsOnLines = splitDiagonalsByLines(hotspots, ktup);

        for (var line in diagonalsOnLines) {
            diagonalsOnLine = diagonalsOnLines[line];

            partialDiagonals = generateJoinedDiagonals(diagonalsOnLine.sort(compareDiagonals), maxGapLength);

            diagonals.push.apply(diagonals, partialDiagonals);
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
        for(var i=0; i < array.length; i++) {
            if(array[i].startPoint === element.startPoint && array[i].endPoint === element.endPoint) {
                return false;
            }
        }
        return true;
    }

    fasta.findDiagonals = findDiagonals;
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

    function compareDiagonalsByScore(first, second) {
        if (first.score < second.score)
            return 1;
        if (first.score > second.score)
            return -1;
        return 0;
    }

    fasta.getBestDiagonals = getBestDiagonals;
})(fasta = fasta || {});

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

var fasta;
(function (fasta) {

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
        return first.startPoint[0] - second.startPoint[0] || first.startPoint[1] - second.startPoint[1];
    }

    function getStartingDiagonals(diagonals) {
        var firstDiagonal = diagonals[0],
            startingDiagonals = [firstDiagonal];
        for (var i = 1; i < diagonals.length; i++) {
            if (nextCanBeJoinedWithCurrent([firstDiagonal], diagonals[i])) {
                return startingDiagonals;
            }
            startingDiagonals = startingDiagonals.concat(diagonals[i]);
        }

        return startingDiagonals;
    }

    function lastDiagonal(rest) {
        return rest.slice(1).length === 0;
    }

    function create(current, rest, result, previous) {
        var nextDiagonal;
        if (current.length === 0 && rest.length === 0)
            return;

        if (rest.length === 0) {
            result.push(new fasta.DiagonalsPath(current));
            return result;
        }

        nextDiagonal = rest[0];

        if (nextCanBeJoinedWithAnyFromPrevious(nextDiagonal, previous)) {
            //as diagonals are sorted, if next can be joined with any from previously joined,
            //there is no need to check the rest of them, as they all can be joined the same way
            return result;
        }

        if (nextCanBeJoinedWithCurrent(current, nextDiagonal)) {
            if (lastDiagonal(rest)) {
                result.push(new fasta.DiagonalsPath(current.concat([nextDiagonal])));
            } else {
                //go deeper with next diagonal joined current
                create(current.concat([nextDiagonal]), rest.slice(1), result, []);

                //continue without next diagonal
                create(current, rest.slice(1), result, previous.concat([nextDiagonal]));
            }
        } else {
            //skip next diagonal and continue
            create(current, rest.slice(1), result, previous);
        }
        return result;
    }

    function nextCanBeJoinedWithCurrent(current, next) {
        var currentEnd = current[current.length - 1].endPoint,
            nextStart = next.startPoint;

        return (nextStart[0] >= currentEnd[0] && nextStart[1] >= currentEnd[1]);
    }

    function nextCanBeJoinedWithAnyFromPrevious(next, previous) {
        var nextStart = next.startPoint,
            previousEnd;

        for (var i = 0; i < previous.length; i++) {
            previousEnd = previous[i].endPoint;

            if (nextStart[0] >= previousEnd[0] && nextStart[1] >= previousEnd[1]) {
                return true;
            }
        }
        return false;
    }

    fasta.createDiagonalsPaths = createDiagonalsPaths;
})(fasta = fasta || {});

/**
 * Created by kubex on 2015-05-28.
 */

/**
 * Created by kubex on 2015-05-28.
 */

/**
 * Created by kubex on 2015-05-28.
 */
