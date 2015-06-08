(function () {
    angular
        .module('fastaView')
        .controller('SecondController', ['$scope', '$timeout', 'ConfigurationService', 'SecondDataService', SecondController]);

    function SecondController($scope, $timeout, ConfigurationService, SecondDataService) {

        initialize();

        function initialize() {
            initializeScopeVariables();
            initializeScopeFunctions();
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequences = ConfigurationService.secondStage.baseSequences;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            $scope.stepData.maxDistance = ConfigurationService.maxDistance;
            $scope.stepData.scoreMatrix = ConfigurationService.scoreMatrix;

            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[0];

            restoreState();
            redrawDiagonalsTable();
            initializeStepsConfig();
        }

        function initializeScopeFunctions() {
            $scope.changeSequence = changeSequence;
            $scope.saveLastStep = saveLastStep;
            $scope.highlightOnDiagonalsTable = highlightOnDiagonalsTable;
        }

        function changeSequence(index) {
            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[index];
            redrawDiagonalsTable();
        }

        function saveLastStep(lastStep) {
            SecondDataService.lastStep = lastStep;
        }

        function highlightOnDiagonalsTable(diagonal) {
            $scope.stepData.selectedDiagonal = diagonal;
            $scope.highlightDiagonal(diagonal);
        }

        function restoreState() {
            $scope.stepData.currentStep = SecondDataService.lastStep || 0;
            $scope.stepData.currentDiagonals = SecondDataService.bestDiagonals || SecondDataService.scoredDiagonals || SecondDataService.diagonals;
            $scope.stepData.bestSequences = ConfigurationService.thirdStage.baseSequences;
        }

        function initializeStepsConfig() {
            $scope.stepData.stepByStepConfig = [
                {
                    description: 'Etap 2 - początek',
                    reverse: clearStageData
                },
                {
                    description: "Znalezienie wszystkich ciągów diagonalnych dla każdej z par sekwencji",  //and show
                    action: findDiagonals,
                    reverse: reverseFindDiagonals
                },
                {
                    description: 'Ocena ciągów za pomocą ustalonej macierzy substytucji',
                    action: score,
                    reverse: reverseScore
                },
                {
                    description: 'Wybranie 10 najlepszych ciągów diagonalnych dla każdej z par sekwencji',
                    action: getBestDiagonals,
                    reverse: reverseGetBestDiagonals
                },
                {
                    description: "Wybranie najlepszych sekwencji do następnego etapu",
                    action: bestBaseSequences,
                    reverse: reverseBestBaseSequences
                }
            ];
        }

        function findDiagonals() {
            return SecondDataService.getDiagonalsForEachBaseSequence(ConfigurationService.secondStage.hotSpots,
                $scope.stepData.kTup, $scope.stepData.maxDistance).then(function (diagonals) {
                    SecondDataService.diagonals = angular.copy(diagonals);
                    $scope.stepData.currentDiagonals = diagonals;
                    $scope.drawDiagonalsTable($scope.stepData.currentDiagonals[$scope.stepData.currentBaseSequence]);
                });
        }

        function score() {
            return SecondDataService.scoreForEachBaseSequence($scope.stepData.currentDiagonals, $scope.stepData.scoreMatrix,
                $scope.stepData.querySequence).then(function (scored) {
                    SecondDataService.scoredDiagonals = angular.copy(scored);
                    $scope.stepData.currentDiagonals = scored;
                    redrawDiagonalsTable();
                });
        }

        function getBestDiagonals() {
            return SecondDataService.getBestDiagonalsForEachSequence($scope.stepData.currentDiagonals).then(function (best) {
                $scope.stepData.foundBestStep = true;
                $scope.stepData.currentDiagonals = best;
                SecondDataService.bestDiagonals = angular.copy(best);
                SecondDataService.foundBestStep = $scope.stepData.foundBestStep;
                redrawDiagonalsTable();
            })
        }

        function bestBaseSequences() {
            return SecondDataService.getDiagonalsForBestSequences($scope.stepData.currentDiagonals)
                .then(function (diagonalsForBestSequences) {
                    ConfigurationService.thirdStage.bestDiagonals = diagonalsForBestSequences;
                    ConfigurationService.thirdStage.baseSequences = Object.keys(diagonalsForBestSequences);
                    $scope.stepData.bestSequences = Object.keys(diagonalsForBestSequences);
                })
        }

        function clearStageData() {
            SecondDataService.bestDiagonals = undefined;
            SecondDataService.scoredDiagonals = undefined;
            SecondDataService.diagonals = undefined;
            ConfigurationService.thirdStage.baseSequences = undefined;
        }

        function reverseFindDiagonals() {
            $scope.stepData.currentDiagonals = undefined;
            SecondDataService.diagonals = undefined;
            $scope.clearDiagonalsTable();
        }

        function reverseScore() {
            $scope.stepData.currentDiagonals = SecondDataService.diagonals;
            redrawDiagonalsTable();
        }

        function reverseGetBestDiagonals() {
            SecondDataService.bestDiagonals = undefined;
            $scope.stepData.foundBestStep = false;
            SecondDataService.foundBestStep = $scope.stepData.foundBestStep;
            $scope.stepData.currentDiagonals = SecondDataService.scoredDiagonals;
            redrawDiagonalsTable();
        }

        function reverseBestBaseSequences() {
            ConfigurationService.thirdStage = {};
            $scope.stepData.bestSequences = undefined;
        }

        function redrawDiagonalsTable() {
            if ($scope.stepData.currentDiagonals) {
                $timeout(function () {
                    $scope.clearDiagonalsTable();
                    $scope.drawDiagonalsTable($scope.stepData.currentDiagonals[$scope.stepData.currentBaseSequence]);
                    $scope.stepData.selectedDiagonal = undefined;
                    $scope.clearHighlight();
                });
            }
        }
    }
})();
