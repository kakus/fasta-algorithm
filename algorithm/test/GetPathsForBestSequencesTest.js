describe("getPathsForBestSequences", function() {
    it("should return empty array if empty given", function() {
        var paths = fasta.getPathsForBestSequences({});
        expect(Object.keys(paths).length).toEqual(0);
    });

    it("should return paths for 1 sequence with only one input sequence", function() {
        var paths = fasta.getPathsForBestSequences({'AAA': [new fasta.DiagonalsPath(null, 10)]});
        expect(Object.keys(paths).length).toEqual(1);
        expect(Object.keys(paths)[0]).toEqual('AAA');
    });

    it("should return paths for 1 sequence for 2 input sequences, best one, based on score of paths", function() {
        var paths = fasta.getPathsForBestSequences(
            {
                'AAB': [
                    new fasta.DiagonalsPath(null, 10)
                ],
                'AAC': [
                    new fasta.DiagonalsPath(null, 6)
                ]
            }
        );
        expect(Object.keys(paths).length).toEqual(1);
        expect(Object.keys(paths)[0]).toEqual('AAB');
    });

    it("should return paths for 2 sequences for 3 input sequences, best ones, based on score of paths", function() {
        var paths = fasta.getPathsForBestSequences(
            {
                'AAB': [
                    new fasta.DiagonalsPath(null, 10)
                ],
                'AAC': [
                    new fasta.DiagonalsPath(null, 5)
                ],
                'AAD': [
                    new fasta.DiagonalsPath(null, 12)
                ]
            }
        );
        expect(Object.keys(paths).length).toEqual(2);
        expect(Object.keys(paths)[0]).toEqual('AAD');
        expect(Object.keys(paths)[1]).toEqual('AAB');
    });

    it("should return paths for 2 sequences for 4 input sequences, best ones, based on score of paths", function() {
        var paths = fasta.getPathsForBestSequences(
            {
                'AAB': [
                    new fasta.DiagonalsPath(null, 15)
                ],
                'AAC': [
                    new fasta.DiagonalsPath(null, 4)
                ],
                'AAD': [
                    new fasta.DiagonalsPath(null, 20)
                ],
                'AAE': [
                    new fasta.DiagonalsPath(null, 10)
                ]
            }
        );
        expect(Object.keys(paths).length).toEqual(2);
        expect(Object.keys(paths)[0]).toEqual('AAD');
        expect(Object.keys(paths)[1]).toEqual('AAB');
    });

    it("should return paths for 2 sequences for 3 input sequences, with random selection for equal scores of paths", function() {
        var paths = fasta.getPathsForBestSequences(
            {
                'AAB': [
                    new fasta.DiagonalsPath(null, 15)
                ],
                'AAC': [
                    new fasta.DiagonalsPath(null, 10)
                ],
                'AAD': [
                    new fasta.DiagonalsPath(null, 10)
                ]
            }
        );
        expect(Object.keys(paths).length).toEqual(2);
        expect(Object.keys(paths)[0]).toEqual('AAB');
    });
});
