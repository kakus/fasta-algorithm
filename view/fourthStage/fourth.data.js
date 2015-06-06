(function () {
    angular
        .module('fastaView')
        .factory('FourthDataService', ['$q', '$timeout', fourthDataService]);

    function fourthDataService($q, $timeout) {
        return {
            smithWatermanForEachSequence: smithWatermanForEachSequence,
            findSolutionsForEachSequence: findSolutionsForEachSequence,
            getAlignmentsForEachSequence: getAlignmentsForEachSequence,
            getBestSequence: getBestSequence
        };

        function smithWatermanForEachSequence(baseSequences, querySequence, scoreMatrix, gapPenalty) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.createSmithWatermanMatrixForEachSequence(baseSequences, querySequence, scoreMatrix, gapPenalty));
            });

            return deferred.promise;
        }

        function findSolutionsForEachSequence(swMatricesBySequence) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.findSWSolutionsForEachSequence(swMatricesBySequence));
            });

            return deferred.promise;
        }

        function getAlignmentsForEachSequence(solutionsBySequences, querySequence) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getSWAlignmentsForEachSequence(solutionsBySequences, querySequence));
            });

            return deferred.promise;
        }

        function getBestSequence(solutionsBySequences) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getBestSWSequence(solutionsBySequences));
            });

            return deferred.promise;
        }
    }
})();
