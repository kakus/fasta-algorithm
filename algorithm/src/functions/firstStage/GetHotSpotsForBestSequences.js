var fasta;
(function (fasta) {

    function getHotSpotsForBestSequences(hotSpotsBySequences) {

        return fasta.utils.getBestSequences(hotSpotsBySequences, function(hotSpots) {
            var score = 0;
            for (var hotSpotSequence in hotSpots) {
                score += hotSpots[hotSpotSequence].length;
            }
            return score;
        });
    }

    fasta.getHotSpotsForBestSequences = getHotSpotsForBestSequences;
})(fasta = fasta || {});

