describe("getBestSWSequence", function () {
    it("should return null if empty given", function () {
        var sequence = fasta.getBestSWSequence({});
        expect(sequence).toBeNull();
    });

    it("should return first sequence if one given", function () {
        var sequence = fasta.getBestSWSequence({'AAA': [{path: null, score: 10}]});
        expect(sequence).toEqual('AAA');
    });

    it("should return 1 sequence for 2 input sequences", function () {
        var sequence = fasta.getBestSWSequence(
            {
                'AAA': [{path: null, score: 10}],
                'AAB': [{path: null, score: 7}]
            }
        );
        expect(sequence).toEqual('AAA');
    });

    it("should return 1 sequence for 2 input sequences in different order", function() {
        var sequence = fasta.getBestSWSequence(
            {
                'AAB': [{path: null, score: 7}],
                'AAA': [{path: null, score: 10}]
            }
        );
        expect(sequence).toEqual('AAA');
    });

    it("should return 1 sequence for 3 input sequences", function() {
        var sequence = fasta.getBestSWSequence(
            {
                'AAA': [{path: null, score: 10}],
                'AAB': [{path: null, score: 7}],
                'AAC': [{path: null, score: 8}]
            }
        );
        expect(sequence).toEqual('AAA');
    });

    it("should return 1 sequence for 3 other input sequences", function() {
        var sequence = fasta.getBestSWSequence(
            {
                'AAA': [{path: null, score: 5}],
                'AAB': [{path: null, score: 9}],
                'AAC': [{path: null, score: 3}]
            }
        );
        expect(sequence).toEqual('AAB');
    });

    it("should return 1 random sequence for 3 input sequences, 2 of them with same scores", function() {
        var sequence = fasta.getBestSWSequence(
            {
                'BBB': [{path: null, score: 9}],
                'AAB': [{path: null, score: 3}],
                'AAAA': [{path: null, score: 9}]
            }
        );
        expect(sequence).toEqual('BBB');
    });

    it("should return 1 sequence for 4 input sequences", function() {
        var sequence = fasta.getBestSWSequence(
            {
                'AAA': [{path: null, score: 10}],
                'AAB': [{path: null, score: 7}],
                'AAC': [{path: null, score: 8}],
                'AAD': [{path: null, score: 12}]
            }
        );
        expect(sequence).toEqual('AAD');
    });
});
