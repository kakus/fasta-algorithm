var fasta;
(function (fasta) {

    function getDiagonalsForBestSequences(diagonalsBySequences) {

        return fasta.utils.getBestSequences(diagonalsBySequences, function(diagonals) {
            var score = 0;
            for (var j = 0; j < diagonals.length; j++) {
                score += diagonals[j].score;
            }
            return score;
        });
    }

    fasta.getDiagonalsForBestSequences = getDiagonalsForBestSequences;
})(fasta = fasta || {});