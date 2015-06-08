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
            restoreState();
            initializeStepsConfig();
        }

        function initializeScopeFunction() {
            $scope.changeSequence = changeSequence;
            $scope.drawPath = drawPath;
            $scope.saveLastStep = saveLastStep;
            $scope.isPartOfAlignment = isPartOfAlignment;
        }

        function changeSequence(index) {
            var newSequence = $scope.stepData.baseSequences[index];
            if (newSequence !== $scope.stepData.currentBaseSequence) {
                $scope.stepData.currentBaseSequence = newSequence;
                $scope.stepData.selectedPath = undefined;
                $scope.clearDiagonalsTable();
            }
        }

        function drawPath(path) {
            $scope.stepData.selectedPath = path;
            $scope.clearDiagonalsTable();
            $scope.drawDiagonalsPath(path);
        }

        function saveLastStep(lastStep) {
            ThirdDataService.lastStep = lastStep;
        }

        function isPartOfAlignment(index) {
            return $scope.stepData.alignments && (index >= $scope.stepData.alignments[$scope.stepData.currentBaseSequence].baseHighlight[0] &&
                index <= $scope.stepData.alignments[$scope.stepData.currentBaseSequence].baseHighlight[1]);
        }

        function restoreState() {
            $scope.stepData.bestSequences = ConfigurationService.fourthStage.baseSequences;
            $scope.stepData.currentStep = ThirdDataService.lastStep || 0;
            $scope.stepData.currentDiagonalsPaths = ThirdDataService.bestPaths || ThirdDataService.scoredPaths || ThirdDataService.diagonalsPaths;
            $scope.stepData.alignments = ThirdDataService.alignments;
        }

        function initializeStepsConfig() {
            $scope.stepData.stepByStepConfig = [
                {
                    description: 'Etap 3 - początek',
                    reverse: clearStageData
                },
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
                    description: "Wyznaczenie przykładowych dopasowań dla najlepszych ścieżek dla każdej sekwencji",
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

        function buildDiagonalsPaths() {
            return ThirdDataService.createDiagonalsPathsForEachSequence($scope.stepData.diagonals).then(function (paths) {
                $scope.stepData.currentDiagonalsPaths = paths;
                ThirdDataService.diagonalsPaths = angular.copy(paths);
            });
        }

        function scorePaths() {
            return ThirdDataService.scorePathsForEachSequence($scope.stepData.currentDiagonalsPaths, ConfigurationService.gapPenalty)
                .then(function (scoredPaths) {
                    $scope.stepData.currentDiagonalsPaths = scoredPaths;
                    ThirdDataService.scoredPaths = angular.copy(scoredPaths);
                })
        }

        function getBestPaths() {
            return ThirdDataService.getBestPathsForEachSequence($scope.stepData.currentDiagonalsPaths).then(function (bestPaths) {
                $scope.stepData.currentDiagonalsPaths = bestPaths;
                ThirdDataService.bestPaths = angular.copy(bestPaths);
                $scope.clearDiagonalsTable();
            })
        }

        function findAlignments() {
            return ThirdDataService.findAlignmentsOfBestPathsForEachSequence($scope.stepData.currentDiagonalsPaths, $scope.stepData.querySequence)
                .then(function (pathsWithAlignments) {
                    $scope.stepData.alignments = createAlignmentsStrings(pathsWithAlignments);
                    ThirdDataService.alignments = $scope.stepData.alignments;
                });
        }

        function bestBaseSequences() {
            return ThirdDataService.getPathsForBestSequences($scope.stepData.currentDiagonalsPaths).then(function (pathsForBestSequences) {
                ConfigurationService.fourthStage.bestPaths = pathsForBestSequences;
                ConfigurationService.fourthStage.baseSequences = Object.keys(pathsForBestSequences);
                $scope.stepData.bestSequences = Object.keys(pathsForBestSequences);
            });
        }

        function clearStageData() {
            ConfigurationService.fourthStage.baseSequences = undefined;
            ThirdDataService.bestPaths = undefined;
            ThirdDataService.scoredPaths = undefined;
            ThirdDataService.diagonalsPaths = undefined;
            ThirdDataService.alignments = undefined;
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
            $scope.stepData.alignments = undefined;
            ThirdDataService.alignments = undefined;
        }

        function reverseBestBaseSequences() {
            ConfigurationService.fourthStage = {};
            $scope.stepData.bestSequences = undefined;
        }

        function createAlignmentsStrings(pathsWithAlignments) {
            var alignments = {};

            for (var sequence in pathsWithAlignments) {
                var path = pathsWithAlignments[sequence][0],
                    alignment = path.alignment,
                    baseAlignment = createAlignment(sequence, alignment.queryOffset - alignment.baseOffset,
                        alignment.baseOffset, alignment.baseAlignment),
                    queryAlignment = createAlignment($scope.stepData.querySequence,
                        alignment.baseOffset - alignment.queryOffset, alignment.queryOffset, alignment.queryAlignment);

                alignments[sequence] = {
                    baseAlignment: baseAlignment.alignment, queryAlignment: queryAlignment.alignment,
                    baseHighlight: baseAlignment.highlight, queryHighlight: queryAlignment.highlight
                };
            }
            return alignments;
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
