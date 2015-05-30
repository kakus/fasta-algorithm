var fasta;
(function (fasta) {

    function getBestDiagonalsPath(paths) {
        var copy = paths.slice();
        copy.sort(compareByScore);
        return copy[0];
    }

    function compareByScore(first, second) {
        return second.score - first.score;
    }

    fasta.getBestDiagonalsPath = getBestDiagonalsPath;
})(fasta = fasta || {});