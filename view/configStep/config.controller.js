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
            $scope.configData.errors = [];

            $scope.configData.started = ConfigurationService.started;
        }

        function initializeScopeFunctions() {
            $scope.saveAndContinue = saveAndContinue;
            $scope.removeBaseSequence = removeBaseSequence;
            $scope.addBaseSequence = addBaseSequence;
            $scope.restart = restart;
        }

        function saveAndContinue(){
            $scope.configData.errors = validateFields();

            if ($scope.configData.errors.length > 0) {
                return;
            }

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

        function validateFields() {
            var errors = [];

            if ($scope.configData.baseSequences.length === 0) {
                errors.push('Baza danych sekwencji nie może być pusta');
            }
            if (!$scope.configData.querySequence) {
                errors.push('Szukana sekwencja nie może być pusta');
            }
            if (isUndefinedOrNull($scope.configData.kTup) || isNaN($scope.configData.kTup) || ($scope.configData.kTup < 2 && $scope.configData.kTup > 6)) {
                errors.push('Parametr ktup musi mieć wartość pomiędzy 2 i 6');
            }
            if (isUndefinedOrNull($scope.configData.gapPenalty) || isNaN($scope.configData.gapPenalty) || $scope.configData.gapPenalty > 0) {
                errors.push('Kara za przerwę musi być liczbą mniejszą od 0');
            }
            if (isUndefinedOrNull($scope.configData.maxDistance) || isNaN($scope.configData.maxDistance) || $scope.configData.maxDistance < 0) {
                errors.push('Maksymalna odległość połączenia musi być liczbą większą od 0');
            }
            if (anyMatrixCellNotValid()) {
                errors.push('Macierz substytucji musi być całkowicie wypełniona liczbami');
            }

            return errors;
        }

        function anyMatrixCellNotValid() {
            for (var rowKey in $scope.configData.scoreMatrix) {
                var row = $scope.configData.scoreMatrix[rowKey];

                for (var cellKey in row) {
                    if (isUndefinedOrNull(row[cellKey]) || isNaN(row[cellKey])) {
                        return true;
                    }
                }
            }
            return false;
        }

        function isUndefinedOrNull(val) {
            return val === undefined || val === null;
        }
    }
})();
