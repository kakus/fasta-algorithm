(function () {
    angular
        .module('fastaView')
        .controller('FourthController', ['$scope', '$timeout', 'ConfigurationService', 'FourthDataService', FourthController]);

    function FourthController($scope, $timeout, ConfigurationService, FourthDataService) {

        initialize();

        function initialize() {
            initializeScopeVariables();
            initializeScopeFunction();
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.baseSequences = ConfigurationService.fourthStage.baseSequences;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            $scope.stepData.paths = ConfigurationService.fourthStage.bestPaths;

            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[0];

            $scope.stepData.stepByStepConfig = [
                {description: 'Etap 4 - początek'},
                {
                    description: "Algorytm Smitha-Watermana dla najlepszych sekwencji",
                    action: smithWaterman,
                    reverse: reverseSmithWaterman
                },
                {
                    description: "Zaznaczenie najlepszych ścieżek w macierzy dla każdej sekwencji",
                    action: getBestSolutions,
                    reverse: reverseGetBestSolutions
                },
                {
                    description: 'Przedstawienie znalezionych dopasowań dla każdej sekwencji',
                    action: getAlignments,
                    reverse: reverseGetAlignments
                },
                {
                    description: 'Wybór najlepiej dopasowanej sekwencji',
                    action: chooseBestSequence,
                    reverse: reverseChooseBestSequence
                }
            ];
        }


        function initializeScopeFunction() {
            $scope.changeSequence = changeSequence;
        }

        function changeSequence(index) {
            var newSequence = $scope.stepData.baseSequences[index];
            if (newSequence !== $scope.stepData.currentBaseSequence) {
                $scope.stepData.currentBaseSequence = newSequence;
                refreshTable();
            }

        }

        function smithWaterman() {
            FourthDataService.smithWatermanForEachSequence($scope.stepData.baseSequences, $scope.stepData.querySequence,
                ConfigurationService.scoreMatrix, ConfigurationService.gapPenalty).then(function (matrices) {
                    $scope.stepData.smithWatermanMatrices = matrices;
                    FourthDataService.matrices = matrices;
                });
        }

        function getBestSolutions() {
            FourthDataService.findSolutionsForEachSequence($scope.stepData.smithWatermanMatrices).then(function (solutions) {
                $scope.stepData.smithWatermanSolutions = solutions;
                FourthDataService.solutions = solutions;
                refreshTable();
            });
        }

        function getAlignments() {
            FourthDataService.getAlignmentsForEachSequence($scope.stepData.smithWatermanSolutions, $scope.stepData.querySequence)
                .then(function(alignments) {
                    $scope.stepData.alignments = alignments;
                    FourthDataService.alignments = alignments;
                })
        }

        function chooseBestSequence() {
            FourthDataService.getBestSequence($scope.stepData.smithWatermanSolutions).then(function(bestSequence) {
                $scope.stepData.bestSequence = bestSequence;
                FourthDataService.bestSequence = bestSequence;
            });
        }

        function reverseSmithWaterman() {
            $scope.stepData.smithWatermanMatrices = undefined;
            FourthDataService.matrices = undefined;
        }

        function reverseGetBestSolutions() {
            $scope.stepData.smithWatermanSolutions = undefined;
            FourthDataService.solutions = undefined;
            $scope.clearHighlight();
        }

        function reverseGetAlignments() {
            $scope.stepData.alignments = undefined;
            FourthDataService.alignments = undefined;
        }

        function reverseChooseBestSequence() {
            $scope.stepData.bestSequence = undefined;
            FourthDataService.bestSequence = undefined;
        }

        function refreshTable() {
            if ($scope.stepData.smithWatermanSolutions) {
                $timeout(function() {
                    $scope.clearHighlight();
                    $scope.highlightCells($scope.stepData.smithWatermanSolutions[$scope.stepData.currentBaseSequence]);
                });
            }
        }
    }
})();
