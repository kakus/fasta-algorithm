describe("createDiagonalsPaths", function() {
    it("should return 2 single paths for overlapping diagonals", function() {
        var diagonals = [new fasta.Diagonal([0, 0], [2, 2]), new fasta.Diagonal([1, 1], [3, 3])],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(2);
        expect(paths[0].diagonals).toEqual([diagonals[0]]);
        expect(paths[1].diagonals).toEqual([diagonals[1]]);
    });

    it("should return 2 single paths for parallel diagonals", function() {
        var diagonals = [
                new fasta.Diagonal([0, 0], [2, 2]), new fasta.Diagonal([1, 0], [3, 2])
            ],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(2);
        expect(paths[0].diagonals[0]).toEqual(diagonals[0]);
        expect(paths[1].diagonals[0]).toEqual(diagonals[1]);
    });

    it("should return 4 paths for given diagonals, with 2 start points", function() {
        var diagonals = [
                new fasta.Diagonal([0, 0], [2, 2], 1),
                new fasta.Diagonal([1, 0], [3, 2], 2),
                new fasta.Diagonal([2, 3], [4, 5], 3),
                new fasta.Diagonal([5, 5], [7, 7], 4),
                new fasta.Diagonal([4, 6], [6, 8], 5)
            ],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(4);
    });

    it("should return 4 paths for given diagonals", function() {
        var diagonals = [
                new fasta.Diagonal([0, 0], [2, 2], 1),
                new fasta.Diagonal([4, 2], [6, 4], 2),
                new fasta.Diagonal([2, 4], [6, 8], 3),
                new fasta.Diagonal([3, 3], [7, 7], 4),
                new fasta.Diagonal([6, 5], [10, 9], 5),
                new fasta.Diagonal([7, 8], [10, 11], 6)
            ],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(4);
    });

    it("should return 4 paths for given diagonals, not sorted before", function() {
        var diagonals = [
                new fasta.Diagonal([2, 4], [6, 8], 3),
                new fasta.Diagonal([6, 5], [10, 9], 5),
                new fasta.Diagonal([0, 0], [2, 2], 1),
                new fasta.Diagonal([3, 3], [7, 7], 4),
                new fasta.Diagonal([4, 2], [6, 4], 2),
                new fasta.Diagonal([7, 8], [10, 11], 6)
            ],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(4);
        for (var i = 0; i < paths.length; i++) {
            expect(paths[i].diagonals[0].score).toEqual(1);
        }
    });

    it("should return 1 path for 2 diagonals with same x, different y", function() {
        var diagonals = [new fasta.Diagonal([0, 0], [2, 2]), new fasta.Diagonal([2, 3], [4, 5])],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(1);
        expect(paths[0].diagonals).toEqual(diagonals);
    });

    it("should return 1 path for 2 diagonals with same x, different y and not sorted before", function() {
        var diagonals = [new fasta.Diagonal([2, 3], [4, 5]), new fasta.Diagonal([0, 0], [2, 2])],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(1);
        expect(paths[0].diagonals[0]).toEqual(diagonals[1]);
        expect(paths[0].diagonals[1]).toEqual(diagonals[0]);
    });

    it("should return 1 path for 2 diagonals with different x and same y", function() {
        var diagonals = [new fasta.Diagonal([0, 0], [2, 2]), new fasta.Diagonal([3, 2], [5, 4])],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(1);
        expect(paths[0].diagonals).toEqual(diagonals);
    });

    it("should return 1 path for 2 diagonals with different x and y", function() {
        var diagonals = [new fasta.Diagonal([0, 0], [2, 2]), new fasta.Diagonal([4, 3], [6, 5])],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(1);
        expect(paths[0].diagonals).toEqual(diagonals);
    });

    it("should return 2 paths, both with 2 diagonals, from 3 diagonals, where 2 of them are overlapping, both with same y value", function() {
        var diagonals = [new fasta.Diagonal([0, 0], [2, 2]), new fasta.Diagonal([3, 2], [5, 4]), new fasta.Diagonal([4, 2], [5,4])],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(2);
        expect(paths[0].diagonals[0]).toEqual(diagonals[0]);
        expect(paths[0].diagonals[1]).toEqual(diagonals[1]);

        expect(paths[1].diagonals[0]).toEqual(diagonals[0]);
        expect(paths[1].diagonals[1]).toEqual(diagonals[2]);
    });

    it("should return 2 paths, both with 2 diagonals, from 3 diagonals, where 2 of them are overlapping, both with different y value", function() {
        var diagonals = [new fasta.Diagonal([0, 0], [2, 2]), new fasta.Diagonal([3, 2], [5, 4]), new fasta.Diagonal([2, 3], [4,5])],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(2);
        expect(paths[0].diagonals[0]).toEqual(diagonals[0]);
        expect(paths[0].diagonals[1]).toEqual(diagonals[2]);

        expect(paths[1].diagonals[0]).toEqual(diagonals[0]);
        expect(paths[1].diagonals[1]).toEqual(diagonals[1]);
    });

    it("should return 1 paths from 3 not overlapping diagonals", function() {
        var diagonals = [new fasta.Diagonal([0, 0], [2, 2]), new fasta.Diagonal([3, 2], [5, 4]), new fasta.Diagonal([5, 6], [7, 8])],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(1);
        expect(paths[0].diagonals[0]).toEqual(diagonals[0]);
        expect(paths[0].diagonals[1]).toEqual(diagonals[1]);
        expect(paths[0].diagonals[2]).toEqual(diagonals[2]);
    });

    it("should return 1 paths from 4 not overlapping diagonals", function() {
        var diagonals = [
                new fasta.Diagonal([0, 0], [2, 2]),
                new fasta.Diagonal([3, 2], [5, 4]),
                new fasta.Diagonal([5, 6], [7, 8]),
                new fasta.Diagonal([9, 8], [11, 10])
            ],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(1);
        expect(paths[0].diagonals[0]).toEqual(diagonals[0]);
        expect(paths[0].diagonals[1]).toEqual(diagonals[1]);
        expect(paths[0].diagonals[2]).toEqual(diagonals[2]);
        expect(paths[0].diagonals[3]).toEqual(diagonals[3]);
    });

    it("should return 2 paths from 5 diagonals, from which 2 are overlapping", function() {
        var diagonals = [
                new fasta.Diagonal([0, 0], [2, 2]),
                new fasta.Diagonal([3, 2], [5, 4]),
                new fasta.Diagonal([2, 4], [4, 6]),
                new fasta.Diagonal([5, 6], [7, 8]),
                new fasta.Diagonal([9, 8], [11, 10])
            ],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(2);
        expect(paths[0].diagonals[0]).toEqual(diagonals[0]);
        expect(paths[1].diagonals[0]).toEqual(diagonals[0]);
        //TODO: asserts
    });

    it("should return 3 paths from 5 diagonals", function() {
        var diagonals = [
                new fasta.Diagonal([0, 0], [2, 2]),
                new fasta.Diagonal([4, 2], [8, 6]),
                new fasta.Diagonal([4, 3], [7, 5]),
                new fasta.Diagonal([2, 4], [7, 9]),
                new fasta.Diagonal([7, 8], [9, 10])
            ],
            paths = fasta.createDiagonalsPaths(diagonals);

        expect(paths.length).toEqual(3);
        //TODO: asserts
    });
});
