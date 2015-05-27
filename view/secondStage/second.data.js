(function(){
    angular
    .module('fastaView')
    .factory('SecondDataService', ['$q', '$timeout', SecondDataService]);

function SecondDataService($q, $timeout){

    return {
        getDiagonals: getDiagonals
    };

    function getDiagonals(hotSpots, ktup, maxGapLength) {
        var deferred = $q.defer();

        $timeout(function() {
            deferred.resolve(fasta.findDiagonals(hotSpots, ktup, maxGapLength));
        });

        return deferred.promise;
    }
}
})();
