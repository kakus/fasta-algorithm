describe("Find Hotspots", function () {

    it("should return one AB hotspot", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(1);
        expect(result['AB']).toBeDefined();
        expect(result['AB'].length).toEqual(1);
    });

    it("should return hotspot as array of objects with 2 properties", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source);

        expect(Object.keys(result['AB'][0]).length).toEqual(2);
    });

    it("should return hotspot with difference property", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source);

        expect(result['AB'][0].difference).toBeDefined();
    });

    it("should return hotspot with start index property", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source);

        expect(result['AB'][0].startIndices).toBeDefined();
    });

    it("should return start indices as array of objects with query and base property", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source),
            startIndices = result['AB'][0].startIndices;

        expect(Object.keys(startIndices).length).toEqual(2);
        expect(startIndices).toEqual({query: 0, base: 0});
    });

    it("should return multiple hotspots for different sequences", function () {
        var query = new fasta.IndexingArray("ABA", 2),
            source = new fasta.IndexingArray("BAB", 2),
            result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(2);

        expect(result['AB'].length).toEqual(1);
        expect(result['AB'][0]).toEqual(new fasta.HotSpot(1, {query: 0, base: 1}));

        expect(result['BA'].length).toEqual(1);
        expect(result['BA'][0]).toEqual(new fasta.HotSpot(-1, {query: 1, base: 0}));
    });

    it("should return multiple hotspots for same sequences", function () {
        var query = new fasta.IndexingArray("ABA", 2),
            source = new fasta.IndexingArray("ABA", 2);

        var result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(2);

        expect(result['AB'].length).toEqual(1);
        expect(result['AB'][0]).toEqual(new fasta.HotSpot(0, {query: 0, base: 0}));

        expect(result['BA'].length).toEqual(1);
        expect(result['BA'][0]).toEqual(new fasta.HotSpot(0, {query: 1, base: 1}));
    });

    it("should return zero hotspots", function () {
        var query = new fasta.IndexingArray("AAA", 2),
            source = new fasta.IndexingArray("ABA", 2);

        var result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(0);
    });

    it("should return multiple hotspots for single subsequence", function () {
        var query = new fasta.IndexingArray("ABAB", 2),
            source = new fasta.IndexingArray("AB", 2);

        var result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(1);

        expect(result['AB'].length).toEqual(2);
        expect(result['AB'][0]).toEqual(new fasta.HotSpot(0, {query: 0, base: 0}));
        expect(result['AB'][1]).toEqual(new fasta.HotSpot(-2, {query: 2, base: 0}));
    });

    it("should return multiple hotspots for multiple subsequences", function () {
        var query = new fasta.IndexingArray("ABAB", 2),
            source = new fasta.IndexingArray("ABA", 2);

        var result = fasta.findHotspots(query, source);

        expect(result['AB'].length).toEqual(2);
        expect(result['AB'][0]).toEqual(new fasta.HotSpot(0, {query: 0, base: 0}));
        expect(result['AB'][1]).toEqual(new fasta.HotSpot(-2, {query: 2, base: 0}));

        expect(result['BA'].length).toEqual(1);
        expect(result['BA'][0]).toEqual(new fasta.HotSpot(0, {query: 1, base: 1}));
    });
});
