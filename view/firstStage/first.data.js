(function () {
    angular
        .module('fastaView')
        .factory('FirstDataService', ['$q', '$timeout', firstDataService]);

    function firstDataService($q, $timeout) {
        return {
            getSequenceIndices: getSequenceIndices,
            getHotSpots: getHotSpots
        };

        function getSequenceIndices(sequence, ktup) {
            var deferred = $q.defer();

            $timeout(function() {
                var indices = new fasta.IndexingArray(sequence, ktup);
                deferred.resolve(indices);
            });

            return deferred.promise;
        }

        function getHotSpots(baseIndices, queryIndices) {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(fasta.findHotspots(queryIndices, baseIndices));
            });

            return deferred.promise;
        }
    }
})();
