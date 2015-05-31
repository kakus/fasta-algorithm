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
            $scope.configData.baseSequence = ConfigurationService.baseSequence;
            $scope.configData.querySequence = ConfigurationService.querySequence;
            $scope.configData.kTup = ConfigurationService.kTup;
            $scope.configData.scoreMatrix = ConfigurationService.scoreMatrix;
            $scope.configData.gapPenalty = ConfigurationService.gapPenalty;
        }

        function initializeScopeFunctions() {
            $scope.save = save;
        }

        function save(){
            ConfigurationService.baseSequence = $scope.configData.baseSequence;
            ConfigurationService.querySequence = $scope.configData.querySequence;
            ConfigurationService.kTup = $scope.configData.kTup;
            ConfigurationService.scoreMatrix = $scope.configData.scoreMatrix;
            ConfigurationService.gapPenalty = $scope.configData.gapPenalty;
        }
    }
})();
