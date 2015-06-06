(function(){
    angular
    .module('fastaView')
    .factory('ThirdDataService', ['$q', '$timeout', ThirdDataService]);

function ThirdDataService($q, $timeout){
    return {
        createDiagonalsPathsForEachSequence: createDiagonalsPathsForEachSequence,
        scorePathsForEachSequence: scorePathsForEachSequence,
        findAlignmentsOfBestPathsForEachSequence: findAlignmentsOfBestPathsForEachSequence,
        getBestPathsForEachSequence: getBestPathsForEachSequence,
        getPathsForBestSequences: getPathsForBestSequences
    };

    function createDiagonalsPathsForEachSequence(diagonalsBySequences) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.createDiagonalsPathsForEachSequence(diagonalsBySequences));
        });

        return deferred.promise;
    }

    function scorePathsForEachSequence(pathsBySequences, gapPenalty) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.scoreDiagonalsPathsForEachSequence(pathsBySequences, gapPenalty));
        });

        return deferred.promise;
    }

    function findAlignmentsOfBestPathsForEachSequence(pathsBySequences, querySequence) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.getAlignmentOfBestPathForEachSequence(pathsBySequences, querySequence));
        });

        return deferred.promise;
    }

    function getBestPathsForEachSequence(pathsBySequences) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.getBestPathsForEachSequence(pathsBySequences));
        });

        return deferred.promise;
    }

    function getPathsForBestSequences(pathsBySequences) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.getPathsForBestSequences(pathsBySequences));
        });

        return deferred.promise;
    }
}
})();

