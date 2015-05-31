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
            $scope.stepData.baseSequence = ConfigurationService.baseSequence;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            $scope.stepData.lastStep = SecondDataService.lastStep || 0;

            $scope.stepData.scoreMatrix = ConfigurationService.scoreMatrix;

            $scope.stepData.stepByStepConfig = [
                {description: 'Stage 2 - beginning'},
                {
                    description: "Find all diagonals by linking close Hot Spots",  //and show
                    action: findDiagonals,
                    reverse: reverseFindDiagonals
                },
                {
                    description: 'Score diagonals with values from score matrix',
                    action: score,
                    reverse: reverseScore
                },
                {
                    description: 'Get 10 best diagonals',
                    action: getBest,
                    reverse: reverseGetBest
                }
            ];
        }

        function initializeScopeFunctions() {
            $scope.score = score;
            $scope.saveLastStep = saveLastStep;
            $scope.highlightOnDiagonalsTable = highlightOnDiagonalsTable;
        }

        function score() {
            SecondDataService.score($scope.stepData.currentDiagonals, $scope.stepData.scoreMatrix,
                $scope.stepData.baseSequence, $scope.stepData.querySequence).then(function(scored) {
                    SecondDataService.scoredDiagonals = angular.copy(scored);
                    $scope.stepData.currentDiagonals = scored;
                    $scope.clearDiagonalsTable();
                    $scope.drawDiagonalsTable($scope.stepData.currentDiagonals);
                });
        }

        function reverseScore() {
            $scope.stepData.currentDiagonals = SecondDataService.diagonals;
            $scope.clearDiagonalsTable();
            $scope.drawDiagonalsTable($scope.stepData.currentDiagonals);
        }

        function getBest() {
            SecondDataService.get10Best($scope.stepData.currentDiagonals).then(function(best) {
                $scope.stepData.foundBestStep = true;
                $scope.stepData.currentDiagonals = best;
                ConfigurationService.bestDiagonals = angular.copy(best);
                $scope.clearDiagonalsTable();
                $scope.drawDiagonalsTable($scope.stepData.currentDiagonals);
            })
        }

        function reverseGetBest() {
            ConfigurationService.bestDiagonals = undefined;
            $scope.stepData.foundBestStep = false;
            $scope.stepData.currentDiagonals = SecondDataService.scoredDiagonals;
            $scope.clearDiagonalsTable();
            $scope.drawDiagonalsTable($scope.stepData.currentDiagonals);
        }

        function saveLastStep() {
            SecondDataService.lastStep = lastStep;
        }

        function findDiagonals() {
            //TODO: param for max gap
            SecondDataService.getDiagonals(ConfigurationService.hotSpots, $scope.stepData.kTup, 0).then(function (diagonals) {
                SecondDataService.diagonals = angular.copy(diagonals);
                $scope.stepData.currentDiagonals = diagonals;

                var removeWatch = $scope.$watch('drawDiagonalsTable', function () {
                    if ($scope.drawDiagonalsTable) {
                        removeWatch();
                        $timeout(function () {
                            $scope.drawDiagonalsTable($scope.stepData.currentDiagonals);
                        });

                    }
                })
            });
        }

        function reverseFindDiagonals() {
            $scope.stepData.currentDiagonals = undefined;
            SecondDataService.diagonals = undefined;
            $scope.clearDiagonalsTable();
        }

        function highlightOnDiagonalsTable(diagonal) {
            $scope.stepData.selectedDiagonal = diagonal;
            $scope.highlightDiagonal(diagonal);
        }
    }
})();
