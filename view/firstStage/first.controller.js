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
            $scope.stepData.baseSequencesIndices = FirstDataService.baseSequencesIndices;
            $scope.stepData.querySequenceIndices = FirstDataService.querySequenceIndices;
            $scope.stepData.hotSpots = FirstDataService.hotSpots;
            $scope.stepData.bestSequences = ConfigurationService.secondStage.baseSequences;

            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[0];

            $scope.stepData.stepByStepConfig = [
                {description: 'Etap 1 - rozpoczęcie'},
                {
                    description: "Wyliczenie tabeli indeksującej dla szukanej sekwencji",
                    action: queryIndicesStep,
                    reverse: reverseQueryIndices
                },
                {
                    description: "Wyliczenie tabel indeksujących dla sekwencji z bazy danych",
                    action: baseIndicesStep,
                    reverse: reverseBaseIndices
                },
                {description: "Znalezienie Gorących Miejsc", action: hotSpotsStep, reverse: reverseHotSpots},
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
            if (!basePromise) {
                basePromise = FirstDataService.getMultipleSequenceIndices($scope.stepData.baseSequences, $scope.stepData.kTup);
            }
            basePromise.then(function (data) {
                FirstDataService.baseSequencesIndices = data;
                $scope.stepData.baseSequencesIndices = data;
            });
        }

        function queryIndicesStep() {
            if (!sequencePromise) {
                sequencePromise = FirstDataService.getSequenceIndices($scope.stepData.querySequence, $scope.stepData.kTup);
            }
            sequencePromise.then(function (data) {
                FirstDataService.querySequenceIndices = data;
                $scope.stepData.querySequenceIndices = data;
            });
        }

        function hotSpotsStep() {
            var deferred = $q.defer();
            hotSpotPromise = deferred.promise;
            $q.all([sequencePromise, basePromise]).then(function () {
                FirstDataService.getHotSpots($scope.stepData.baseSequencesIndices, $scope.stepData.querySequenceIndices).then(function (data) {
                    FirstDataService.hotSpots = data;
                    $scope.stepData.hotSpots = data;
                    deferred.resolve();
                });
            });
        }

        function bestBaseSequencesStep() {
            hotSpotPromise.then(function() {
                console.log($scope.stepData.hotSpots);
                FirstDataService.getHotSpotsForBestSequences($scope.stepData.hotSpots).then(function (bestHotSpots) {
                    ConfigurationService.secondStage.baseSequences = Object.keys(bestHotSpots);
                    ConfigurationService.secondStage.hotSpots = bestHotSpots;
                    $scope.stepData.bestSequences = Object.keys(bestHotSpots);

                });
            });
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
