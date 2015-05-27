var fasta;
(function (fasta) {

    function getBestDiagonals(diagonals) {
        if (diagonals.length <= 10) {
            return diagonals.slice();
        }

        var sorted = diagonals.sort(compareDiagonalsByScore);
        return sorted.slice(0, 10);
    }

    function compareDiagonalsByScore(first, second) {
        if (first.score < second.score)
            return 1;
        if (first.score > second.score)
            return -1;
        return 0;
    }

    fasta.getBestDiagonals = getBestDiagonals;
})(fasta = fasta || {});
