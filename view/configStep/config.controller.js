(function() {
    angular
    .module('fastaView')
    .controller('ConfigController', ['$scope', 'ConfigurationService', ConfigController]);

    function ConfigController($scope, ConfigurationService){

        initialize();

        function initialize() {

            initializeScopeVariables();
            initializeScopeFunctions();
        }

        function initializeScopeVariables() {
            $scope.configData = {};
            $scope.configData.baseSequences = ConfigurationService.baseSequences;
            $scope.configData.querySequence = ConfigurationService.querySequence;
            $scope.configData.kTup = ConfigurationService.kTup;
            $scope.configData.scoreMatrix = ConfigurationService.scoreMatrix;
            $scope.configData.gapPenalty = ConfigurationService.gapPenalty;

            $scope.configData.newSequence = '';

            $scope.configData.emptyNewSequence = false;
        }

        function initializeScopeFunctions() {
            $scope.save = save;
            $scope.removeBaseSequence = removeBaseSequence;
            $scope.addBaseSequence = addBaseSequence;
        }

        function save(){
            ConfigurationService.baseSequences = $scope.configData.baseSequences;
            ConfigurationService.querySequence = $scope.configData.querySequence;
            ConfigurationService.kTup = $scope.configData.kTup;
            ConfigurationService.scoreMatrix = $scope.configData.scoreMatrix;
            ConfigurationService.gapPenalty = $scope.configData.gapPenalty;
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
    }
})();
