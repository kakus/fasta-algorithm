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

    /**
     * Calculates score for path, as a sum of diagonals score and penalty for distance between them.
     * Distance is calculated as a single difference on both coordinates between endPoint of one diagonal and startPoint of the other,
     * multiplied by given gapPenalty.
     * @param paths
     * @param gapPenalty
     * @returns {Array}
     */
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
