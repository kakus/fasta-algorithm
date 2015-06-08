var fasta;
(function (fasta) {

    /**
     * Selects half of sequences with largest number of hotspots on single diagonal
     */
    function getHotSpotsForBestSequences(hotSpotsBySequences) {

        return fasta.utils.getBestSequences(hotSpotsBySequences, function(hotSpots) {
            var scoreForLines = {},
                sortable = [];

            if (hotSpots === {}) {
                return 0;
            }

            for (var hotSpotSequence in hotSpots) {
                var hotSpotsForSequence = hotSpots[hotSpotSequence];
                for (var i = 0; i < hotSpotsForSequence.length; i++) {
                    var hotSpot = hotSpotsForSequence[i];
                    if (!scoreForLines[hotSpot.difference]) {
                        scoreForLines[hotSpot.difference] = 0;
                    }
                    scoreForLines[hotSpot.difference] += 1;
                }
            }

            for (var line in scoreForLines) {
                sortable.push([line, scoreForLines[line]])
            }
            sortable.sort(function(a, b) {return b[1] - a[1]});
            return sortable[0][1];
        });
    }

    fasta.getHotSpotsForBestSequences = getHotSpotsForBestSequences;
})(fasta = fasta || {});

