var fasta;
(function (fasta) {

    function getDiagonalsForBestSequences(diagonalsBySequences) {

        return fasta.utils.getBestSequences(diagonalsBySequences, function(diagonals) {
            var sortable = [];
            for (var i = 0; i < diagonals.length; i++) {
                sortable.push(diagonals[i].score);
            }

            sortable.sort(function(a, b) {return b - a});
            return sortable[0];
        });
    }

    fasta.getDiagonalsForBestSequences = getDiagonalsForBestSequences;
})(fasta = fasta || {});