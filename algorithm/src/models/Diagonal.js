var fasta;
(function (fasta) {

    function Diagonal(startPoint, endPoint, score) {
        this.startPoint = startPoint; // [int x, int y]
        this.endPoint = endPoint; // [int x, int y]
        this.score = score;
    }

    fasta.Diagonal = Diagonal;
})(fasta = fasta || {});
