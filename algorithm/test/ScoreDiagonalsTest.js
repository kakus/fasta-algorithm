describe("scoreDiagonals", function() {

    var ktup = 2,
        scoreMatrix = {
            A: {A:1, B:-1, C:-1, D:-1},
            B: {A:-1, B:1, C:-1, D:-1},
            C: {A:-1, B:-1, C:1, D:-1},
            D: {A:-1, B:-1, C:-1, D:1}
        };

    //TODO: check score matrix if contains all elements from sequences, check for null

    it("should return empty array for no diagonals", function() {
        var diagonals = [],
            scoredDiagonals;

        scoredDiagonals = fasta.scoreDiagonals(diagonals, scoreMatrix, "AB", "AB");

        expect(scoredDiagonals.length).toEqual(0);
    });

    it("should give score=2 for diagonal with sequences: AB, AB", function() {
        var diagonals = [new fasta.Diagonal([0,0], [1,1])],
            scoredDiagonals;

        scoredDiagonals = fasta.scoreDiagonals(diagonals, scoreMatrix, "AB", "AB");

        expect(scoredDiagonals[0].score).toEqual(2);
    });

    it("should return score=2 for diagonals and sequences: ABCAB, AB", function() {
        var baseSequence = "ABXAB",
            querySequence = "AB",
            query = new fasta.IndexingArray(querySequence, ktup),
            source = new fasta.IndexingArray(baseSequence, ktup),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0),
            scoredDiagonals;

        scoredDiagonals = fasta.scoreDiagonals(diagonals, scoreMatrix, baseSequence, querySequence);

        expect(scoredDiagonals[0].score).toEqual(2);
        expect(scoredDiagonals[1].score).toEqual(2);
    });

    it("should return score=2 for 2 diagonals and score=3 for 1 diagonal with gap with sequences: ABCBA, ABDBA", function() {
        var baseSequence = "ABCBA",
            querySequence = "ABDBA",
            diagonals = [
                new fasta.Diagonal([0, 0], [4, 4]),
                new fasta.Diagonal([0, 0], [1, 1]),
                new fasta.Diagonal([3, 3], [4, 4])
            ],
            scoredDiagonals;

        scoredDiagonals = fasta.scoreDiagonals(diagonals, scoreMatrix, baseSequence, querySequence);

        expect(scoredDiagonals[0].score).toEqual(3);
        expect(scoredDiagonals[1].score).toEqual(2);
        expect(scoredDiagonals[2].score).toEqual(2);
    });

    it("should return score = -1 for 1 diagonal with gap with sequences: ABDDDDDBA, ABCCCCCBA", function() {
        var baseSequence = "ABDDDDDBA",
            querySequence = "ABCCCCCBA",
            diagonals = [
                new fasta.Diagonal([0, 0], [8, 8])
            ],
            scoredDiagonals;

        scoredDiagonals = fasta.scoreDiagonals(diagonals, scoreMatrix, baseSequence, querySequence);

        expect(scoredDiagonals[0].score).toEqual(-1);
    });

});
