(function () {
    angular
        .module('fastaView')
        .controller('FirstController', ['$scope', '$q', 'ConfigurationService', 'FirstDataService', FirstController]);

    function FirstController($scope, $q, ConfigurationService, FirstDataService) {

        initialize();

        function initialize() {
            initializeScopeVariables();
            getStageData();
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequence = ConfigurationService.baseSequence;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
        }

        function getStageData() {
            var sequencePromise, basePromise;
            sequencePromise = FirstDataService.getSequenceIndices($scope.stepData.baseSequence, $scope.stepData.kTup);
            sequencePromise.then(function(data) {
                $scope.stepData.baseSequenceIndices = data;
            });

            basePromise = FirstDataService.getSequenceIndices($scope.stepData.querySequence, $scope.stepData.kTup);
            basePromise.then(function(data) {
                $scope.stepData.querySequenceIndices = data;
            });

            $q.all([sequencePromise, basePromise]).then(function() {
                FirstDataService.getHotSpots($scope.stepData.baseSequenceIndices, $scope.stepData.querySequenceIndices).then(function (data) {
                    ConfigurationService.hotSpots = data;
                    $scope.stepData.hotSpots = data;
                });
            });
        }
    }
})();
