describe("Find Hotspots", function () {

    it("should return one AB hotspot", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(1);
        expect(result['AB']).toBeDefined();
    });

    it("should return hotspot with 2 properties  and start index property", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source);

        expect(Object.keys(result['AB']).length).toEqual(2);
    });

    it("should return hotspot with difference property", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source);

        expect(result['AB'].differences).toBeDefined();
    });

    it("should return hotspot with start index property", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source);

        expect(result['AB'].startIndices).toBeDefined();
    });

    it("should return start index property as array of objects with query and base property", function() {
        var query = new fasta.IndexingArray("AB", 2),
            source = new fasta.IndexingArray("AB", 2),
            result = fasta.findHotspots(query, source),
            startIndices = result['AB'].startIndices;

        expect(startIndices.length).toEqual(1);
        expect(Object.keys(startIndices[0]).length).toEqual(2);
        expect(startIndices).toEqual([{query: 0, base: 0}]);
    });

    it("should return multiple hotspots for different sequences", function () {
        var query = new fasta.IndexingArray("ABA", 2),
            source = new fasta.IndexingArray("BAB", 2),
            result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(2);

        expect(result['AB'].differences).toEqual([1]);
        expect(result['AB'].startIndices).toEqual([{query: 0, base: 1}]);

        expect(result['BA'].differences).toEqual([-1]);
        expect(result['BA'].startIndices).toEqual([{query: 1, base: 0}]);
    });

    it("should return multiple hotspots for same sequences", function () {
        var query = new fasta.IndexingArray("ABA", 2),
            source = new fasta.IndexingArray("ABA", 2);

        var result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(2);

        expect(result['AB'].differences).toEqual([0]);
        expect(result['AB'].startIndices).toEqual([{query: 0, base: 0}]);

        expect(result['BA'].differences).toEqual([0]);
        expect(result['BA'].startIndices).toEqual([{query: 1, base: 1}]);
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
        expect(result['AB'].differences).toEqual([0, -2]);
        expect(result['AB'].startIndices).toEqual([{query: 0, base: 0}, {query: 2, base: 0}]);
    });

    it("should return multiple hotspots for multiple subsequences", function () {
        var query = new fasta.IndexingArray("ABAB", 2),
            source = new fasta.IndexingArray("ABA", 2);

        var result = fasta.findHotspots(query, source);

        expect(Object.keys(result).length).toEqual(2);
        expect(result['AB'].differences).toEqual([0, -2]);
        expect(result['AB'].startIndices).toEqual([{query: 0, base: 0}, {query: 2, base: 0}]);

        expect(result['BA'].differences).toEqual([0]);
        expect(result['BA'].startIndices).toEqual([{query: 1, base: 1}]);
    });
});
