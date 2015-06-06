describe("getSWAlignments", function () {
    it("should return correct result for Wikipedia example", function () {
        var solution = [{
                score: 12,
                path: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [7, 7], [8, 8]]
            }],
            expectedAlignment = [new fasta.Alignment('AGCACAC-A', 'A-CACACTA', 0, 0)],
            alignment = fasta.getSWAlignments(solution, 'AGCACACA', 'ACACACTA');

        expect(alignment).toEqual(expectedAlignment);
    });
});
