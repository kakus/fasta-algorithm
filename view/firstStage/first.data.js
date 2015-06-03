(function () {
    angular
        .module('fastaView')
        .factory('FirstDataService', ['$q', '$timeout', firstDataService]);

    function firstDataService($q, $timeout) {
        return {
            getSequenceIndices: getSequenceIndices,
            getMultipleSequenceIndices: getMultipleSequenceIndices,
            getHotSpots: getHotSpots,
            getHotSpotsForBestSequences: getHotSpotsForBestSequences
        };

        function getSequenceIndices(sequence, ktup) {
            var deferred = $q.defer();

            $timeout(function() {
                var indices = new fasta.IndexingArray(sequence, ktup);
                deferred.resolve(indices);
            });

            return deferred.promise;
        }

        function getMultipleSequenceIndices(sequences, ktup) {
            var deferred = $q.defer();

            $timeout(function() {
                var indexingArrays = {};
                for (var i = 0; i < sequences.length; i++) {
                    var sequence = sequences[i];
                    indexingArrays[sequence] = new fasta.IndexingArray(sequence, ktup);
                }
                deferred.resolve(indexingArrays);
            });

            return deferred.promise;
        }

        function getHotSpots(baseIndicesArray, queryIndices) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(fasta.findHotspotsForMultipleSequences(queryIndices, baseIndicesArray));
            });

            return deferred.promise;
        }

        function getHotSpotsForBestSequences(hotSpots) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(fasta.getHotSpotsForBestSequences(hotSpots));
            });

            return deferred.promise;
        }
    }
})();
