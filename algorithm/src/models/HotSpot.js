var fasta;
(function(fasta) {

    function HotSpot(difference, startIndices) {
        this.difference = difference;       //int
        this.startIndices = startIndices;   //{query: queryStart, base: baseStart}
    }

fasta.HotSpot = HotSpot;
})(fasta = fasta || {});
