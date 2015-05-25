describe("Find Hotspots", function() {

   it("should pass test 1", function() {
      var query = new fasta.IndexingArray("ABA", 2),
          source = new fasta.IndexingArray("BAB", 2);

      var result = fasta.findHotspots(query, source);

      expect(Object.keys(result).length).toEqual(2);
      expect(result['AB']).toEqual([1]);
      expect(result['BA']).toEqual([-1]);
   });

   it("should pass test 2", function() {
      var query = new fasta.IndexingArray("ABA", 2),
          source = new fasta.IndexingArray("ABA", 2);

      var result = fasta.findHotspots(query, source);

      expect(Object.keys(result).length).toEqual(2);
      expect(result['AB']).toEqual([0]);
      expect(result['BA']).toEqual([0]);
   });

   it("should pass test 3", function() {
      var query = new fasta.IndexingArray("AAA", 2),
          source = new fasta.IndexingArray("ABA", 2);

      var result = fasta.findHotspots(query, source);

      expect(Object.keys(result).length).toEqual(0);
   });

   it("should pass test 4", function() {
      var query = new fasta.IndexingArray("ABAB", 2),
          source = new fasta.IndexingArray("AB", 2);

      var result = fasta.findHotspots(query, source);

      expect(Object.keys(result).length).toEqual(1);
      expect(result['AB']).toEqual([0, -2]);
   });
});
