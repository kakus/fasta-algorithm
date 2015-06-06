var fasta;
(function (fasta) {

    function getPathsForBestSequences(pathsBySequences) {

        return fasta.utils.getBestSequences(pathsBySequences, function(paths) {
            return paths[0].score;
        });
    }

    fasta.getPathsForBestSequences = getPathsForBestSequences;
})(fasta = fasta || {});
