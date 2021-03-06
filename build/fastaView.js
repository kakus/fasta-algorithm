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
        .config(['$routeProvider', router])
        .run(['$location', '$rootScope', changePageListener]);

    var lastRoute;

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
                controller: 'FirstController',
                resolve: {
                    check: createCheckStageFunction(1)
                }
            }).
            when('/second_stage', {
                templateUrl: 'view/secondStage/second-panel.html',
                controller: 'SecondController',
                resolve: {
                    check: createCheckStageFunction(2)
                }
            }).
            when('/third_stage', {
                templateUrl: 'view/thirdStage/third-panel.html',
                controller: 'ThirdController',
                resolve: {
                    check: createCheckStageFunction(3)
                }
            }).
            when('/fourth_stage', {
                templateUrl: 'view/fourthStage/fourth-panel.html',
                controller: 'FourthController',
                resolve: {
                    check: createCheckStageFunction(4)
                }
            }).
            otherwise({
                redirectTo: '/home'
            });

        function createCheckStageFunction(stageNumber) {
            return ['$q', '$location', 'CurrentStageService', checkIfStageCanBeLoaded];

            function checkIfStageCanBeLoaded($q, $location, CurrentStageService) {
                if (CurrentStageService.currentStage < stageNumber) {
                    if (lastRoute !== undefined) {
                        $location.path(lastRoute).replace();
                    } else {
                        $location.path('/config').replace();
                    }
                    return $q.reject();
                }

            }
        }
    }

    function changePageListener($location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', rememberLastPage);

        function rememberLastPage(event, current) {
            if (current.$$route !== undefined) {
                lastRoute = $location.path();
            }
        }
    }
})();

(function () {
    angular
        .module('fastaView')
        .factory('ConfigurationService', configurationService);

    function configurationService() {

        var scoreMatrix = {
            A: {A: 10, C: -1, G: -3, T: -4},
            C: {A: -1, C: 7, G: -5, T: -3},
            G: {A: -3, C: -5, G: 9, T: 0},
            T: {A: -4, C: -3, G: 0, T: 8}
        };

        return {
            // default values
            baseSequences: [
                "GAGGAAGTAAACTGCTATTC",
                "GTCGCCGATGGTGGTAACTA",
                "ATTATGTTCCTTGCCACTAC",
                "AATTGTATCTAAGCCGTGTA",
                "ATGAGAACATCCACACCTTA",
                "GTGAATCGATGCGCCGCTTC",
                "GGAATACCGTTTTGGCTACC",
                "TGTTACTAAGCCCATCGCGA",
                "TTTTCAGGTATCGTGCACGT",
                "AGGGTTGCACCGCACGCATG"
            ],
            querySequence: "TCGAACTGGTGGCGAAGTAC",
            kTup: 2,
            scoreMatrix: scoreMatrix,
            gapPenalty: -5,
            maxDistance: 1,
            secondStage: {},
            thirdStage: {},
            fourthStage: {},
            started: false
        };
    }
})();
(function () {
    angular
        .module('fastaView')
        .factory('CurrentStageService', currentStageService);

    function currentStageService() {
        return {
            currentStage: 0
        };
    }
})();

