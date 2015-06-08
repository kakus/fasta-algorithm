describe("getDiagonalsForBestSequences", function() {
    it("should return empty array if empty given", function() {
        var diagonals = fasta.getDiagonalsForBestSequences({});
        expect(Object.keys(diagonals).length).toEqual(0);
    });

    it("should return diagonals for 1 sequence with only one input sequence", function() {
        var diagonals = fasta.getDiagonalsForBestSequences({'AAA': [new fasta.Diagonal([0,0], [1,1], 4)]});
        expect(Object.keys(diagonals).length).toEqual(1);
        expect(Object.keys(diagonals)[0]).toEqual('AAA');
    });

    it("should return diagonals for 1 sequence for 2 input sequences, best one, based on sum of score for diagonals", function() {
        var diagonals = fasta.getDiagonalsForBestSequences(
            {
                'AAB': [
                    new fasta.Diagonal([0,0], [1,1], 4),
                    new fasta.Diagonal([0,0], [1,1], 6)
                ],
                'AAC': [
                    new fasta.Diagonal([0,0], [1,1], 2),
                    new fasta.Diagonal([0,0], [1,1], 3)
                ]
            }
        );
        expect(Object.keys(diagonals).length).toEqual(1);
        expect(Object.keys(diagonals)[0]).toEqual('AAB');
    });

    it("should return diagonals for 2 sequences for 3 input sequences, best ones, based on sum of score for diagonals", function() {
        var diagonals = fasta.getDiagonalsForBestSequences(
            {
                'AAB': [
                    new fasta.Diagonal([0,0], [1,1], 4),
                        new fasta.Diagonal([0,0], [1,1], 6)
                ],
                'AAC': [
                    new fasta.Diagonal([0,0], [1,1], 2),
                    new fasta.Diagonal([0,0], [1,1], 3)
                ],
                'AAD': [
                    new fasta.Diagonal([0,0], [1,1], 2),
                    new fasta.Diagonal([0,0], [1,1], 5),
                    new fasta.Diagonal([0,0], [1,1], 8)
                ]
            }
        );
        expect(Object.keys(diagonals).length).toEqual(2);
        expect(Object.keys(diagonals)[0]).toEqual('AAD');
        expect(Object.keys(diagonals)[1]).toEqual('AAB');
    });

    it("should return diagonals for 2 sequences for 4 input sequences, best ones, based on sum of score for diagonals", function() {
        var diagonals = fasta.getDiagonalsForBestSequences(
            {
                'AAB': [
                    new fasta.Diagonal([0,0], [1,1], 4),
                    new fasta.Diagonal([0,0], [1,1], 6)
                ],
                'AAC': [
                    new fasta.Diagonal([0,0], [1,1], 2),
                    new fasta.Diagonal([0,0], [1,1], 3)
                ],
                'AAD': [
                    new fasta.Diagonal([0,0], [1,1], 2),
                    new fasta.Diagonal([0,0], [1,1], 5),
                    new fasta.Diagonal([0,0], [1,1], 8)
                ],
                'AAE': [
                    new fasta.Diagonal([0,0], [1,1], 2)
                ]
            }
        );
        expect(Object.keys(diagonals).length).toEqual(2);
        expect(Object.keys(diagonals)[0]).toEqual('AAD');
        expect(Object.keys(diagonals)[1]).toEqual('AAB');
    });

    it("should return diagonals for 2 sequences for 3 input sequences, with random selection for equal sum of score for diagonals", function() {
        var diagonals = fasta.getDiagonalsForBestSequences(
            {
                'AAB': [
                    new fasta.Diagonal([0,0], [1,1], 4),
                    new fasta.Diagonal([0,0], [1,1], 6)
                ],
                'AAC': [
                    new fasta.Diagonal([0,0], [1,1], 4),
                    new fasta.Diagonal([0,0], [1,1], 5)
                ],
                'AAD': [
                    new fasta.Diagonal([0,0], [1,1], 3),
                    new fasta.Diagonal([0,0], [1,1], 5)
                ]
            }
        );
        expect(Object.keys(diagonals).length).toEqual(2);
        expect(Object.keys(diagonals)[0]).toEqual('AAB');
    });
});
