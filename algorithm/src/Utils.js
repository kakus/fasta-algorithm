
Array.prototype.pushUnique = function (element) {
    if (this.indexOf(element) < 0) {
        this.push(element);
    }
};

var fasta;
(function (fasta) {

    function checkNotNull(obj) {
        if (!obj) throw new Error("Null argument.");
        return obj;
    }

    function getBestSequences(dataBySequences, calculateScore) {
        var scoredSequences = [],
            data,
            score,
            half_length,
            result = {};

        for (var sequence in dataBySequences) {
            data = dataBySequences[sequence];
            score = calculateScore(data);
            scoredSequences.push({sequence: sequence, score: score});
        }

        scoredSequences.sort(function(a,b) {return b.score - a.score});
        half_length = Math.ceil(scoredSequences.length / 2);
        scoredSequences = scoredSequences.slice(0, half_length);
        for (var i = 0; i < scoredSequences.length; i++ ) {
            result[scoredSequences[i].sequence] = dataBySequences[scoredSequences[i].sequence];
        }

        return result;
    }

    fasta.utils = fasta.utils || {};
    fasta.utils.checkNotNull = checkNotNull;
    fasta.utils.getBestSequences = getBestSequences;
})(fasta = fasta || {});
