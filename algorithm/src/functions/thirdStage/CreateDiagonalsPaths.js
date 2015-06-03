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

    function lastDiagonal(rest) {
        return rest.slice(1).length === 0;
    }

    function create(current, rest, result, previous) {
        var nextDiagonal;
        if (current.length === 0 && rest.length === 0)
            return;

        if (rest.length === 0) {
            if (currentIsNotSubPath(current, result)) {
                result.push(new fasta.DiagonalsPath(current));
            }
            return result;
        }
        nextDiagonal = rest[0];

        //TODO: można dodać warunek, żeby nie dodawać kolejnego diagonala, jak zbyt mała ocena?
        //jedynie w celu optymalizacji, bo i tak one będą odrzucone na dalszych etapach

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

    function currentIsNotSubPath(current, paths) {
        var path,
            isSubset = false;
        for (var i = 0; i < paths.length; i++) {
            path = paths[i];
            if (path.diagonals.length <= current) {
                continue;
            }
            isSubset = true;
            for (var j = 0; j < current.length; j++) {
                if (current[j] !== path.diagonals[j]) {
                    isSubset = false;
                    break;
                }
            }
            if (isSubset) {
                return false;
            }
        }
        return true;
    }

    function nextCanBeJoinedWithCurrent(current, next) {
        var currentEnd = current[current.length - 1].endPoint,
            nextStart = next.startPoint;

        return (nextStart[0] >= currentEnd[0] && nextStart[1] >= currentEnd[1]);
    }

    fasta.createDiagonalsPathsForEachSequence = createDiagonalsPathsForEachSequence;
    fasta.createDiagonalsPaths = createDiagonalsPaths;
})(fasta = fasta || {});
