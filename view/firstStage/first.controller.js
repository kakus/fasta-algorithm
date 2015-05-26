(function () {
    angular
        .module('fastaView')
        .controller('FirstController', ['$scope', 'ConfigurationService', 'FirstDataService', FirstController]);

    function FirstController($scope, ConfigurationService, FirstDataService) {

        initialize();

        function initialize() {
            initializeScopeVariables();
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequence = ConfigurationService.baseSequence;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            FirstDataService.getSequenceIndices($scope.stepData.baseSequence, $scope.stepData.kTup).then(function(data) {
                $scope.stepData.baseSequenceIndices = data;
            });
            FirstDataService.getSequenceIndices($scope.stepData.querySequence, $scope.stepData.kTup).then(function(data) {
                $scope.stepData.querySequenceIndices = data;
            });

            FirstDataService.getHotSpots().then(function(data) {
                $scope.stepData.hotSpots = data;
            });
        }
    }
})();
