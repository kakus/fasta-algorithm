(function () {
    angular
        .module('fastaView')
        .controller('FirstController', ['$scope', '$q', 'ConfigurationService', 'FirstDataService', FirstController]);

    function FirstController($scope, $q, ConfigurationService, FirstDataService) {

        var sequencePromise, basePromise;

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

            $scope.stepData.stepByStepConfig = [
                {description: 'Stage 1 - beginning'},
                {
                    description: "calculating indices for base sequence",
                    action: baseIndicesStep,
                    reverse: reverseBaseIndices
                },
                {
                    description: "calculating indices for query sequence",
                    action: queryIndicesStep,
                    reverse: reverseQueryIndices
                },
                {description: "calculating hot spots", action: hotSpotsStep, reverse: reverseHotSpots}
            ];
        }

        function getStageData() {

        }

        function baseIndicesStep() {
            if (!basePromise) {
                basePromise = FirstDataService.getSequenceIndices($scope.stepData.baseSequence, $scope.stepData.kTup);
            }
            basePromise.then(function (data) {
                $scope.stepData.baseSequenceIndices = data;
            });
        }

        function queryIndicesStep() {
            if (!sequencePromise) {
                sequencePromise = FirstDataService.getSequenceIndices($scope.stepData.querySequence, $scope.stepData.kTup);
            }
            sequencePromise.then(function (data) {
                $scope.stepData.querySequenceIndices = data;
            });
        }

        function hotSpotsStep() {
            $q.all([sequencePromise, basePromise]).then(function () {
                FirstDataService.getHotSpots($scope.stepData.baseSequenceIndices, $scope.stepData.querySequenceIndices).then(function (data) {
                    ConfigurationService.hotSpots = data;
                    $scope.stepData.hotSpots = data;
                });
            });
        }

        function reverseBaseIndices() {
            $scope.stepData.baseSequenceIndices = [];
        }

        function reverseQueryIndices() {
            $scope.stepData.querySequenceIndices = [];
        }

        function reverseHotSpots() {
            ConfigurationService.hotSpots = [];
            $scope.stepData.hotSpots = [];
        }
    }
})
();
