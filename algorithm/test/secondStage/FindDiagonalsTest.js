describe("Find Diagonals", function () {
    var ktup = 2;

    it("should return single diagonal from single hotspot", function () {
        var query = new fasta.IndexingArray("AB", ktup),
            source = new fasta.IndexingArray("AB", ktup),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals.length).toEqual(1);
    });

    it("should return diagonal with start and end indices", function () {
        var query = new fasta.IndexingArray("AB", ktup),
            source = new fasta.IndexingArray("AB", ktup),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals[0].startPoint).toBeDefined();
        expect(diagonals[0].endPoint).toBeDefined();
    });

    it("should return diagonal with start = [0,0] and end = [1,1]", function () {
        var query = new fasta.IndexingArray("AB", ktup),
            source = new fasta.IndexingArray("AB", ktup),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals[0].startPoint).toEqual([0, 0]);
        expect(diagonals[0].endPoint).toEqual([1, 1]);
    });

    it("should return multiple diagonals from multiple, repeating hotspots", function () {
        var query = new fasta.IndexingArray("ABAB", 2),
            source = new fasta.IndexingArray("AB", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals.length).toEqual(2);

        expect(diagonals[0].startPoint).toEqual([0, 0]);
        expect(diagonals[0].endPoint).toEqual([1, 1]);

        expect(diagonals[1].startPoint).toEqual([0, 2]);
        expect(diagonals[1].endPoint).toEqual([1, 3]);
    });

    it("should return 2 diagonals from multiple hotspots on same line, maxGapLength = 0", function () {
        var query = new fasta.IndexingArray("ABCBA", 2),
            source = new fasta.IndexingArray("ABDBA", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals.length).toEqual(2);

        expect(diagonals[0].startPoint).toEqual([0, 0]);
        expect(diagonals[0].endPoint).toEqual([1, 1]);

        expect(diagonals[1].startPoint).toEqual([3, 3]);
        expect(diagonals[1].endPoint).toEqual([4, 4]);
    });

    it("should return multiple diagonals from multiple hotspots on same line, maxGapLength = 1", function () {
        var query = new fasta.IndexingArray("ABCBA", 2),
            source = new fasta.IndexingArray("ABDBA", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 1);

        expect(diagonals.length).toEqual(3);
    });

    it("should return all possible diagonals from multiple hotspots that are next to each other, maxGapLength = 0", function () {
        var query = new fasta.IndexingArray("ABCD", 2),
            source = new fasta.IndexingArray("ABCD", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals.length).toEqual(1);

        expect(diagonals[0].startPoint).toEqual([0, 0]);
        expect(diagonals[0].endPoint).toEqual([3, 3]);
    });

    it("should return 2 diagonals for ABXXXBA and ABZZZBA with maxGapLength = 0", function() {
        var query = new fasta.IndexingArray("ABXXXBA", 2),
            source = new fasta.IndexingArray("ABZZZBA", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals.length).toEqual(2);
    });

    it("should return 2 diagonals ABXXXBA and ABZZZBA with maxGapLength = 1", function() {
        var query = new fasta.IndexingArray("ABXXXBA", 2),
            source = new fasta.IndexingArray("ABZZZBA", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 1);

        expect(diagonals.length).toEqual(2);
    });
    //
    it("should return 3 diagonals ABXXXAB and ABZZZBA with maxGapLength = 3", function() {
        var query = new fasta.IndexingArray("ABXXXBA", 2),
            source = new fasta.IndexingArray("ABZZZBA", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 3);

        expect(diagonals.length).toEqual(3);
    });

    it("should return single diagonals from multiple hotspots on different lines, maxGapLength = 0", function () {
        var query = new fasta.IndexingArray("GCATCGGC", 2),
            source = new fasta.IndexingArray("CCATCGCCATCG", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals.length).toEqual(4);
    });
    //
    it("should return more than one diagonal on single line, maxGapLength = 0", function () {
        var query = new fasta.IndexingArray("GCATCGGC", 2),
            source = new fasta.IndexingArray("CCATCGCCAXCG", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals.length).toEqual(5);
    });

    it("should return all possible, not joined diagonals on single line, with separate original diagonals and maxGapLength = 1", function () {
        var query = new fasta.IndexingArray("GCATCGGC", 2),
            source = new fasta.IndexingArray("CCATCGCCAXCG", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 1);

        expect(diagonals.length).toEqual(6);
    });

    it("should return 4 diagonals for MYSEQENCEN and HISSEQUENCEQ and maxGapLength = 1", function () {
        var query = new fasta.IndexingArray("MYSEQENCEN", 2),
            source = new fasta.IndexingArray("HISSEQUENCEQ", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 1);

        expect(diagonals.length).toEqual(4);
    });

    it("should return 6 diagonals for ABXBAZCB and ABYBAVCB and maxGapLength = 1", function () {
        var query = new fasta.IndexingArray("ABXBAZCB", 2),
            source = new fasta.IndexingArray("ABYBAVCB", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 1);

        expect(diagonals.length).toEqual(6);
    });

    it("should return 2 diagonals for ABCBZDE and ABCBXDE and maxGapLength = 0", function () {
        var query = new fasta.IndexingArray("ABCBZDE", 2),
            source = new fasta.IndexingArray("ABCBXDE", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 0);

        expect(diagonals.length).toEqual(2);
    });

    it("should return 3 diagonals for ABCBZDE and ABCBXDE and maxGapLength = 1", function () {
        var query = new fasta.IndexingArray("ABCBZDE", 2),
            source = new fasta.IndexingArray("ABCBXDE", 2),
            hotspots = fasta.findHotspots(query, source),
            diagonals = fasta.findDiagonals(hotspots, ktup, 1);

        expect(diagonals.length).toEqual(3);
    });
});
