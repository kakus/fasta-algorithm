var fasta;
(function (fasta) {

// Calucalte diffrence of indexes in same tulples in query and example.
//
// @param example the IndexingArray of sequence from database
// @param query the IndexingArray of query sequence
// @return IndexingArray with hotspots
    function findHotspots(query, example) {
        checkNotNull(query);
        checkNotNull(example);
        var hotspots = {};

        for (var tuple in query) {
            if (example[tuple]) {

                var queryOffset = query[tuple];
                for (var i = 0; i < queryOffset.length; i++) {

                    var exampleOffset = example[tuple];
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

    fasta.findHotspots = findHotspots;
})(fasta = fasta || {});