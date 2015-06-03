(function(){
    angular
    .module('fastaView')
    .factory('ThirdDataService', ['$q', '$timeout', ThirdDataService]);

function ThirdDataService($q, $timeout){
    return {
        createDiagonalsPathsForEachSequence: createDiagonalsPathsForEachSequence
    };

    function createDiagonalsPathsForEachSequence(diagonalsBySequences) {
        var deferred = $q.defer();

        console.log(diagonalsBySequences);

        $timeout(function () {
            deferred.resolve(fasta.createDiagonalsPathsForEachSequence(diagonalsBySequences));
        });

        return deferred.promise;
    }
}
})();

