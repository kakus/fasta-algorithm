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
(function(fasta) {

    function HotSpot(difference, startIndices) {
        this.difference = difference;
        this.startIndices = startIndices;
    }

fasta.HotSpot = HotSpot;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

    function Diagonal(startPoint, endPoint) {
        this.startPoint = startPoint; // [int x, int y]
        this.endPoint = endPoint; // [int x, int y]
        this.score = undefined;
    }

    fasta.Diagonal = Diagonal;
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
