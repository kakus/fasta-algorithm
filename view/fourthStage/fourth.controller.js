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

            $scope.stepData.smithWatermanMatrices = FourthDataService.matrices;
            $scope.stepData.smithWatermanSolutions = FourthDataService.solutions;
            $scope.stepData.alignments = FourthDataService.alignments;
            $scope.stepData.bestSequence = FourthDataService.bestSequence;

            $scope.stepData.lastStep = FourthDataService.lastStep || 0;
            $scope.stepData.currentStep = $scope.stepData.lastStep;

            refreshTable();

            $scope.stepData.stepByStepConfig = [
                {
                    description: 'Etap 4 - początek',
                    reverse: clearStage
                },
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
            $scope.isPartOfAlignment = isPartOfAlignment;
            $scope.saveLastStep = saveLastStep;
        }

        function changeSequence(index) {
            var newSequence = $scope.stepData.baseSequences[index];
            if (newSequence !== $scope.stepData.currentBaseSequence) {
                $scope.stepData.currentBaseSequence = newSequence;
                refreshTable();
            }
        }

        function isPartOfAlignment(alignmentIndex, charIndex) {
            return $scope.stepData.alignments && (charIndex >= $scope.stepData.alignments[$scope.stepData.currentBaseSequence][alignmentIndex].baseHighlight[0] &&
                charIndex <= $scope.stepData.alignments[$scope.stepData.currentBaseSequence][alignmentIndex].baseHighlight[1]);
        }

        function saveLastStep(lastStep) {
            FourthDataService.lastStep = lastStep;
        }

        function smithWaterman() {
            return FourthDataService.smithWatermanForEachSequence($scope.stepData.baseSequences, $scope.stepData.querySequence,
                ConfigurationService.scoreMatrix, ConfigurationService.gapPenalty).then(function (matrices) {
                    $scope.stepData.smithWatermanMatrices = matrices;
                    FourthDataService.matrices = matrices;
                });
        }

        function getBestSolutions() {
            return FourthDataService.findSolutionsForEachSequence($scope.stepData.smithWatermanMatrices).then(function (solutions) {
                $scope.stepData.smithWatermanSolutions = solutions;
                FourthDataService.solutions = solutions;
                refreshTable();
            });
        }

        function getAlignments() {
            return FourthDataService.getAlignmentsForEachSequence($scope.stepData.smithWatermanSolutions, $scope.stepData.querySequence)
                .then(function(alignments) {
                    $scope.stepData.alignments = createAlignmentsStrings(alignments);
                    FourthDataService.alignments = $scope.stepData.alignments;
                })
        }

        function chooseBestSequence() {
            return FourthDataService.getBestSequence($scope.stepData.smithWatermanSolutions).then(function(bestSequence) {
                $scope.stepData.bestSequence = bestSequence;
                FourthDataService.bestSequence = bestSequence;
            });
        }

        function clearStage() {
            FourthDataService.matrices = undefined;
            FourthDataService.solutions = undefined;
            FourthDataService.alignments = undefined;
            FourthDataService.bestSequence = undefined;
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

        function createAlignmentsStrings(alignmentsBySequences) {
            var alignmentsString = {};

            for (var sequence in alignmentsBySequences) {
                var alignments = alignmentsBySequences[sequence];
                alignmentsString[sequence] = [];

                for (var i = 0; i < alignments.length; i++) {
                    var alignment = alignments[i],
                        baseAlignment = createAlignment(sequence, alignment.queryOffset - alignment.baseOffset,
                            alignment.baseOffset, alignment.baseAlignment),
                        queryAlignment = createAlignment($scope.stepData.querySequence,
                            alignment.baseOffset - alignment.queryOffset, alignment.queryOffset, alignment.queryAlignment);

                    alignmentsString[sequence].push({
                        baseAlignment: baseAlignment.alignment, queryAlignment: queryAlignment.alignment,
                        baseHighlight: baseAlignment.highlight, queryHighlight: queryAlignment.highlight
                    });
                }
            }
            return alignmentsString;
        }

        function createAlignment(sequence, offsetDifference, offset, currentAlignment) {
            var resultAlignment = '',
                resultHighlight = [];
            if (offsetDifference > 0) {
                resultAlignment += new Array(offsetDifference + 1).join(' ');
            }

            resultAlignment += sequence.slice(0, offset);
            resultHighlight.push(resultAlignment.length);
            resultAlignment += currentAlignment;
            resultHighlight.push(resultAlignment.length - 1);
            resultAlignment += sequence.slice(offset + currentAlignment.replace(/-/g, '').length);

            return {
                alignment: resultAlignment,
                highlight: resultHighlight
            }
        }
    }
})();
