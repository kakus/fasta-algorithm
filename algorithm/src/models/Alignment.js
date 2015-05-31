var fasta;
(function (fasta) {

    function Alignment(baseSequence, querySequence, baseOffset, queryOffset) {
        this.baseSequence = baseSequence;
        this.querySequence = querySequence;
        this.baseOffset = baseOffset;
        this.queryOffset = queryOffset;
    }

    fasta.Alignment = Alignment;
})(fasta = fasta || {});
