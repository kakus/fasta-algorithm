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
            $scope.stepData.bestSequences = ConfigurationService.fourthStage.baseSequences;

            $scope.stepData.lastStep = ThirdDataService.lastStep || 0;

            $scope.stepData.currentDiagonalsPaths = ThirdDataService.bestPathsWithAlignments || ThirdDataService.bestPaths || ThirdDataService.scoredPaths || ThirdDataService.diagonalsPaths;
            $scope.stepData.bestSequences = ConfigurationService.thirdStage.baseSequences;

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
                    description: 'Wybór najlepszej ścieżki dla każdej sekwencji',
                    action: getBestPaths,
                    reverse: reverseGetBestPaths
                },
                {
                    description: "Wyznaczenie przyk�adowych dopasowa� dla najlepszych �cie�ek dla ka�dej sekwencji",
                    action: findAlignments,
                    reverse: reverseFindAlignments
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
            $scope.saveLastStep = saveLastStep;
        }

        function changeSequence(index) {
            var newSequence = $scope.stepData.baseSequences[index];
            if (newSequence !== $scope.stepData.currentBaseSequence) {
                $scope.stepData.currentBaseSequence = newSequence;
                $scope.clearDiagonalsTable();
            }
        }

        function drawPath(path) {
            $scope.stepData.selectedPath = path;
            $scope.clearDiagonalsTable();
            $scope.drawDiagonalsTable(path.diagonals);      //TODO: draw Paths
        }

        function saveLastStep(lastStep) {
            ThirdDataService.lastStep = lastStep;
        }

        function buildDiagonalsPaths() {
            ThirdDataService.createDiagonalsPathsForEachSequence($scope.stepData.diagonals).then(function (paths) {
                $scope.stepData.currentDiagonalsPaths = paths;
                ThirdDataService.diagonalsPaths = angular.copy(paths);
            });
        }

        function scorePaths() {
            ThirdDataService.scorePathsForEachSequence($scope.stepData.currentDiagonalsPaths, ConfigurationService.gapPenalty)
                .then(function (scoredPaths) {
                    $scope.stepData.currentDiagonalsPaths = scoredPaths;
                    ThirdDataService.scoredPaths = angular.copy(scoredPaths);
                })
        }

        function getBestPaths() {
            ThirdDataService.getBestPathsForEachSequence($scope.stepData.currentDiagonalsPaths).then(function (bestPaths) {
                $scope.stepData.currentDiagonalsPaths = bestPaths;
                ThirdDataService.bestPaths = angular.copy(bestPaths);       //TODO: clear?
            })
        }

        function findAlignments() {
            ThirdDataService.findAlignmentsOfBestPathsForEachSequence($scope.stepData.currentDiagonalsPaths, $scope.stepData.querySequence)
                .then(function (pathsWithAlignments) {
                    $scope.stepData.currentDiagonalsPaths = pathsWithAlignments;
                    ThirdDataService.bestPathsWithAlignments = angular.copy(pathsWithAlignments);
                });
        }

        function bestBaseSequences() {
            ThirdDataService.getPathsForBestSequences($scope.stepData.currentDiagonalsPaths).then(function(pathsForBestSequences){
                ConfigurationService.fourthStage.bestPaths = pathsForBestSequences;
                ConfigurationService.fourthStage.baseSequences = Object.keys(pathsForBestSequences);
                $scope.stepData.bestSequences = Object.keys(pathsForBestSequences);
            });
        }

        function reverseBuildDiagonalsPaths() {
            $scope.stepData.currentDiagonalsPaths = undefined;
            ThirdDataService.diagonalsPaths = undefined;
        }

        function reverseScore() {
            $scope.stepData.currentDiagonalsPaths = ThirdDataService.diagonalsPaths;
            ThirdDataService.scoredPaths = undefined;
        }

        function reverseGetBestPaths() {
            $scope.stepData.currentDiagonalsPaths = ThirdDataService.scoredPaths;
            ThirdDataService.bestPaths = undefined;
        }

        function reverseFindAlignments() {
            $scope.stepData.currentDiagonalsPaths = ThirdDataService.bestPaths;
            ThirdDataService.bestPathsWithAlignments = undefined;
        }

        function reverseBestBaseSequences() {
            ConfigurationService.fourthStage = {};
            $scope.stepData.bestSequences = undefined;
        }
    }
})();
