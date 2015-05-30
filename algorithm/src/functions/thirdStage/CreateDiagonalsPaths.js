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
