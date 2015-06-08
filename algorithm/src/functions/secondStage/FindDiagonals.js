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

    /**
     * Find all possible diagonals for given hotSpots. Close hotspots are joined together to generate diagonal.
     * If given hotspot doesn't have close other hotspot, it becomes new diagonal.
     * Resulting array doesn't contain duplicates.
     *
     * @param hotspots
     * @param ktup
     * @param maxGapLength - determines max distance between hotspots, that can be joined to create diagonal
     * @returns {Array} containing all generated fasta.Diagonal objects.
     *          All Diagonal object will contain startPoint and endPoint, where as first value are coordinates of base sequence
     */
    function findDiagonals(hotspots, ktup, maxGapLength) {
        var diagonals = [],
            diagonalsOnLine,
            partialDiagonals,
            diagonalsOnLines = splitDiagonalsByLines(hotspots, ktup);

        for (var line in diagonalsOnLines) {
            diagonalsOnLine = diagonalsOnLines[line];

            partialDiagonals = generateDiagonals(diagonalsOnLine.sort(compareDiagonals), maxGapLength);

            diagonals = diagonals.concat(partialDiagonals);
        }

        return diagonals;
    }

    function splitDiagonalsByLines(hotspots, ktup) {
        var diagonalsOnLines = {},
            hotspotsForSequence,
            diagonal, hotspot;
        for (var sequence in hotspots) {
            hotspotsForSequence = hotspots[sequence];
            for (var i = 0; i < hotspotsForSequence.length; i++) {
                hotspot = hotspotsForSequence[i];
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

    function generateDiagonals(diagonals, maxGapLength) {

        return generate(diagonals[0], diagonals.slice(1), []);

        function generate(active, rest, result) {
            var nextDiagonal;
            if (active.length === 0 && rest.length === 0)
                return;
            if (rest.length === 0) {
                if (isNotDuplicate(result, active)) {
                    result.push(active);
                }
            } else {
                nextDiagonal = rest[0];
                if (shouldBeJoinedWithPossibleGap(active.endPoint[0], nextDiagonal.startPoint[0])) {
                    //create new diagonal with gap and generate next ones from it
                    var diagonal = new fasta.Diagonal(active.startPoint, nextDiagonal.endPoint);
                    generate(diagonal, rest.slice(1), result);
                }
                if (diagonalsAreNotOverlapping(active.endPoint[0], nextDiagonal.startPoint[0])) {
                    generate(active, [], result);   //add current diagonal (just to avoid check in 2 places)

                    //continue without current diagonal - diagonals are sorted by start points,
                    //so if current diagonal is not overlapping with next one, it won't overlap with any other
                    generate(nextDiagonal, rest.slice(1), result);
                }
            }
            return result;
        }

        function shouldBeJoinedWithPossibleGap(endPoint, nextStartPoint) {
            return endPoint + (maxGapLength + 1) >= nextStartPoint;
        }

        function diagonalsAreNotOverlapping(endPoint, nextStartPoint) {
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

    function isNotDuplicate(array, element) {
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
