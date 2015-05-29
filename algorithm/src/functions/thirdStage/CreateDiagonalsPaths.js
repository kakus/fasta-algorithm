var fasta;
(function (fasta) {

    function createDiagonalsPaths(diagonals, maxGap) {

        return createPaths(diagonals, 0);

        function createPaths(diagonals, maxGapLength) {

            return create([diagonals[0]], diagonals.slice(1), [], []);

            function create(current, rest, result, previous) {
                var nextDiagonal;
                if (current.length === 0 && rest.length === 0)
                    return;
                if (rest.length === 0) {
                    console.log('push');
                    for (var i = 0; i < current.length; i++) {
                        console.log(current[i].score);
                    }
                    result.push(new fasta.DiagonalsPath(current));
                } else {
                    nextDiagonal = rest[0];
                    console.log('new');
                    for (var j = 0; j < current.length; j++) {
                        console.log(current[j].score);
                    }
                    console.log('next');
                    console.log(nextDiagonal.score);
                    if (nextStartsAfter(current, nextDiagonal)) {
                        if (nextAfterPrevious(nextDiagonal, previous)) {
                            return result;
                        }
                        if (rest.slice(1).length === 0) {
                            console.log('push 2');
                            var arr = current.slice();
                            arr.push(nextDiagonal);
                            result.push(new fasta.DiagonalsPath(arr));
                        } else {
                            var newArray = current.slice();
                            newArray.push(nextDiagonal);

                            console.log('a');
                            create(newArray, rest.slice(1), result, []);
                            console.log('b');

                            var newPrevious = previous.slice();
                            newPrevious.push(nextDiagonal);
                            create(current, rest.slice(1), result, newPrevious);
                        }
                    } else {
                        console.log('c');
                        create(current, rest.slice(1), result, previous);
                    }
                }
                return result;
            }

            function nextStartsAfter(current, next) {
                var currentEnd = current[current.length - 1].endPoint,
                    nextStart = next.startPoint;

                return (nextStart[0] >= currentEnd[0] && nextStart[1] >= currentEnd[1]);
            }

            function nextAfterPrevious(next, previous) {
                var nextStart = next.startPoint,
                    previousEnd;

                for (var i = 0; i < previous.length; i++) {
                    previousEnd = previous[i].endPoint;

                    if (nextStart[0] <= previousEnd[0] && nextStart[1] <= previousEnd[1]) {
                        return false
                    }
                }
                return previous.length !== 0;
            }
        }
    }

    fasta.createDiagonalsPaths = createDiagonalsPaths;
})(fasta = fasta || {});
