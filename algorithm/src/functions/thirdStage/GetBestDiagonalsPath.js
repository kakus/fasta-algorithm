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

    /**
     * Returns one path with best score
     * @param paths
     * @returns {*|T}
     */
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