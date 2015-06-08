var fasta;
(function (fasta) {

    /** Calculate hotSpots -  difference of indexes in same tuples in query and example.
     *
     * @param base the IndexingArray of sequence from database
     * @param query the IndexingArray of query sequence
     * @return object containing fasta.HotSpots for each k-tuple
     */
    function findHotspots(query, base) {
        fasta.utils.checkNotNull(query);
        fasta.utils.checkNotNull(base);
        var hotspots = {};

        for (var tuple in query) {
            if (base[tuple]) {

                var queryOffset = query[tuple];
                for (var i = 0; i < queryOffset.length; i++) {

                    var exampleOffset = base[tuple];
                    for (var j = 0; j < exampleOffset.length; j++) {
                        var hotSpot = new fasta.HotSpot(exampleOffset[j] - queryOffset[i],
                            {query: queryOffset[i], base: exampleOffset[j]});
                        if (!hotspots[tuple]) {
                            hotspots[tuple] = [];
                        }
                        hotspots[tuple].pushUnique(hotSpot);
                    }
                }

            }
        }
        return hotspots;
    }

    /** Calculate hotSpots, for each base sequence
     *
     * @param base the IndexingArray of sequence from database
     * @param query the IndexingArray of query sequence
     * @return object containing hotspots for each base sequence
     */
    function findHotspotsForMultipleSequences(query, baseArrays) {
        var hotspots = {};

        for (var baseSequence in baseArrays) {
            var base = baseArrays[baseSequence];
            hotspots[baseSequence] = findHotspots(query, base);
        }
        return hotspots;
    }

    fasta.findHotspots = findHotspots;
    fasta.findHotspotsForMultipleSequences = findHotspotsForMultipleSequences;
})(fasta = fasta || {});
