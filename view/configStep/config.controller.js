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
        }

        function initializeScopeFunctions() {
            $scope.save = save;
        }

        //TODO: instead of saving - bind already to ConfigurationService
        function save(){
            ConfigurationService.baseSequence = $scope.configData.baseSequence;
            ConfigurationService.querySequence = $scope.configData.querySequence;
            ConfigurationService.kTup = $scope.configData.kTup;
        }
    }
})();
