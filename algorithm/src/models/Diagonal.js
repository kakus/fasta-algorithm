var fasta;
(function (fasta) {

    function Diagonal(startPoint, endPoint, score) {
        this.startPoint = startPoint; // [baseStart, queryStart]
        this.endPoint = endPoint; // [baseEnd, queryEnd]
        this.score = score;
    }

    fasta.Diagonal = Diagonal;
})(fasta = fasta || {});
