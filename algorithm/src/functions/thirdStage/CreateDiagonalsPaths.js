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

    /**
     * Creates all possible diagonal paths from given list of diagonals.
     * At first, some initial start points (diagonals) are found - the ones that cannot be joined with first diagonal.
     * Next, from this starting points, all possible combinations of diagonals linking are generated.
     * It is similar to finding all possible paths in a tree.
     *
     * @param diagonals
     * @returns {Array} of all possible paths for given diagonals
     */
    function createDiagonalsPaths(diagonals) {
        var sortedDiagonals = diagonals.slice().sort(compareDiagonalsByStartPoint),
            startingDiagonals = getStartingDiagonals(sortedDiagonals),
            partialPaths,
            resultPaths = [];

        for (var i = 0; i < startingDiagonals.length; i++) {
            partialPaths = create([startingDiagonals[i]], sortedDiagonals.slice(i + 1), [], []);
            resultPaths = resultPaths.concat(partialPaths);
        }
        return resultPaths;
    }

    function compareDiagonalsByStartPoint(first, second) {
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
