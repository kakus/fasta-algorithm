(function () {
    angular
        .module('fastaView')
        .factory('FirstDataService', ['$q', '$timeout', firstDataService]);

    function firstDataService($q, $timeout) {
        var baseSequence = {
            'GACACC': [1, 3],
            'ACACCA': [13],
            'CACCAT': [5, 7, 4],
            'ACCATC': [10, 6],
            'GAATGG': [0, 16],
            'AATGGC': [18],
            'CCTTTC': [22, 17, 14],
            'CGCGGT': [26, 28]
            },
            querySequence = {
            'GACACC': [1, 2],
                'ACACCA': [13],
                'CACCAT': [5, 7, 4],
                'ACCATC': [10, 6],
                'GAATGG': [0, 16],
                'AATGGC': [18],
                'CCTTTC': [22, 17, 14],
                'CGCGGT': [26, 28]
            },
            hotSpots = {
            'GACACC': [],
                'ACACCA': [1],
                'CACCAT': [-5, 7, 4],
                'ACCATC': [10, -6],
                'GAATGG': [],
                'AATGGC': [18],
                'CGCGGT': [26, 28]
        };

        return {
            getBaseSequenceIndices: getBaseSequenceIndices,
            getQuerySequenceIndices: getQuerySequenceIndices,
            getHotSpots: getHotSpots
        };

        function getBaseSequenceIndices(sequence) {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(baseSequence);
            });

            return deferred.promise;
        }

        function getQuerySequenceIndices(sequence) {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(querySequence);
            });

            return deferred.promise;
        }

        function getHotSpots(baseSequence, querySequence) {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(hotSpots);
            });

            return deferred.promise;
        }
    }
})();
