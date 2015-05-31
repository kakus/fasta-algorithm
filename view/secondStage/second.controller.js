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
                    description: "find all diagonals",
                    action: findDiagonals,
                    reverse: reverseFindDiagonals
                }
            ];
        }

        function initializeScopeFunctions() {
            $scope.score = score;
            $scope.saveLastStep = saveLastStep;
        }

        function score() {
            SecondDataService.score($scope.stepData.diagonals, $scope.stepData.scoreMatrix,
                $scope.stepData.baseSequence, $scope.stepData.querySequence).then(function(scored) {
                    console.log('ha');
                    $scope.stepData.diagonals = scored;
                    $scope.clearDiagonalsTable();
                    $scope.drawDiagonalsTable($scope.stepData.diagonals);
                });
        }

        function saveLastStep() {
            SecondDataService.lastStep = lastStep;
        }

        function findDiagonals() {
            //TODO: param for max gap
            SecondDataService.getDiagonals(ConfigurationService.hotSpots, $scope.stepData.kTup, 0).then(function (diagonals) {
                $scope.stepData.diagonals = diagonals;

                var removeWatch = $scope.$watch('drawDiagonalsTable', function () {
                    if ($scope.drawDiagonalsTable) {
                        removeWatch();
                        $timeout(function () {
                            $scope.drawDiagonalsTable($scope.stepData.diagonals);
                        });

                    }
                })
            });
        }

        function reverseFindDiagonals() {
            $scope.stepData.diagonals = undefined;
            $scope.clearDiagonalsTable();
        }
    }
})();
