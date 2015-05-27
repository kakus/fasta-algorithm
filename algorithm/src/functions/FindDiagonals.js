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
