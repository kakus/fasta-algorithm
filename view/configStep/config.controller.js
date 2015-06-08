(function() {
    angular
    .module('fastaView')
    .controller('ConfigController', ['$scope', '$window', '$location', 'ConfigurationService', 'CurrentStageService', ConfigController]);

    function ConfigController($scope, $window, $location, ConfigurationService, CurrentStageService){

        initialize();

        function initialize() {

            initializeScopeVariables();
            initializeScopeFunctions();
        }

        function initializeScopeVariables() {
            $scope.configData = {};
            $scope.configData.baseSequences = angular.copy(ConfigurationService.baseSequences);
            $scope.configData.querySequence = ConfigurationService.querySequence;
            $scope.configData.kTup = ConfigurationService.kTup;
            $scope.configData.scoreMatrix = ConfigurationService.scoreMatrix;
            $scope.configData.gapPenalty = ConfigurationService.gapPenalty;
            $scope.configData.maxDistance = ConfigurationService.maxDistance;

            $scope.configData.newSequence = '';

            $scope.configData.emptyNewSequence = false;
            $scope.configData.formError = false;

            $scope.configData.started = ConfigurationService.started;
        }

        function initializeScopeFunctions() {
            $scope.saveAndContinue = saveAndContinue;
            $scope.removeBaseSequence = removeBaseSequence;
            $scope.addBaseSequence = addBaseSequence;
            $scope.restart = restart;
        }

        function saveAndContinue(){
            if (anyFieldEmpty()) {
                $scope.configData.formError = true;
                return;
            }

            $scope.configData.formError = false;

            ConfigurationService.baseSequences = $scope.configData.baseSequences;
            ConfigurationService.querySequence = $scope.configData.querySequence;
            ConfigurationService.kTup = $scope.configData.kTup;
            ConfigurationService.scoreMatrix = $scope.configData.scoreMatrix;
            ConfigurationService.gapPenalty = $scope.configData.gapPenalty;
            ConfigurationService.maxDistance = $scope.configData.maxDistance;

            CurrentStageService.currentStage = 1;
            ConfigurationService.started = true;

            $location.path("/first_stage");
        }

        function anyFieldEmpty() {
            return anyMatrixCellEmpty() || $scope.configData.baseSequences.length === 0 ||
                !$scope.configData.querySequence || !$scope.configData.kTup ||
                !$scope.configData.gapPenalty || $scope.configData.maxDistance === null;
        }

        function anyMatrixCellEmpty() {
            for (var rowKey in $scope.configData.scoreMatrix) {
                var row = $scope.configData.scoreMatrix[rowKey];

                for (var cellKey in row) {
                    if (row[cellKey] === null || row[cellKey] === undefined) {
                        return true;
                    }
                }
            }
            return false;
        }

        function removeBaseSequence(index) {
            $scope.configData.baseSequences.splice(index, 1);
        }

        function addBaseSequence() {
            if (!$scope.configData.newSequence) {
                $scope.configData.emptyNewSequence = true;
                return;
            }

            $scope.configData.baseSequences.pushUnique($scope.configData.newSequence);
            $scope.configData.newSequence = '';
            $scope.configData.emptyNewSequence = false;
        }

        function restart() {
            $window.location.reload();
        }
    }
})();
