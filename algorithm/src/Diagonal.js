var fasta;
(function (fasta) {

    function Diagonal(startPoint, endPoint) {
        this.startPoint = startPoint; // [int x, int y]
        this.endPoint = endPoint; // [int x, int y]
        this.score = undefined;
    }

    fasta.Diagonal = Diagonal;
})(fasta = fasta || {});
