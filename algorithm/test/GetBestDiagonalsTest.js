describe("getBestDiagonals", function () {
    it("should return same array if number of diagonals <= 10", function () {
        var diagonals = [new fasta.Diagonal([0, 0], [1, 1], 10)];

        expect(fasta.getBestDiagonals(diagonals)).toEqual(diagonals);
    });

    it("should return array with only 10 best diagonals if number of diagonals > 10", function () {
        var diagonals = [
                new fasta.Diagonal([0, 0], [1, 1], 10),
                new fasta.Diagonal([0, 0], [1, 1], 15),
                new fasta.Diagonal([0, 0], [1, 1], 11),
                new fasta.Diagonal([0, 0], [1, 1], 12),
                new fasta.Diagonal([0, 0], [1, 1], 19),
                new fasta.Diagonal([0, 0], [1, 1], 5),
                new fasta.Diagonal([0, 0], [1, 1], 33),
                new fasta.Diagonal([0, 0], [1, 1], 16),
                new fasta.Diagonal([0, 0], [1, 1], 17),
                new fasta.Diagonal([0, 0], [1, 1], 21),
                new fasta.Diagonal([0, 0], [1, 1], 17),
                new fasta.Diagonal([0, 0], [1, 1], 31)
            ],
            actualBest = fasta.getBestDiagonals(diagonals);

        expect(actualBest.length).toEqual(10);
        actualBest.forEach(function(diagonal) {
            expect(diagonal.score).toBeGreaterThan(10);
        });
    });
});
