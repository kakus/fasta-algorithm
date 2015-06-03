(function () {
    angular
        .module('fastaView')
        .controller('ThirdController', ['$scope', 'ConfigurationService', 'ThirdDataService', ThirdController]);

    function ThirdController($scope, ConfigurationService, ThirdDataService) {

        initialize();

        function initialize() {
            initializeScopeVariables();
            initializeScopeFunction();
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequences = ConfigurationService.thirdStage.baseSequences;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            $scope.stepData.diagonals = ConfigurationService.thirdStage.bestDiagonals;

            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[0];

            $scope.stepData.stepByStepConfig = [
                {description: 'Etap 3 - początek'},
                {
                    description: "Budowanie ścieżek diagonalnych z wykorzystaniem wyznaczonych ciągów diagonalnych",
                    action: buildDiagonalsPaths,
                    reverse: reverseBuildDiagonalsPaths
                },
                {
                    description: 'Ocena ścieżek',
                    action: scorePaths,
                    reverse: reverseScore
                },
                {
                    description: "Wyznaczenie przykładowych dopasowań dla każdej ścieżki",
                    action: findAlignments,
                    reverse: reverseFindAlignments
                },
                {
                    description: 'Wybór najlepszej ścieżki dla każdej sekwencji',
                    action: getBestPaths,
                    reverse: reverseGetBestPaths
                },
                {
                    description: "Wybranie najlepszych sekwencji do następnego etapu",
                    action: bestBaseSequences,
                    reverse: reverseBestBaseSequences
                }
            ];
        }

        function initializeScopeFunction() {
            $scope.changeSequence = changeSequence;
            $scope.drawPath = drawPath;
        }

        function changeSequence(index) {
                $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[index];
                //if ($scope.stepData.currentDiagonals) {
                //    //redrawDiagonalsTable();
                //}
        }

        function drawPath(path) {
            $scope.stepData.selectedPath = path;
            $scope.clearDiagonalsTable();
            $scope.drawDiagonalsTable(path.diagonals);
        }

        function buildDiagonalsPaths() {
            console.log($scope.stepData.diagonals);
            ThirdDataService.createDiagonalsPathsForEachSequence($scope.stepData.diagonals).then(function(paths) {
                console.log(paths);
                $scope.stepData.currentDiagonalsPaths = paths;
                ThirdDataService.diagonalsPaths = paths;
            });
        }

        function findAlignments() {

        }

        function scorePaths() {

        }

        function getBestPaths() {

        }

        function bestBaseSequences() {

        }

        function reverseBuildDiagonalsPaths() {
            $scope.stepData.currentDiagonalsPaths = undefined;
            ThirdDataService.diagonalsPaths = undefined;
        }

        function reverseFindAlignments() {

        }

        function reverseScore() {

        }

        function reverseGetBestPaths() {

        }

        function reverseBestBaseSequences() {

        }
    }
})();
