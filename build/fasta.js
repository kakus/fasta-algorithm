function checkNotNull(obj)
{
   if (!obj) throw new Error("Null argument.");
   return obj;
}

Array.prototype.pushUnique = function(element)
{
   if (this.indexOf(element) < 0) {
      this.push(element);
   }
};

var fasta;
(function(fasta) {

    function HotSpot(difference, startIndices) {
        this.difference = difference;
        this.startIndices = startIndices;
    }

fasta.HotSpot = HotSpot;
})(fasta = fasta || {});

var fasta;
(function(fasta) {

// First step in FASTA algorithm.
// Find all tuples/fragments (unique combination of symbols) of length ktup in given
// sequence, also store offset of appearance of tuple in sequence.
//
// This object is a map where key <String> is the tuple, and value <Array<number>> is
// array of offsets where this tuple appears.
// @example
//    var array = new IndexingArray('ABA', 2);
//    array['AB']; // will return [0]
function IndexingArray(sequence, ktup)
{
   checkNotNull(sequence);
   checkNotNull(ktup);

   if (sequence.length < ktup) {
      throw new Error("ktup must be greater or equal to sequence length");
   }

   for(var i = 0; i <= sequence.length - ktup; ++i) {

      var tuple = sequence.substring(i, i + ktup);

      if (this[tuple]) {
         this[tuple].push(i);
      }
      else {
         this[tuple] = [i];
      }
   }
}

fasta.IndexingArray = IndexingArray;
})(fasta = fasta || {});

var fasta;
(function (fasta) {

// Calucalte diffrence of indexes in same tulples in query and example.
//
// @param example the IndexingArray of sequence from database
// @param query the IndexingArray of query sequence
// @return IndexingArray with hotspots
    function findHotspots(query, example) {
        checkNotNull(query);
        checkNotNull(example);
        var hotspots = {};

        for (var tuple in query) {
            if (example[tuple]) {

                var queryOffset = query[tuple];
                for (var i = 0; i < queryOffset.length; i++) {

                    var exampleOffset = example[tuple];
                    for (var j = 0; j < exampleOffset.length; j++) {
                        var hotSpot = new fasta.HotSpot(exampleOffset[j] - queryOffset[i],
                            {query: queryOffset[i], base: exampleOffset[j]});
                        if (!hotspots[tuple]) {
                            hotspots[tuple] = [];
                        }
                        hotspots[tuple].pushUnique(hotSpot);
                    }

                }

            }
        }
        return hotspots;
    }

    fasta.findHotspots = findHotspots;
})(fasta = fasta || {});
