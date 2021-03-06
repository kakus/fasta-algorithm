var fasta;
(function (fasta) {

    /** First step in FASTA algorithm.
     * Find all tuples/fragments (unique combination of symbols) of length ktup in given
     * sequence, also store offset of appearance of tuple in sequence.
     *
     * This object is a map where key <String> is the tuple, and value <Array<number>> is
     * array of offsets where this tuple appears.
     * @example
     *    var array = new IndexingArray('ABA', 2);
     *    array['AB']; // will return [0]
     */
    function IndexingArray(sequence, ktup) {
        fasta.utils.checkNotNull(sequence);
        fasta.utils.checkNotNull(ktup);

        if (sequence.length < ktup) {
            throw new Error("ktup must be greater or equal to sequence length");
        }

        for (var i = 0; i <= sequence.length - ktup; ++i) {

            var tuple = sequence.substring(i, i + ktup);

            if (this[tuple]) {
                this[tuple].push(i);
            }
            else {
                this[tuple] = [i];
            }
        }
    }

    fasta.IndexingArray = IndexingArray;
})(fasta = fasta || {});
