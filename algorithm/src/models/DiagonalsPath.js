var fasta;
(function (fasta) {

    function DiagonalsPath(diagonals, score, alignment) {
        this.diagonals = diagonals;
        this.score = score;
        this.alignment = alignment;     //fasta.Alignment object
    }

    fasta.DiagonalsPath = DiagonalsPath;
})(fasta = fasta || {});
