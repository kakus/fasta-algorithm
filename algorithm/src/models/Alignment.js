var fasta;
(function (fasta) {

    function Alignment(baseAlignment, queryAlignment, baseOffset, queryOffset) {
        this.baseAlignment = baseAlignment;
        this.queryAlignment = queryAlignment;
        this.baseOffset = baseOffset;
        this.queryOffset = queryOffset;
    }

    fasta.Alignment = Alignment;
})(fasta = fasta || {});
