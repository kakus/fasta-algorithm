angular.module('fastaView', ['ngRoute']);

(function(){
    angular
    .module('fastaView')
    .run(run);

    function run($rootScope){
    }
})();

(function () {
    angular
        .module('fastaView')
        .config(['$routeProvider', router]);

    function router($routeProvider) {

        $routeProvider.
            when('/home', {
                templateUrl: 'view/home/home.html'
            }).
            when('/config', {
                templateUrl: 'view/configStep/config-panel.html',
                controller: 'ConfigController'
            }).
            when('/first_stage', {
                templateUrl: 'view/firstStage/first-panel.html',
                controller: 'FirstController'
            }).
            when('/second_stage', {
                templateUrl: 'view/secondStage/second-panel.html',
                controller: 'SecondController'
            }).
            when('/third_stage', {
                templateUrl: 'view/thirdStage/third-panel.html',
                controller: 'ThirdController'
            }).
            when('/fourth_stage', {
                templateUrl: 'view/fourthStage/fourth-panel.html',
                controller: 'FourthController'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }
})();

function Diagonal(startPoint, endPoint, score ){
    this.startPoint = startPoint; // [int x, int y]
    this.endPoint = endPoint; // [int x, int y]
    this.score = score; // int x 
}

(function () {
    angular
        .module('fastaView')
        .factory('ConfigurationService', configurationService);

    function configurationService() {

        var scoreMatrix = {
            A: {A:10, C:-1, G:-3, T:-4},
            C: {A:-1, C:7, G:-5, T:-3},
            G: {A:-3, C:-5, G:9, T:0},
            T: {A:-4, C:-3, G:0, T:8}
        };

        return {
            // default values
            baseSequences: [
                "AACACTTTTCA",
                "ACCTACTTTAC",
                "ATCATCTACTACT",
                "CTACTATCATCATCAT",
                "ACACATCATCACTCT",
                "ACTCTCTACTCATACT",
                "ACTCACTCATCTACT",
                "TACTCTTCCTCTATC",
                "CTAGCTGCTGAATCTTCA",
                "ACTCTCTTACGCTACATCGTAC"
            ],
            querySequence: "ACTTATCAACTCATTCCCA",
            kTup: 2,
            scoreMatrix: scoreMatrix,
            gapPenalty: -5,
            secondStage: {},
            thirdStage: {},
            fourthStage: {}
        };
    }
})();
(function () {
    angular
        .module('fastaView')
        .directive('fastaDiagonalsTable', [diagonalsTable]);

    function diagonalsTable() {
        return {
            scope: false,
            link: link,
            replace: true,
            templateUrl: 'view/shared/fasta-diagonals-table.html'
        };

        function link(scope, element) {

            var currentHighlightedCells;

            initialize();

            function initialize() {
                initializeScopeFunctions();
            }

            function initializeScopeFunctions() {
                scope.drawDiagonalsTable = drawDiagonalsTable;
                scope.drawDiagonal = drawDiagonal;
                scope.clearDiagonalsTable = clearDiagonalsTable;
                scope.highlightDiagonal = highlightDiagonal;
            }

            function drawDiagonalsTable(diagonals) {
                for (var i = 0; i < diagonals.length; ++i) {
                    drawDiagonal(diagonals[i]);
                }
            }

            function drawDiagonal(diagonal) {
                var startPoint = diagonal.startPoint,
                    endPoint = diagonal.endPoint,
                    diagonalClassName = "diagonal-" + startPoint[0] + "-" + startPoint[1]; //name is necessary to group cells in one diagonal - by css class

                for (var x = startPoint[0], y = startPoint[1]; x <= endPoint[0] && y <= endPoint[1]; ++x, ++y) {
                    drawDiagonalCell(x, y, diagonal.score, diagonalClassName);
                }
            }

            function drawDiagonalCell(x, y, score, diagonalClassName) {
                var name = x + '_' + y,
                    cell = element.find('[name="' + name + '"]');
                cell.html('x');
                if (score !== undefined) {
                    cell.attr('title', 'score: ' + score);
                    cell.tooltip();
                }
                cell.addClass(diagonalClassName);

                cell.hover(function () {
                    element.find('.' + diagonalClassName).addClass("diagonal-highlight");
                }, function () {
                    element.find('.' + diagonalClassName).removeClass("diagonal-highlight");
                });
            }

            function clearDiagonalsTable() {
                var cells =  element.find('[class*="diagonal-"]');
                for (var i = 0; i < cells.length; i++) {
                    var cell = angular.element(cells[i]);
                    cell.empty();
                    cell.removeAttr("title");
                    cell.tooltip('destroy');
                    cell.removeClass(makeRemoveClassHandler(/^diagonal/));
                    cell.off('mouseenter mouseleave');
                }
            }

            function highlightDiagonal(diagonal) {
                var diagonalClassName = "diagonal-" + diagonal.startPoint[0] + "-" + diagonal.startPoint[1],
                    cells = element.find('.' + diagonalClassName);

                if (currentHighlightedCells) {
                    currentHighlightedCells.removeClass('highlight-on-click');
                }
                cells.addClass('highlight-on-click');
                currentHighlightedCells = cells;
            }
        }
    }
})();
(function () {
    angular
        .module('fastaView')
        .directive('fastaHighlight', ['$document', fastaHighlight]);

    function fastaHighlight($document) {
        return {
            restrict: 'A',
            scope: {
                highlightParagraphsList: '='
            },
            transclude: true,
            link: link,
            template: '<div ng-mouseover="highlightPartOfParagraphs()" ng-mouseleave="highlightOff()"><ng-transclude></ng-transclude></div>'
        };

        function link(scope, element) {
            initialize();

            function initialize() {
                initializeScopeFunctions();
            }

            function initializeScopeFunctions() {
                scope.highlightPartOfParagraphs = highlightPartOfParagraphs;
                scope.highlightOff = highlightOff;
            }

            function highlightPartOfParagraphs() {
                for (var i = 0; i < scope.highlightParagraphsList.length; i++) {
                    highlight(scope.highlightParagraphsList[i]);
                }
            }

            function highlight(paragraphData) {
                var prefix, suffix, highlightedPart,
                    index = parseInt(paragraphData.startIndex),
                    length = parseInt(paragraphData.length);

                prefix = paragraphData.content.slice(0, index);
                highlightedPart = paragraphData.content.slice(index, index + length);
                suffix = paragraphData.content.slice(index + length);

                $document.find('#' + paragraphData.paragraphId).html(prefix + '<span class="highlight">' + highlightedPart + '</span>' + suffix);
            }

            function highlightOff() {
                for (var i = 0; i < scope.highlightParagraphsList.length; i++) {
                    $document.find('#' + scope.highlightParagraphsList[i].paragraphId)
                        .html(scope.highlightParagraphsList[i].content)
                }
            }
        }
    }
})();

function makeRemoveClassHandler(regex) {
  return function (index, classes) {
      return classes.split(/\s+/).filter(function (el) {return regex.test(el);}).join(' ');
    }
}

(function () {
    angular.
        module('fastaView').
        directive('fastaNavigationFooter', ['$location', navigationFooter]);

    function navigationFooter($location) {
        return {
            restrict: 'A',
            scope: {
                previousUrl: '@',
                nextUrl: '@',
                lastStep: '=',
                saveStep: '&',
                config: '='
            },
            link: link,
            templateUrl: 'view/shared/navigationFooter/fasta-navigation-footer.html'
        };

        function link(scope) {
            initialize();

            function initialize() {
                initializeScopeVariables();
                initializeScopeFunctions();
            }

            function initializeScopeVariables() {
                scope.currentStep = scope.lastStep || 0;
                scope.description = scope.config[scope.currentStep].description;
            }

            function initializeScopeFunctions() {
                scope.nextStep = nextStep;
                scope.previousStep = previousStep;
                scope.isLastStep = isLastStep;
                scope.isFirstStep = isFirstStep;
                scope.isLastStage = isLastStage;

                scope.nextStage = nextStage;
            }

            function nextStep() {
                ++scope.currentStep;

                scope.description = scope.config[scope.currentStep].description;
                scope.config[scope.currentStep].action();
            }

            function previousStep() {
                scope.config[scope.currentStep].reverse();
                --scope.currentStep;
                scope.description = scope.config[scope.currentStep].description;
            }

            function isLastStep() {
                return scope.currentStep === scope.config.length - 1;
            }

            function isFirstStep() {
                return scope.currentStep === 0;
            }

            function isLastStage() {
                return scope.nextUrl ? false : true;
            }

            function nextStage() {
                if (isLastStep()) {
                    scope.saveStep({lastStep: scope.currentStep});
                    $location.url(scope.nextUrl);
                } else {
                    finishStage();
                }
            }

            function finishStage() {
                while(!isLastStep()) {
                    nextStep();
                }
            }
        }
    }
})();

(function () {
    angular.
        module('fastaView').
        directive('fastaSequenceValidator', [sequenceValidator]);

    function sequenceValidator() {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var possibleCharacters = attrs.fastaSequenceValidator || ['A', 'C', 'T', 'G'];

            initialize();

            function initialize() {
                element.on('keypress', function(event) {
                    var pressed = String.fromCharCode(event.which);
                    if (possibleCharacters.indexOf(pressed) === -1) {
                        event.preventDefault();
                    }
                });
            }
        }
    }
})();
(function () {
    angular.
        module('fastaView').
        directive('fastaMenu', ['$location', menu]);

    function menu($location) {
        return {
            restrict: 'A',
            link: link,
            templateUrl: 'view/shared/menu/fasta-menu.html'
        };

        function link(scope) {
            initialize();

            function initialize() {
                initializeScopeFunctions();
            }

            function initializeScopeFunctions() {
                scope.menuSelected = menuSelected;
            }

            function menuSelected(selected) {
                return $location.path() === selected;
            }
        }
    }
})();

(function () {
    angular.
        module('fastaView').
        directive('fastaSequencesAtStage', [sequencesAtStage]);

    function sequencesAtStage() {
        return {
            restrict: 'A',
            scope: {
                sequences: '='
            },
            link: link,
            templateUrl: 'view/shared/sequencesAtStage/fasta-sequences-at-stage.html'
        };

        function link() {
        }
    }
})();

(function () {
    angular.
        module('fastaView').
        directive('fastaSequencesTabs', [sequencesTabs]);

    function sequencesTabs() {
        return {
            restrict: 'A',
            scope: {
                sequences: '=',
                changeSequence: '&'
            },
            link: link,
            templateUrl: 'view/shared/sequencesTabs/fasta-sequences-tabs.html'
        };

        function link() {
        }
    }
})();

(function () {
    angular
        .module('fastaView')
        .directive('fastaSmithWatermanTable', [smithWatermanTable]);

    function smithWatermanTable() {
        return {
            scope: false,
            link: link,
            replace: true,
            templateUrl: 'view/shared/smithWatermanTable/fasta-smith-waterman-table.html'
        };

        function link(scope, element) {

            initialize();

            function initialize() {
                initializeScopeFunctions();
            }

            function initializeScopeFunctions() {
                scope.highlightCells = highlightCells;
                scope.clearHighlight = clearHighlight;
            }

            function highlightCells(solutions) {
                var solution;
                console.log(solutions);
                for (var i = 0; i < solutions.length; i++) {
                    solution = solutions[i];
                    console.log(solution.path);
                    for (var j = 0; j < solution.path.length; j++) {
                        highlightCell(solution.path[j]);
                    }
                }
            }

            function highlightCell(cellIndices) {
                var name = cellIndices[0] + '_' + cellIndices[1],
                    cell = element.find('[name="' + name + '"]');
                console.log('new');
                console.log(name);
                console.log(cell);

                cell.addClass('highlight-sw');
            }

            function clearHighlight() {
                var cells = element.find('.highlight-sw');
                cells.removeClass('highlight-sw');
            }
        }
    }
})();

(function() {
    angular
    .module('fastaView')
    .controller('ConfigController', ['$scope', 'ConfigurationService', ConfigController]);

    function ConfigController($scope, ConfigurationService){

        initialize();

        function initialize() {

            initializeScopeVariables();
            initializeScopeFunctions();
        }

        function initializeScopeVariables() {
            $scope.configData = {};
            $scope.configData.baseSequences = ConfigurationService.baseSequences;
            $scope.configData.querySequence = ConfigurationService.querySequence;
            $scope.configData.kTup = ConfigurationService.kTup;
            $scope.configData.scoreMatrix = ConfigurationService.scoreMatrix;
            $scope.configData.gapPenalty = ConfigurationService.gapPenalty;

            $scope.configData.newSequence = '';

            $scope.configData.emptyNewSequence = false;
        }

        function initializeScopeFunctions() {
            $scope.save = save;
            $scope.removeBaseSequence = removeBaseSequence;
            $scope.addBaseSequence = addBaseSequence;
        }

        function save(){
            ConfigurationService.baseSequences = $scope.configData.baseSequences;
            ConfigurationService.querySequence = $scope.configData.querySequence;
            ConfigurationService.kTup = $scope.configData.kTup;
            ConfigurationService.scoreMatrix = $scope.configData.scoreMatrix;
            ConfigurationService.gapPenalty = $scope.configData.gapPenalty;
        }

        function removeBaseSequence(index) {
            $scope.configData.baseSequences.splice(index, 1);
        }

        function addBaseSequence() {
            if (!$scope.configData.newSequence) {
                $scope.configData.emptyNewSequence = true;
                return;
            }

            $scope.configData.baseSequences.pushUnique($scope.configData.newSequence);
            $scope.configData.newSequence = '';
            $scope.configData.emptyNewSequence = false;
        }
    }
})();

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

(function () {
    angular
        .module('fastaView')
        .factory('FirstDataService', ['$q', '$timeout', firstDataService]);

    function firstDataService($q, $timeout) {
        return {
            getSequenceIndices: getSequenceIndices,
            getMultipleSequenceIndices: getMultipleSequenceIndices,
            getHotSpots: getHotSpots,
            getHotSpotsForBestSequences: getHotSpotsForBestSequences
        };

        function getSequenceIndices(sequence, ktup) {
            var deferred = $q.defer();

            $timeout(function() {
                var indices = new fasta.IndexingArray(sequence, ktup);
                deferred.resolve(indices);
            });

            return deferred.promise;
        }

        function getMultipleSequenceIndices(sequences, ktup) {
            var deferred = $q.defer();

            $timeout(function() {
                var indexingArrays = {};
                for (var i = 0; i < sequences.length; i++) {
                    var sequence = sequences[i];
                    indexingArrays[sequence] = new fasta.IndexingArray(sequence, ktup);
                }
                deferred.resolve(indexingArrays);
            });

            return deferred.promise;
        }

        function getHotSpots(baseIndicesArray, queryIndices) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(fasta.findHotspotsForMultipleSequences(queryIndices, baseIndicesArray));
            });

            return deferred.promise;
        }

        function getHotSpotsForBestSequences(hotSpots) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(fasta.getHotSpotsForBestSequences(hotSpots));
            });

            return deferred.promise;
        }
    }
})();

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

            $scope.stepData.lastStep = SecondDataService.lastStep || 0;
            $scope.stepData.currentDiagonals = SecondDataService.bestDiagonals || SecondDataService.scoredDiagonals || SecondDataService.diagonals;
            $scope.stepData.bestSequences = ConfigurationService.thirdStage.baseSequences;
            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[0];
            if ($scope.stepData.currentDiagonals) {
                redrawDiagonalsTable();
            }

            $scope.stepData.scoreMatrix = ConfigurationService.scoreMatrix;

            $scope.stepData.stepByStepConfig = [
                {description: 'Etap 2 - początek'},
                {
                    description: "Znalezienie wszystkich Ciągów Diagonalnych dla każdej z par sekwencji poprzez łączenie bliskich Gorących Miejsc",  //and show
                    action: findDiagonals,
                    reverse: reverseFindDiagonals
                },
                {
                    description: 'Ocena Ciągów za pomocą ustalonej macierzy substytucji',
                    action: score,
                    reverse: reverseScore
                },
                {
                    description: 'Wybranie 10 najlepszych ciągów diagonalnych dla każdej z par sekwencji bazowa - szukana',
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

        function initializeScopeFunctions() {
            $scope.changeSequence = changeSequence;
            $scope.saveLastStep = saveLastStep;
            $scope.highlightOnDiagonalsTable = highlightOnDiagonalsTable;
        }

        function changeSequence(index) {
            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[index];
            if ($scope.stepData.currentDiagonals) {
                redrawDiagonalsTable();
            }
        }

        function saveLastStep(lastStep) {
            SecondDataService.lastStep = lastStep;
        }

        function highlightOnDiagonalsTable(diagonal) {
            $scope.stepData.selectedDiagonal = diagonal;
            $scope.highlightDiagonal(diagonal);
        }

        function findDiagonals() {
            //TODO: param for max gap
            SecondDataService.getDiagonalsForEachBaseSequence(ConfigurationService.secondStage.hotSpots, $scope.stepData.kTup, 0).then(function (diagonals) {
                SecondDataService.diagonals = angular.copy(diagonals);
                $scope.stepData.currentDiagonals = diagonals;
                $scope.drawDiagonalsTable($scope.stepData.currentDiagonals[$scope.stepData.currentBaseSequence]);
            });
        }

        function score() {
            SecondDataService.scoreForEachBaseSequence($scope.stepData.currentDiagonals, $scope.stepData.scoreMatrix,
                $scope.stepData.querySequence).then(function (scored) {
                    SecondDataService.scoredDiagonals = angular.copy(scored);
                    $scope.stepData.currentDiagonals = scored;
                    redrawDiagonalsTable();
                });
        }

        function getBestDiagonals() {
            SecondDataService.getBestDiagonalsForEachSequence($scope.stepData.currentDiagonals).then(function (best) {
                $scope.stepData.foundBestStep = true;
                $scope.stepData.currentDiagonals = best;
                SecondDataService.bestDiagonals = angular.copy(best);
                SecondDataService.foundBestStep = $scope.stepData.foundBestStep;
                redrawDiagonalsTable();
            })
        }

        function bestBaseSequences() {
            SecondDataService.getDiagonalsForBestSequences($scope.stepData.currentDiagonals).then(function (diagonalsForBestSequences) {
                ConfigurationService.thirdStage.bestDiagonals = diagonalsForBestSequences;
                ConfigurationService.thirdStage.baseSequences = Object.keys(diagonalsForBestSequences);
                $scope.stepData.bestSequences = Object.keys(diagonalsForBestSequences);
            })
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
            $timeout(function() {
                $scope.clearDiagonalsTable();
                $scope.drawDiagonalsTable($scope.stepData.currentDiagonals[$scope.stepData.currentBaseSequence]);
            });

        }
    }
})();

