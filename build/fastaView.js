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
            A: {A:1, C:-1, G:-1, T:-1},
            C: {A:-1, C:1, G:-1, T:-1},
            G: {A:-1, C:-1, G:1, T:-1},
            T: {A:-1, C:-1, G:-1, T:1}
        };

        return {
            // default values
            baseSequence: "AACACTTTTCA",
            querySequence: "ACTTATCA",
            kTup: 2,
            scoreMatrix: scoreMatrix,
            gapPenalty: -5
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

            initialize();

            function initialize() {
                initializeScopeFunctions();
            }

            function initializeScopeFunctions() {
                scope.drawDiagonalsTable = drawDiagonalsTable;
                scope.drawDiagonal = drawDiagonal;
                scope.eraseDiagonal = eraseDiagonal;
                scope.clearDiagonalsTable = clearDiagonalsTable;
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
                cell.attr('title', 'score: ' + score);
                cell.addClass(diagonalClassName);
                cell.tooltip();

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

            function eraseDiagonal(tableId, diagonal) {
                var diagonalClassName = "diagonal-" + diagonal.startPoint[0] + "-" + diagonal.startPoint[1]; //name is necessary to group cells in one diagonal - by css class

                $.each($('#' + tableId + ' .' + diagonalClassName), function () {
                    $(this).empty();
                    $(this).removeAttr("title");
                    $(this).removeClass(diagonalClassName);
                    $(this).off('mouseenter mouseleave');
                });
            }


        }
    }
})();
(function () {
    angular
        .module('fastaView')
        .directive('fastaHighlight', [fastaHighlight]);

    function fastaHighlight() {
        return {
            restrict: 'A',
            scope: {
                paragraphId: '@',
                content: '=',
                startIndex: '=',
                length: '='
            },
            transclude: true,
            link: link,
            template: '<div ng-mouseover="highlightPartOfParagraph()" ng-mouseleave="highlightOff()"><ng-transclude ></ng-transclude></div>'
        };

        function link(scope) {

            var index = parseInt(scope.startIndex),
                length = parseInt(scope.length);

            initialize();

            function initialize() {
                initializeScopeFunctions();
            }

            function initializeScopeFunctions() {
                scope.highlightPartOfParagraph = highlightPartOfParagraph;
                scope.highlightOff = highlightOff;
            }

            function highlightPartOfParagraph() {
                var prefix, suffix, highlightedPart;

                prefix = scope.content.slice(0, index);
                highlightedPart = scope.content.slice(index, index + length);
                suffix = scope.content.slice(index + length);

                $('#' + scope.paragraphId).html(prefix + '<span class="highlight">' + highlightedPart + '</span>' + suffix);
            }

            function highlightOff() {
                $('#' + scope.paragraphId).html(scope.content);
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
                console.log(scope);
                scope.currentStep = scope.lastStep;
                scope.description = scope.config[scope.currentStep].description;
            }

            function initializeScopeFunctions() {
                scope.nextStep = nextStep;
                scope.previousStep = previousStep;
                scope.isLastStep = isLastStep;
                scope.isFirstStep = isFirstStep;

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
            $scope.configData.baseSequence = ConfigurationService.baseSequence;
            $scope.configData.querySequence = ConfigurationService.querySequence;
            $scope.configData.kTup = ConfigurationService.kTup;
            $scope.configData.scoreMatrix = ConfigurationService.scoreMatrix;
            $scope.configData.gapPenalty = ConfigurationService.gapPenalty;
        }

        function initializeScopeFunctions() {
            $scope.save = save;
        }

        function save(){
            ConfigurationService.baseSequence = $scope.configData.baseSequence;
            ConfigurationService.querySequence = $scope.configData.querySequence;
            ConfigurationService.kTup = $scope.configData.kTup;
            ConfigurationService.scoreMatrix = $scope.configData.scoreMatrix;
            ConfigurationService.gapPenalty = $scope.configData.gapPenalty;
        }
    }
})();

(function () {
    angular
        .module('fastaView')
        .controller('FirstController', ['$scope', '$q', 'ConfigurationService', 'FirstDataService', FirstController]);

    function FirstController($scope, $q, ConfigurationService, FirstDataService) {

        var sequencePromise, basePromise;

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
            $scope.stepData.baseSequenceIndices = FirstDataService.baseSequenceIndices;
            $scope.stepData.lastStep = FirstDataService.lastStep || 0;
            $scope.stepData.querySequenceIndices = FirstDataService.querySequenceIndices;
            $scope.stepData.hotSpots = ConfigurationService.hotSpots;

            $scope.stepData.stepByStepConfig = [
                {description: 'Stage 1 - beginning'},
                {
                    description: "calculating indices for base sequence",
                    action: baseIndicesStep,
                    reverse: reverseBaseIndices
                },
                {
                    description: "calculating indices for query sequence",
                    action: queryIndicesStep,
                    reverse: reverseQueryIndices
                },
                {description: "calculating hot spots", action: hotSpotsStep, reverse: reverseHotSpots}
            ];
        }

        function initializeScopeFunctions() {
            $scope.saveLastStep = saveLastStep;
        }

        function baseIndicesStep() {
            if (!basePromise) {
                basePromise = FirstDataService.getSequenceIndices($scope.stepData.baseSequence, $scope.stepData.kTup);
            }
            basePromise.then(function (data) {
                FirstDataService.baseSequenceIndices = data;
                $scope.stepData.baseSequenceIndices = data;
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
            $q.all([sequencePromise, basePromise]).then(function () {
                FirstDataService.getHotSpots($scope.stepData.baseSequenceIndices, $scope.stepData.querySequenceIndices).then(function (data) {
                    ConfigurationService.hotSpots = data;
                    $scope.stepData.hotSpots = data;
                });
            });
        }

        function reverseBaseIndices() {
            $scope.stepData.baseSequenceIndices = undefined;
        }

        function reverseQueryIndices() {
            $scope.stepData.querySequenceIndices = undefined;
        }

        function reverseHotSpots() {
            ConfigurationService.hotSpots = undefined;
            $scope.stepData.hotSpots = undefined;
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
            getHotSpots: getHotSpots
        };

        function getSequenceIndices(sequence, ktup) {
            var deferred = $q.defer();

            $timeout(function() {
                var indices = new fasta.IndexingArray(sequence, ktup);
                deferred.resolve(indices);
            });

            return deferred.promise;
        }

        function getHotSpots(baseIndices, queryIndices) {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(fasta.findHotspots(queryIndices, baseIndices));
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

(function () {
    angular
        .module('fastaView')
        .factory('SecondDataService', ['$q', '$timeout', SecondDataService]);

    function SecondDataService($q, $timeout) {

        return {
            getDiagonals: getDiagonals,
            score: score
        };

        function getDiagonals(hotSpots, ktup, maxGapLength) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(fasta.findDiagonals(hotSpots, ktup, maxGapLength));
            });

            return deferred.promise;
        }

        function score(diagonals, scoreMatrix, baseSequence, querySequence) {
            var deferred = $q.defer();

            console.log(scoreMatrix);

            $timeout(function () {
                deferred.resolve(fasta.scoreDiagonals(diagonals, scoreMatrix, baseSequence, querySequence));
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
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequence = ConfigurationService.baseSequence;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            $scope.stepData.diagonals = ThirdDataService.diagonals;
            $scope.stepData.substitutionMat = "BLOSSUM";
        }

        //angular.element(document).ready(function () {
        //    DiagonalsService.drawDiagonalsTable('diagonals-table', $scope.diagonals);
        //});
    }
})();

(function(){
    angular
    .module('fastaView')
    .factory('ThirdDataService', [ThirdDataService]);

function ThirdDataService(){
    return {
        diagonals: [
            new Diagonal([0,0], [4,4], 5),
            new Diagonal([2,4], [4,6], 12),
            new Diagonal([5,7], [7,9], -7),
            new Diagonal([8,18], [12,22], 2),
            new Diagonal([1,22], [4,26], 92),
            new Diagonal([4,17], [6,19], 110)
        ]
    };
}
})();

