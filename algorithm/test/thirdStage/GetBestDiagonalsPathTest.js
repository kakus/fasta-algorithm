describe("getBestDiagonalsPath", function() {

    it("should return first path when there is only 1", function() {
        var paths = [new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 4)],
            bestPath = fasta.getBestDiagonalsPath(paths);

        expect(bestPath).toEqual(paths[0]);
    });

    it("should return first path from 2 paths", function() {
        var paths = [
                new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 4),
                new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 2)
            ],
            bestPath = fasta.getBestDiagonalsPath(paths);

        expect(bestPath).toEqual(paths[0]);
    });

    it("should return second path from 3 paths", function() {
        var paths = [
                new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 4),
                new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 6),
                new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 2)
            ],
            bestPath = fasta.getBestDiagonalsPath(paths);

        expect(bestPath).toEqual(paths[1]);
    });

    it("should return third path from 3 paths", function() {
        var paths = [
                new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 4),
                new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 6),
                new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2])], 8)
            ],
            bestPath = fasta.getBestDiagonalsPath(paths);

        expect(bestPath).toEqual(paths[2]);
    });
});
