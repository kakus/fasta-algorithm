describe("scoreDiagonalsPaths", function () {

    var gapPenalty = -5,
        scores = [5, 10, 6];


    it("should return same score as diagonal for path with only one diagonal", function () {
        var paths = [new fasta.DiagonalsPath([new fasta.Diagonal([0, 0], [2, 2], scores[0])])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty);

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(scores[0]);
    });

    it("should return sum of scores + gap penalty for 2 diagonals on paths with insertion along X", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([3, 2], [5, 4], scores[1])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 2).reduce(function (a, b) {
                    return a + b;
                }) + gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return sum of scores + gap penalty for 2 diagonals on paths with insertion along Y", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([2, 3], [4, 5], scores[1])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 2).reduce(function (a, b) {
                    return a + b;
                }) + gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return sum of scores + 3 * gap penalty for 2 diagonals on paths with 3 insertion along X", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([5, 2], [7, 4], scores[1])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 2).reduce(function (a, b) {
                    return a + b;
                }) + 3 * gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return sum of scores + 3 * gap penalty for 2 diagonals on paths with 3 insertion along Y", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([2, 5], [4, 7], scores[1])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 2).reduce(function (a, b) {
                    return a + b;
                }) + 3 * gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return sum of scores + gap penalty for 2 diagonals on paths with insertion along X and Y", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([3, 4], [5, 6], scores[1])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 2).reduce(function (a, b) {
                    return a + b;
                }) + Math.sqrt(5) * gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return score for 1 path with 3 diagonals, with gaps for first connection on Y and for second on X", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([2, 3], [4, 5], scores[1]),
                    new fasta.Diagonal([5, 5], [7, 7], scores[2])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 3).reduce(function (a, b) {
                    return a + b;
                }) + gapPenalty + gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return score for 1 path with 3 diagonals, with gaps for first connection on Y and for second on Y", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([2, 3], [4, 5], scores[1]),
                    new fasta.Diagonal([4, 6], [6, 8], scores[2])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 3).reduce(function (a, b) {
                    return a + b;
                }) + gapPenalty + gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return score for 1 path with 3 diagonals, with gaps for first connection on X and for second on Y", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([3, 2], [5, 4], scores[1]),
                    new fasta.Diagonal([5, 5], [7, 7], scores[2])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 3).reduce(function (a, b) {
                    return a + b;
                }) + gapPenalty + gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return score for 1 path with 3 diagonals, with gaps for first connection on X and for second on X", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([3, 2], [5, 4], scores[1]),
                    new fasta.Diagonal([6, 4], [8, 6], scores[2])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 3).reduce(function (a, b) {
                    return a + b;
                }) + gapPenalty + gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return score for 1 path with 3 diagonals, with gaps for first connection on X and for second not along any axis", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([3, 2], [5, 4], scores[1]),
                    new fasta.Diagonal([7, 5], [9, 7], scores[2])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 3).reduce(function (a, b) {
                    return a + b;
                }) + gapPenalty + Math.sqrt(5) * gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return score for 1 path with 3 diagonals, with gaps for for both connections not along any axis", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([4, 3], [6, 5], scores[1]),
                    new fasta.Diagonal([8, 6], [10, 7], scores[2])
                ])],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty),
            expectedScore = scores.slice(0, 3).reduce(function (a, b) {
                    return a + b;
                }) + Math.sqrt(5) * gapPenalty + Math.sqrt(5) * gapPenalty;

        expect(scoredPaths.length).toEqual(1);
        expect(scoredPaths[0].score).toEqual(expectedScore);
    });

    it("should return 2 paths with scores with 2 input paths", function () {
        var paths = [
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([3, 2], [5, 4], scores[1])
                ]),
                new fasta.DiagonalsPath([
                    new fasta.Diagonal([0, 0], [2, 2], scores[0]),
                    new fasta.Diagonal([2, 3], [4, 5], scores[2])
                ])
            ],
            scoredPaths = fasta.scoreDiagonalsPaths(paths, gapPenalty);;

        expect(scoredPaths.length).toEqual(2);
        expect(scoredPaths[0].score).toBeDefined();
        expect(scoredPaths[1].score).toBeDefined();
    });
});