(function () {
    angular
        .module('fastaView')
        .factory('SecondDataService', ['$q', '$timeout', SecondDataService]);

    function SecondDataService($q, $timeout) {

        return {
            getDiagonalsForEachBaseSequence: getDiagonalsForEachBaseSequence,
            scoreForEachBaseSequence: scoreForEachBaseSequence,
            getBestDiagonalsForEachSequence: getBestDiagonalsForEachSequence,
            getDiagonalsForBestSequences: getDiagonalsForBestSequences
        };

        function getDiagonalsForEachBaseSequence(hotSpotsBySequences, ktup, maxGapLength) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.findDiagonalsForEachBaseSequence(hotSpotsBySequences, ktup, maxGapLength));
            });

            return deferred.promise;
        }

        function scoreForEachBaseSequence(diagonalsBySequences, scoreMatrix, querySequence) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.scoreDiagonalsForEachBaseSequence(diagonalsBySequences, scoreMatrix, querySequence));
            });

            return deferred.promise;
        }

        function getBestDiagonalsForEachSequence(diagonalsBySequences) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getBestDiagonalsForEachSequence(diagonalsBySequences));
            });

            return deferred.promise;
        }

        function getDiagonalsForBestSequences(diagonalsBySequences) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getDiagonalsForBestSequences(diagonalsBySequences));
            });

            return deferred.promise;
        }
    }
})();

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

