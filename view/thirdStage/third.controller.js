(function () {
    angular
        .module('fastaView')
        .controller('ThirdController', ['$scope', 'ConfigurationService', 'ThirdDataService', ThirdController]);

    function ThirdController($scope, ConfigurationService, ThirdDataService) {

        initialize();

        function initialize() {
            initializeScopeVariables();
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequence = ConfigurationService.baseSequence;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            $scope.stepData.diagonals = ThirdDataService.diagonals;
            $scope.stepData.substitutionMat = "BLOSSUM";
        }

        //angular.element(document).ready(function () {
        //    DiagonalsService.drawDiagonalsTable('diagonals-table', $scope.diagonals);
        //});
    }
})();
