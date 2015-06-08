describe("getAlignment", function() {
    it("should return alignment AB - AB for path with one diagonal and sequences: AB and AB", function() {
        var path = new fasta.DiagonalsPath([
            new fasta.Diagonal([0, 0], [1, 1])
        ], 2),
            alignment = fasta.getAlignment(path, 'AB', 'AB');

        expect(alignment.baseAlignment).toEqual('AB');
        expect(alignment.queryAlignment).toEqual('AB');
        expect(alignment.baseOffset).toEqual(0);

    });

    it("should return alignment AB-CD - ABECD for path with two diagonals and sequences: ABCD and ABECD", function() {
        var path = new fasta.DiagonalsPath([
                new fasta.Diagonal([0, 0], [1, 1]),
                new fasta.Diagonal([2, 3], [3, 4])
            ], 2),
            alignment = fasta.getAlignment(path, 'ABCD', 'ABECD');

        expect(alignment.baseAlignment).toEqual('AB-CD');
        expect(alignment.queryAlignment).toEqual('ABECD');
        expect(alignment.baseOffset).toEqual(0);
    });

    it("should return alignment A|ACACTT|TTC - |AC--TT|A for path with two diagonals and sequences: AACACTTTTC and ACTTA", function() {
        var path = new fasta.DiagonalsPath([
                new fasta.Diagonal([1, 0], [2, 1]),
                new fasta.Diagonal([5, 2], [6, 3])
            ], 2),

            alignment = fasta.getAlignment(path, 'AACACTTTTC', 'ACTTA');

        expect(alignment.baseAlignment).toEqual('ACACTT');
        expect(alignment.queryAlignment).toEqual('AC--TT');
        expect(alignment.baseOffset).toEqual(1);
    });

    it("should return alignment A|AC-A|C - |ACCA|A  for path with two diagonals and sequences: AACAC and ACCAA", function() {
        var path = new fasta.DiagonalsPath([
                new fasta.Diagonal([1, 0], [2, 1]),
                new fasta.Diagonal([2, 2], [3, 3])
            ], 2),
            alignment = fasta.getAlignment(path, 'AACAC', 'ACCAA');

        expect(alignment.baseAlignment).toEqual('AC-A');
        expect(alignment.queryAlignment).toEqual('ACCA');
        expect(alignment.baseOffset).toEqual(1);
    });

    it("should return alignment A|ACGGTT| - |AC--TT|A  for path with two diagonals and sequences: AACGGTT and ACTTA", function() {
        var path = new fasta.DiagonalsPath([
                new fasta.Diagonal([1, 0], [2, 1]),
                new fasta.Diagonal([5, 2], [6, 3])
            ], 2),
            alignment = fasta.getAlignment(path, 'AACGGTT', 'ACTTA');

        expect(alignment.baseAlignment).toEqual('ACGGTT');
        expect(alignment.queryAlignment).toEqual('AC--TT');
        expect(alignment.baseOffset).toEqual(1);
    });

    it("should return alignment A|ACGGCT| - |AC---T|TA  for path with two diagonals and sequences: AACGGCT and ACTTA", function() {
        var path = new fasta.DiagonalsPath([
                new fasta.Diagonal([1, 0], [2, 1]),
                new fasta.Diagonal([5, 1], [7, 2])
            ], 2),
            alignment = fasta.getAlignment(path, 'AACGGCT', 'ACTTA');

        expect(alignment.baseAlignment).toEqual('ACGGCT');
        expect(alignment.queryAlignment).toEqual('AC---T');
        expect(alignment.baseOffset).toEqual(1);
    });

    it("should return alignment AC--CTT-AG - A|ACGG-TTCAG| for path with three diagonals and sequences: ACCTTAG and AACGGTTCAG", function() {
        var path = new fasta.DiagonalsPath([
                new fasta.Diagonal([0, 1], [1, 2]),
                new fasta.Diagonal([3, 5], [4, 6]),
                new fasta.Diagonal([5, 8], [6, 9])
            ], 2),
            alignment = fasta.getAlignment(path, 'ACCTTAG', 'AACGGTTCAG');

        expect(alignment.baseAlignment).toEqual('AC--CTT-AG');
        expect(alignment.queryAlignment).toEqual('ACGG-TTCAG');
        expect(alignment.queryOffset).toEqual(1);
    });
});