(function () {
    angular
        .module('fastaView')
        .directive('fastaHighlight', ['$document', '$compile', fastaHighlight]);

    /**
     * Directive for highlighting part of sequences paragraphs on mouseover.
     * Used on almost all pages, i.e. to show which parts of sequences are contained in diagonal.
     *
     * To use it one has to pass highlightParagraphsList array as tag attribute.
     * It has to be an array of objects like below:
     *      {
     *          startIndex: start index where to start highlight in paragraph,
     *          length: length of highlight from start,
     *          content: original content of paragraph,
     *          paragraphId: ID of paragraph from HTML
     *      }
     */
    function fastaHighlight($document) {
        return {
            restrict: 'A',
            scope: {
                highlightParagraphsList: '='
            },
            link: link
        };

        function link(scope, element) {
            initialize();

            function initialize() {
                initializeScopeFunctions();

                element.bind('mouseover', highlightPartOfParagraphs);
                element.bind('mouseleave', highlightOff);

                element.on('$destroy', function() {
                    element.off('mouseover mouseleave');
                })
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

(function () {
    angular
        .module('fastaView')
        .directive('fastaDiagonalsTable', [diagonalsTable]);

    /**
     * Directive to insert diagonals table.
     * It doesn't have isolated scope, so to be able to use it,
     * parent scope (controller) has to contain some necessary data (see HTML file for names).
     *
     * It was necessary to do i t like this to be able to easily call methods provided by this directive in controller.
     */
    function diagonalsTable() {
        return {
            scope: false,
            link: link,
            replace: true,
            templateUrl: 'view/shared/diagonalsTable/fasta-diagonals-table.html'
        };

        function link(scope, element) {

            var currentHighlightedCells;

            initialize();

            function initialize() {
                initializeScopeFunctions();

                element.on('$destroy', clearDiagonalsTable);
            }

            function initializeScopeFunctions() {
                scope.drawDiagonalsTable = drawDiagonalsTable;
                scope.clearDiagonalsTable = clearDiagonalsTable;
                scope.highlightDiagonal = highlightDiagonal;
                scope.clearHighlight = clearHighlight;
                scope.drawDiagonalsPath = drawDiagonalsPath;
            }

            function drawDiagonalsTable(diagonals) {
                for (var i = 0; i < diagonals.length; ++i) {
                    drawDiagonal(diagonals[i], true);
                }
            }

            function drawDiagonal(diagonal, withScore) {
                var startPoint = diagonal.startPoint,
                    endPoint = diagonal.endPoint,
                    diagonalClassName = "diagonal-" + startPoint[0] + "-" + startPoint[1],
                    score = withScore ? diagonal.score : undefined; //name is necessary to group cells in one diagonal - by css class

                for (var x = startPoint[0], y = startPoint[1]; x <= endPoint[0] && y <= endPoint[1]; ++x, ++y) {
                    drawDiagonalCell(x, y, score, diagonalClassName);
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
                var cells = element.find('[class*="diagonal-"]');
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

            function clearHighlight() {
                if (currentHighlightedCells) {
                    currentHighlightedCells.removeClass('highlight-on-click');
                    currentHighlightedCells = undefined;
                }
            }

            function drawDiagonalsPath(path) {
                for (var i = 0; i < path.diagonals.length; ++i) {
                    drawDiagonal(path.diagonals[i], false);
                }
            }

            function makeRemoveClassHandler(regex) {
                return function (index, classes) {
                    return classes.split(/\s+/).filter(function (el) {
                        return regex.test(el);
                    }).join(' ');
                }
            }

        }
    }
})();
(function () {
    angular.
        module('fastaView').
        directive('fastaMenu', ['$location', 'CurrentStageService', menu]);

    /**
     * Directive for top menu.
     */
    function menu($location, CurrentStageService) {
        return {
            restrict: 'A',
            link: link,
            scope: {},
            templateUrl: 'view/shared/menu/fasta-menu.html'
        };

        function link(scope) {
            initialize();

            function initialize() {
                initializeScopeFunctions();
            }

            function initializeScopeFunctions() {
                scope.menuSelected = menuSelected;
                scope.getCurrentStage = getCurrentStage;
            }

            function menuSelected(selected) {
                return $location.path() === selected;
            }

            function getCurrentStage() {
                return CurrentStageService.currentStage;
            }
        }
    }
})();

(function () {
    angular.
        module('fastaView').
        directive('fastaNavigationFooter', ['$location', 'CurrentStageService', navigationFooter]);

    /**
     * Directive for footer fixed navigation. Allows to unify actions taken on each stage for making next/previous steps/stages.
     *
     * Allows to "Finish Stage" by doing all steps at once.
     * When going to previous stage, function callback from controller is called that should clear stage data
     *
     * Many attributes are necessary to provide:
     *      - previousUrl - url to go when previous stage button is clicked
     *      - nextUrl (optional) - url to go when next stage button is clicked
     *      - saveStep - callback function to remember last performed step - necessary to restore state on controller
     *      - nextStageNumber (optional) - number of next stage, necessary to set globally current stage
     *      - currentStep - currently performed step - necessary to properly restore state after manually switching stage
     *      - config - array containing object for steps definition.
     *          First element should be "initial" step with description property and reverse function as property to clear data after doing "Previous Stage" action
     *          Rest should be as follows:
     *          {
     *              description: short description of step,
     *              action: function callback to be called when "next step" is done,
     *              reverse: function callback to be called when "previous step" is done
     *          }
     */
    function navigationFooter($location, CurrentStageService) {
        return {
            restrict: 'A',
            scope: {
                previousUrl: '@',
                nextUrl: '@',
                saveStep: '&',
                config: '=',
                nextStageNumber: '=',
                currentStep: '='
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
                scope.currentStep = scope.currentStep || 0;
                scope.description = scope.config[scope.currentStep].description;
                scope.disabledStepButton = false;
            }

            function initializeScopeFunctions() {
                scope.nextStep = nextStep;
                scope.previousStep = previousStep;
                scope.isLastStep = isLastStep;
                scope.isFirstStep = isFirstStep;
                scope.isLastStage = isLastStage;
                scope.nextStage = nextStage;
                scope.previousStage = previousStage;
            }

            function nextStep() {
                var promise;

                scope.disabledStepButton = true;
                ++scope.currentStep;

                scope.description = scope.config[scope.currentStep].description;
                promise = scope.config[scope.currentStep].action();
                return promise.then(function () {
                    scope.saveStep({lastStep: scope.currentStep});
                    scope.disabledStepButton = false;
                });
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
                    CurrentStageService.currentStage = scope.nextStageNumber;
                    $location.url(scope.nextUrl);
                } else {
                    finishStage();
                }
            }

            function finishStage() {
                if (!isLastStep()) {
                    nextStep().then(function () {
                        finishStage();
                    });
                }
            }

            function previousStage() {
                scope.currentStep = 0;
                scope.saveStep({lastStep: scope.currentStep});
                CurrentStageService.currentStage -= 1;
                scope.config[0].reverse();
            }
        }
    }
})();

(function () {
    angular.
        module('fastaView').
        directive('fastaSelectedSequences', [selectedSequences]);

    /**
     * Directive to be used as common for displaying sequences selected for next stage
     */
    function selectedSequences() {
        return {
            restrict: 'A',
            scope: {
                bestSequences: '='
            },
            link: link,
            templateUrl: 'view/shared/selectedSequences/fasta-selected-sequences.html'
        };

        function link() {
        }
    }
})();

(function () {
    angular.
        module('fastaView').
        directive('fastaSequenceValidator', [sequenceValidator]);

    /**
     * Directive for validating that only proper symbols are entered for inputs containing DNA sequences
     */
    function sequenceValidator() {
        return {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };

        function link(scope, element, attrs, ngModel) {
            var possibleCharacters = attrs.fastaSequenceValidator || ['A', 'C', 'T', 'G'];

            initialize();

            function initialize() {
                element.on('keypress', function(event) {
                    var pressed = String.fromCharCode(event.which),
                        pressedUpper = pressed.toUpperCase();
                    event.preventDefault();
                    if (possibleCharacters.indexOf(pressedUpper) !== -1) {
                        ngModel.$setViewValue(ngModel.$viewValue + pressedUpper);
                        ngModel.$render();
                    }
                });
            }
        }
    }
})();
(function () {
    angular.
        module('fastaView').
        directive('fastaSequencesTabs', [sequencesTabs]);

    /**
     * Directive to be used as common for displaying sequences available at current stage
     *
     * changeSequence - callback to change sequence on controller
     */
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

        function link(scope) {
            initialize();

            function initialize() {
                initializeScopeVariables();
                initializeScopeFunctions();
            }

            function initializeScopeVariables() {
                scope.selected = scope.sequences[0];
            }

            function initializeScopeFunctions() {
                scope.select = select;
            }

            function select(index) {
                scope.selected = scope.sequences[index];
                scope.changeSequence({index: index});
            }
        }
    }
})();

(function () {
    angular
        .module('fastaView')
        .directive('fastaSmithWatermanTable', [smithWatermanTable]);

    /**
     * Directive to insert Smith-Waterman Matrix.
     * It doesn't have isolated scope, so to be able to use it,
     * parent scope (controller) has to contain some necessary data (see HTML file for names).
     *
     * It was necessary to do it like this to be able to easily call methods provided by this directive in controller.
     */
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
                for (var i = 0; i < solutions.length; i++) {
                    solution = solutions[i];
                    for (var j = 0; j < solution.path.length; j++) {
                        highlightCell(solution.path[j]);
                    }
                }
            }

            function highlightCell(cellIndices) {
                var name = cellIndices[0] + '_' + cellIndices[1],
                    cell = element.find('[name="' + name + '"]');
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
    .controller('ConfigController', ['$scope', '$window', '$location', 'ConfigurationService', 'CurrentStageService', ConfigController]);

    function ConfigController($scope, $window, $location, ConfigurationService, CurrentStageService){

        initialize();

        function initialize() {

            initializeScopeVariables();
            initializeScopeFunctions();
        }

        function initializeScopeVariables() {
            $scope.configData = {};
            $scope.configData.baseSequences = angular.copy(ConfigurationService.baseSequences);
            $scope.configData.querySequence = ConfigurationService.querySequence;
            $scope.configData.kTup = ConfigurationService.kTup;
            $scope.configData.scoreMatrix = ConfigurationService.scoreMatrix;
            $scope.configData.gapPenalty = ConfigurationService.gapPenalty;
            $scope.configData.maxDistance = ConfigurationService.maxDistance;

            $scope.configData.newSequence = '';

            $scope.configData.emptyNewSequence = false;
            $scope.configData.formError = false;
            $scope.configData.errors = [];

            $scope.configData.started = ConfigurationService.started;
        }

        function initializeScopeFunctions() {
            $scope.saveAndContinue = saveAndContinue;
            $scope.removeBaseSequence = removeBaseSequence;
            $scope.addBaseSequence = addBaseSequence;
            $scope.restart = restart;
        }

        function saveAndContinue(){
            $scope.configData.errors = validateFields();

            if ($scope.configData.errors.length > 0) {
                return;
            }

            ConfigurationService.baseSequences = $scope.configData.baseSequences;
            ConfigurationService.querySequence = $scope.configData.querySequence;
            ConfigurationService.kTup = $scope.configData.kTup;
            ConfigurationService.scoreMatrix = $scope.configData.scoreMatrix;
            ConfigurationService.gapPenalty = $scope.configData.gapPenalty;
            ConfigurationService.maxDistance = $scope.configData.maxDistance;

            CurrentStageService.currentStage = 1;
            ConfigurationService.started = true;

            $location.path("/first_stage");
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

        function restart() {
            $window.location.reload();
        }

        function validateFields() {
            var errors = [];

            if ($scope.configData.baseSequences.length === 0) {
                errors.push('Baza danych sekwencji nie może być pusta');
            }
            if (!$scope.configData.querySequence) {
                errors.push('Szukana sekwencja nie może być pusta');
            }
            if (isUndefinedOrNull($scope.configData.kTup) || isNaN($scope.configData.kTup) || ($scope.configData.kTup < 2 && $scope.configData.kTup > 6)) {
                errors.push('Parametr ktup musi mieć wartość pomiędzy 2 i 6');
            }
            if (isUndefinedOrNull($scope.configData.gapPenalty) || isNaN($scope.configData.gapPenalty) || $scope.configData.gapPenalty > 0) {
                errors.push('Kara za przerwę musi być liczbą mniejszą od 0');
            }
            if (isUndefinedOrNull($scope.configData.maxDistance) || isNaN($scope.configData.maxDistance) || $scope.configData.maxDistance < 0) {
                errors.push('Maksymalna odległość połączenia musi być liczbą większą od 0');
            }
            if (anyMatrixCellNotValid()) {
                errors.push('Macierz substytucji musi być całkowicie wypełniona liczbami');
            }

            return errors;
        }

        function anyMatrixCellNotValid() {
            for (var rowKey in $scope.configData.scoreMatrix) {
                var row = $scope.configData.scoreMatrix[rowKey];

                for (var cellKey in row) {
                    if (isUndefinedOrNull(row[cellKey]) || isNaN(row[cellKey])) {
                        return true;
                    }
                }
            }
            return false;
        }

        function isUndefinedOrNull(val) {
            return val === undefined || val === null;
        }
    }
})();

(function () {
    angular
        .module('fastaView')
        .controller('FirstController', ['$scope', 'ConfigurationService', 'FirstDataService', FirstController]);

    function FirstController($scope, ConfigurationService, FirstDataService) {

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
            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[0];

            restoreState();
            initializeStepsConfig();
        }

        function initializeScopeFunctions() {
            $scope.saveLastStep = saveLastStep;
            $scope.changeSequence = changeSequence;
        }

        function saveLastStep(lastStep) {
            FirstDataService.lastStep = lastStep;
        }

        function changeSequence(index) {
            $scope.stepData.currentBaseSequence = $scope.stepData.baseSequences[index];
        }

        function restoreState() {
            $scope.stepData.currentStep = FirstDataService.lastStep || 0;
            $scope.stepData.baseSequencesIndices = FirstDataService.baseSequencesIndices;
            $scope.stepData.querySequenceIndices = FirstDataService.querySequenceIndices;
            $scope.stepData.hotSpots = FirstDataService.hotSpots;
            $scope.stepData.bestSequences = ConfigurationService.secondStage.baseSequences;
        }

        function initializeStepsConfig() {
            $scope.stepData.stepByStepConfig = [
                {
                    description: 'Etap 1 - rozpoczęcie',
                    reverse: clearStageData
                },
                {
                    description: "Wyliczenie tablicy indeksującej dla szukanej sekwencji",
                    action: getQuerySequenceIndices,
                    reverse: reverseQueryIndices
                },
                {
                    description: "Wyliczenie tablic indeksujących dla wszystkich sekwencji z bazy danych",
                    action: getBaseSequencesIndices,
                    reverse: reverseBaseIndices
                },
                {description: "Znalezienie gorących miejsc", action: getHotSpots, reverse: reverseHotSpots},
                {
                    description: "Wybranie najlepszych sekwencji do następnego etapu",
                    action: getBestBaseSequences,
                    reverse: reverseBestBaseSequences
                }
            ];
        }

        function getBaseSequencesIndices() {
            return FirstDataService.getMultipleSequenceIndices($scope.stepData.baseSequences, $scope.stepData.kTup).then(function (data) {
                FirstDataService.baseSequencesIndices = data;
                $scope.stepData.baseSequencesIndices = data;
            });
        }

        function getQuerySequenceIndices() {
            return FirstDataService.getSequenceIndices($scope.stepData.querySequence, $scope.stepData.kTup).then(function (data) {
                FirstDataService.querySequenceIndices = data;
                $scope.stepData.querySequenceIndices = data;
            });
        }

        function getHotSpots() {
            return FirstDataService.getHotSpots($scope.stepData.baseSequencesIndices, $scope.stepData.querySequenceIndices).then(function (data) {
                FirstDataService.hotSpots = data;
                $scope.stepData.hotSpots = data;
            });
        }

        function getBestBaseSequences() {
            return FirstDataService.getHotSpotsForBestSequences($scope.stepData.hotSpots).then(function (bestHotSpots) {
                ConfigurationService.secondStage.baseSequences = Object.keys(bestHotSpots);
                ConfigurationService.secondStage.hotSpots = bestHotSpots;
                $scope.stepData.bestSequences = Object.keys(bestHotSpots);
            });
        }

        function clearStageData() {
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
    }
})();

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

            restoreState();
            refreshSWMatrix();
            initializeStepsConfig();
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
                refreshSWMatrix();
            }
        }

        function isPartOfAlignment(alignmentIndex, charIndex) {
            return $scope.stepData.alignments && (charIndex >= $scope.stepData.alignments[$scope.stepData.currentBaseSequence][alignmentIndex].baseHighlight[0] &&
                charIndex <= $scope.stepData.alignments[$scope.stepData.currentBaseSequence][alignmentIndex].baseHighlight[1]);
        }

        function saveLastStep(lastStep) {
            FourthDataService.lastStep = lastStep;
        }

        function restoreState() {
            $scope.stepData.smithWatermanMatrices = FourthDataService.matrices;
            $scope.stepData.smithWatermanSolutions = FourthDataService.solutions;
            $scope.stepData.alignments = FourthDataService.alignments;
            $scope.stepData.bestSequence = FourthDataService.bestSequence;

            $scope.stepData.currentStep = FourthDataService.lastStep || 0;
        }

        function initializeStepsConfig() {
            $scope.stepData.stepByStepConfig = [
                {
                    description: 'Etap 4 - początek',
                    reverse: clearStageData
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
                refreshSWMatrix();
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

        function clearStageData() {
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

        function refreshSWMatrix() {
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
