(function () {
    angular
        .module('fastaView')
        .controller('FirstController', ['$scope', '$q', 'ConfigurationService', 'FirstDataService', FirstController]);

    function FirstController($scope, $q, ConfigurationService, FirstDataService) {

        var sequencePromise, basePromise, hotSpotPromise;

        initialize();

        function initialize() {
            initializeScopeVariables();
            initializeScopeFunctions();
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequences = ConfigurationService.baseSequences;
            $scope.stepData.querySequence = ConfigurationService.querySequence;

            $scope.stepData.lastStep = FirstDataService.lastStep || 0;
            $scope.stepData.currentStep = $scope.stepData.lastStep;
            $scope.stepData.baseSequencesIndices = FirstDataService.baseSequencesIndices;
            $scope.stepData.querySequenceIndices = FirstDataService.querySequenceIndices;
            $scope.stepData.hotSpots = FirstDataService.hotSpots;
            $scope.stepData.bestSequences = ConfigurationService.secondStage.baseSequences;

            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[0];

            $scope.stepData.stepByStepConfig = [
                {
                    description: 'Etap 1 - rozpoczęcie',
                    reverse: clearStage
                },
                {
                    description: "Wyliczenie tablicy indeksującej dla szukanej sekwencji",
                    action: queryIndicesStep,
                    reverse: reverseQueryIndices
                },
                {
                    description: "Wyliczenie tablic indeksujących dla wszystkich sekwencji z bazy danych",
                    action: baseIndicesStep,
                    reverse: reverseBaseIndices
                },
                {description: "Znalezienie gorących miejsc", action: hotSpotsStep, reverse: reverseHotSpots},
                {
                    description: "Wybranie najlepszych sekwencji do następnego etapu",
                    action: bestBaseSequencesStep,
                    reverse: reverseBestBaseSequences
                }
            ];
        }

        function initializeScopeFunctions() {
            $scope.saveLastStep = saveLastStep;
            $scope.changeSequence = changeSequence;
        }

        function changeSequence(index) {
            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[index];
        }

        function baseIndicesStep() {
            return FirstDataService.getMultipleSequenceIndices($scope.stepData.baseSequences, $scope.stepData.kTup).then(function (data) {
                FirstDataService.baseSequencesIndices = data;
                $scope.stepData.baseSequencesIndices = data;
            });
        }

        function queryIndicesStep() {
            return FirstDataService.getSequenceIndices($scope.stepData.querySequence, $scope.stepData.kTup).then(function (data) {
                FirstDataService.querySequenceIndices = data;
                $scope.stepData.querySequenceIndices = data;
            });
        }

        function hotSpotsStep() {
            return FirstDataService.getHotSpots($scope.stepData.baseSequencesIndices, $scope.stepData.querySequenceIndices).then(function (data) {
                FirstDataService.hotSpots = data;
                $scope.stepData.hotSpots = data;
            });
        }

        function bestBaseSequencesStep() {
            return FirstDataService.getHotSpotsForBestSequences($scope.stepData.hotSpots).then(function (bestHotSpots) {
                ConfigurationService.secondStage.baseSequences = Object.keys(bestHotSpots);
                ConfigurationService.secondStage.hotSpots = bestHotSpots;
                $scope.stepData.bestSequences = Object.keys(bestHotSpots);

            });
        }

        function clearStage() {
            ConfigurationService.started = false;
            FirstDataService.baseSequencesIndices = undefined;
            FirstDataService.querySequenceIndices = undefined;
            FirstDataService.hotSpots = undefined;
            ConfigurationService.secondStage.hotSpots = undefined;
            ConfigurationService.secondStage.baseSequences = undefined;

        }

        function reverseBaseIndices() {
            $scope.stepData.baseSequencesIndices = undefined;
        }

        function reverseQueryIndices() {
            $scope.stepData.querySequenceIndices = undefined;
        }

        function reverseHotSpots() {
            FirstDataService.hotSpots = undefined;
            $scope.stepData.hotSpots = undefined;
        }

        function reverseBestBaseSequences() {
            ConfigurationService.secondStage = {};
            $scope.stepData.bestSequences = undefined;
        }

        function saveLastStep(lastStep) {
            FirstDataService.lastStep = lastStep;
        }
    }
})
();
