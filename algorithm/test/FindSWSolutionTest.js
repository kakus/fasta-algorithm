describe("findSWSolution", function () {
    it("should return correct path for Wikipedia example", function () {
        var swMatrix = [
                [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
                [{value: 0}, {value: 2, source: [0, 0]}, {value: 1, source: [1, 1]},
                    {value: 2, source: [0, 2]}, {value: 1, source: [1, 3]}, {value: 2, source: [0, 4]},
                    {value: 1, source: [1, 5]}, {value: 0}, {value: 2, source: [0, 7]}],

                [{value: 0}, {value: 1, source: [1, 1]}, {value: 1, source: [1, 1]},
                    {value: 1, source: [1, 3]}, {value: 1, source: [1, 3]}, {value: 1, source: [1, 5]},
                    {value: 1, source: [1, 5]}, {value: 0}, {value: 1, source: [1, 8]}],

                [{value: 0}, {value: 0}, {value: 3, source: [2, 1]},
                    {value: 2, source: [3, 2]}, {value: 3, source: [2, 3]}, {value: 2, source: [3, 4]},
                    {value: 3, source: [2, 5]}, {value: 2, source: [3, 6]}, {value: 1, source: [3, 7]}],

                [{value: 0}, {value: 2, source: [3, 0]}, {value: 2, source: [3, 2]},
                    {value: 5, source: [3, 2]}, {value: 4, source: [4, 3]}, {value: 5, source: [3, 4]},
                    {value: 4, source: [4, 5]}, {value: 3, source: [4, 6]}, {value: 4, source: [3, 7]}],

                [{value: 0}, {value: 1, source: [4, 1]}, {value: 4, source: [4, 1]},
                    {value: 4, source: [4, 3]}, {value: 7, source: [4, 3]}, {value: 6, source: [5, 4]},
                    {value: 7, source: [4, 5]}, {value: 6, source: [5, 6]}, {value: 5, source: [5, 7]}],

                [{value: 0}, {value: 2, source: [5, 0]}, {value: 3, source: [5, 2]},
                    {value: 6, source: [5, 2]}, {value: 6, source: [5, 4]}, {value: 9, source: [5, 4]},
                    {value: 8, source: [6, 5]}, {value: 7, source: [6, 6]}, {value: 8, source: [5, 7]}],

                [{value: 0}, {value: 1, source: [6, 1]}, {value: 4, source: [6, 1]},
                    {value: 5, source: [6, 3]}, {value: 8, source: [6, 3]}, {value: 8, source: [6, 5]},
                    {value: 11, source: [6, 5]}, {value: 10, source: [7, 6]}, {value: 9, source: [7, 7]}],

                [{value: 0}, {value: 2, source: [7, 0]}, {value: 3, source: [7, 2]},
                    {value: 6, source: [7, 2]}, {value: 7, source: [7, 4]}, {value: 10, source: [7, 4]},
                    {value: 10, source: [7, 6]}, {value: 10, source: [7, 6]}, {value: 12, source: [7, 7]}]
            ],
            expectedSolution = [{
                score: 12,
                path: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [7, 7], [8, 8]]
            }],
            solution = fasta.findSWSolutions(swMatrix);

        expect(solution).toEqual(expectedSolution);
    })
});

