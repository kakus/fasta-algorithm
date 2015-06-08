var fasta;
(function (fasta) {

    function Alignment(baseAlignment, queryAlignment, baseOffset, queryOffset) {
        this.baseAlignment = baseAlignment;     //string
        this.queryAlignment = queryAlignment;   //string
        this.baseOffset = baseOffset;           //int
        this.queryOffset = queryOffset;         //int
    }

    fasta.Alignment = Alignment;
})(fasta = fasta || {});
