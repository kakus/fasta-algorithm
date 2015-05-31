(function () {
    angular
        .module('fastaView')
        .factory('SecondDataService', ['$q', '$timeout', SecondDataService]);

    function SecondDataService($q, $timeout) {

        return {
            getDiagonals: getDiagonals,
            score: score,
            get10Best: get10Best
        };

        function getDiagonals(hotSpots, ktup, maxGapLength) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.findDiagonals(hotSpots, ktup, maxGapLength));
            });

            return deferred.promise;
        }

        function score(diagonals, scoreMatrix, baseSequence, querySequence) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.scoreDiagonals(diagonals, scoreMatrix, baseSequence, querySequence));
            });

            return deferred.promise;
        }

        function get10Best(diagonals) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getBestDiagonals(diagonals));
            });

            return deferred.promise;
        }
    }
})();
