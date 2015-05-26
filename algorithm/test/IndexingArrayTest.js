describe("Indexing Array", function() {

   it("should throw Error when sequence length is less than ktup", function() {
      var makeStep = function() { new fasta.IndexingArray("123", 6); };
      expect(makeStep).toThrow();
   });

   it("should return 1 tuple for sequence length == ktup", function() {
      var array = new fasta.IndexingArray("AB", 2);

      expect(Object.keys(array).length).toEqual(1);
      expect(array['AB']).toEqual([0]);
   });

   it("should return 2 tuples for sequence ABA and ktup == 2", function() {
      var array = new fasta.IndexingArray("ABA", 2);

      expect(Object.keys(array).length).toEqual(2);
      expect(array['AB']).toEqual([0]);
      expect(array['BA']).toEqual([1]);
   });

   it("should return 2 tuples for sequence ABAB and ktup == 2", function() {
      var array = new fasta.IndexingArray("ABAB", 2);

      expect(Object.keys(array).length).toEqual(2);
      expect(array['AB']).toEqual([0, 2]);
      expect(array['BA']).toEqual([1]);
   });

});
