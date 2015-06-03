(function () {
    angular
        .module('fastaView')
        .factory('SecondDataService', ['$q', '$timeout', SecondDataService]);

    function SecondDataService($q, $timeout) {

        return {
            getDiagonalsForEachBaseSequence: getDiagonalsForEachBaseSequence,
            scoreForEachBaseSequence: scoreForEachBaseSequence,
            getBestDiagonalsForEachSequence: getBestDiagonalsForEachSequence,
            getDiagonalsForBestSequences: getDiagonalsForBestSequences
        };

        function getDiagonalsForEachBaseSequence(hotSpotsBySequences, ktup, maxGapLength) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.findDiagonalsForEachBaseSequence(hotSpotsBySequences, ktup, maxGapLength));
            });

            return deferred.promise;
        }

        function scoreForEachBaseSequence(diagonalsBySequences, scoreMatrix, querySequence) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.scoreDiagonalsForEachBaseSequence(diagonalsBySequences, scoreMatrix, querySequence));
            });

            return deferred.promise;
        }

        function getBestDiagonalsForEachSequence(diagonalsBySequences) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getBestDiagonalsForEachSequence(diagonalsBySequences));
            });

            return deferred.promise;
        }

        function getDiagonalsForBestSequences(diagonalsBySequences) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getDiagonalsForBestSequences(diagonalsBySequences));
            });

            return deferred.promise;
        }
    }
})();