(function(){
    angular
    .module('fastaView')
    .factory('ThirdDataService', ['$q', '$timeout', ThirdDataService]);

function ThirdDataService($q, $timeout){
    return {
        createDiagonalsPathsForEachSequence: createDiagonalsPathsForEachSequence,
        scorePathsForEachSequence: scorePathsForEachSequence,
        findAlignmentsOfBestPathsForEachSequence: findAlignmentsOfBestPathsForEachSequence,
        getBestPathsForEachSequence: getBestPathsForEachSequence,
        getPathsForBestSequences: getPathsForBestSequences
    };

    function createDiagonalsPathsForEachSequence(diagonalsBySequences) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.createDiagonalsPathsForEachSequence(diagonalsBySequences));
        });

        return deferred.promise;
    }

    function scorePathsForEachSequence(pathsBySequences, gapPenalty) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.scoreDiagonalsPathsForEachSequence(pathsBySequences, gapPenalty));
        });

        return deferred.promise;
    }

    function findAlignmentsOfBestPathsForEachSequence(pathsBySequences, querySequence) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.getAlignmentOfBestPathForEachSequence(pathsBySequences, querySequence));
        });

        return deferred.promise;
    }

    function getBestPathsForEachSequence(pathsBySequences) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.getBestPathsForEachSequence(pathsBySequences));
        });

        return deferred.promise;
    }

    function getPathsForBestSequences(pathsBySequences) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve(fasta.getPathsForBestSequences(pathsBySequences));
        });

        return deferred.promise;
    }
}
})();


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

(function () {
    angular
        .module('fastaView')
        .factory('FourthDataService', ['$q', '$timeout', fourthDataService]);

    function fourthDataService($q, $timeout) {
        return {
            smithWatermanForEachSequence: smithWatermanForEachSequence,
            findSolutionsForEachSequence: findSolutionsForEachSequence,
            getAlignmentsForEachSequence: getAlignmentsForEachSequence,
            getBestSequence: getBestSequence
        };

        function smithWatermanForEachSequence(baseSequences, querySequence, scoreMatrix, gapPenalty) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.createSmithWatermanMatrixForEachSequence(baseSequences, querySequence, scoreMatrix, gapPenalty));
            });

            return deferred.promise;
        }

        function findSolutionsForEachSequence(swMatricesBySequence) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.findSWSolutionsForEachSequence(swMatricesBySequence));
            });

            return deferred.promise;
        }

        function getAlignmentsForEachSequence(solutionsBySequences, querySequence) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getSWAlignmentsForEachSequence(solutionsBySequences, querySequence));
            });

            return deferred.promise;
        }

        function getBestSequence(solutionsBySequences) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.getBestSWSequence(solutionsBySequences));
            });

            return deferred.promise;
        }
    }
})();
