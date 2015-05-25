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
        return {
            // default values
            baseSequence: "MYBASESEQUENCE",
            querySequence: "MYQUERYSEQUENCE",
            kTup: 2
        };
    }
})();
(function () {
    angular
        .module('fastaView')
        .directive('fastaDiagonalsTable', ['$timeout', diagonalsTable]);

    function diagonalsTable($timeout) {
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

            //$timeout(function () {
            //    drawDiagonalsTable(scope.stepData.diagonals);
            //});

            //var callback = scope.$watch('stepData.diagonals', function() {
            //    if (scope.stepData.diagonals) {
            //        callback();
            //        drawDiagonalsTable(scope.stepData.diagonals);
            //    }
            //});

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

            function clearDiagonalsTable(tableId) {
                $.each($('#diagonals-table [class*="diagonal"]'), function () {
                    $(this).empty();
                    $(this).removeAttr("title");
                    $(this).removeClass(makeRemoveClassHandler(/^diagonal/));
                    $(this).off('mouseenter mouseleave');
                });
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
        directive('fastaNavigationFooter', [navigationFooter]);

    function navigationFooter() {
        return {
            restrict: 'A',
            scope: {
                previousUrl: '@',
                nextUrl: '@'
            },
            link: link,
            templateUrl: 'view/shared/navigationFooter/fasta-navigation-footer.html'
        };

        function link() {
            initialize();

            function initialize() {

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
        }

        function initializeScopeFunctions() {
            $scope.save = save;
        }

        //TODO: instead of saving - bind already to ConfigurationService
        function save(){
            ConfigurationService.baseSequence = $scope.configData.baseSequence;
            ConfigurationService.querySequence = $scope.configData.querySequence;
            ConfigurationService.kTup = $scope.configData.kTup;
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
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequence = ConfigurationService.baseSequence;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            FirstDataService.getBaseSequenceIndices().then(function(data) {
                $scope.stepData.baseSequenceIndices = data;
            });
            FirstDataService.getQuerySequenceIndices().then(function(data) {
                $scope.stepData.querySequenceIndices = data;
            });

            FirstDataService.getHotSpots().then(function(data) {
                $scope.stepData.hotSpots = data;
            });
        }
    }
})();

(function () {
    angular
        .module('fastaView')
        .factory('FirstDataService', ['$q', '$timeout', firstDataService]);

    function firstDataService($q, $timeout) {
        var baseSequence = {
            'GACACC': [1, 3],
            'ACACCA': [13],
            'CACCAT': [5, 7, 4],
            'ACCATC': [10, 6],
            'GAATGG': [0, 16],
            'AATGGC': [18],
            'CCTTTC': [22, 17, 14],
            'CGCGGT': [26, 28]
            },
            querySequence = {
            'GACACC': [1, 2],
                'ACACCA': [13],
                'CACCAT': [5, 7, 4],
                'ACCATC': [10, 6],
                'GAATGG': [0, 16],
                'AATGGC': [18],
                'CCTTTC': [22, 17, 14],
                'CGCGGT': [26, 28]
            },
            hotSpots = {
            'GACACC': [],
                'ACACCA': [1],
                'CACCAT': [-5, 7, 4],
                'ACCATC': [10, -6],
                'GAATGG': [],
                'AATGGC': [18],
                'CGCGGT': [26, 28]
        };

        return {
            getBaseSequenceIndices: getBaseSequenceIndices,
            getQuerySequenceIndices: getQuerySequenceIndices,
            getHotSpots: getHotSpots
        };

        function getBaseSequenceIndices(sequence) {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(baseSequence);
            });

            return deferred.promise;
        }

        function getQuerySequenceIndices(sequence) {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(querySequence);
            });

            return deferred.promise;
        }

        function getHotSpots(baseSequence, querySequence) {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(hotSpots);
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
        }

        function initializeScopeVariables() {
            $scope.stepData = {};
            $scope.stepData.kTup = ConfigurationService.kTup;
            $scope.stepData.baseSequence = ConfigurationService.baseSequence;
            $scope.stepData.querySequence = ConfigurationService.querySequence;
            SecondDataService.getDiagonals().then(function (diagonals) {
                $scope.stepData.diagonals = diagonals;

                //TODO: move to directive? one downside - naming of variables has to be specified
                var callback = $scope.$watch('drawDiagonalsTable', function () {
                    if ($scope.drawDiagonalsTable) {
                        callback();
                        $timeout(function () {
                            $scope.drawDiagonalsTable($scope.stepData.diagonals);
                        });

                    }
                })
            });
        }

        //angular.element(document).ready(function () {
        //    $scope.drawDiagonalsTable('diagonals-table', $scope.stepData.diagonals);
        //});
    }
})();

(function(){
    angular
    .module('fastaView')
    .factory('SecondDataService', ['$q', '$timeout', SecondDataService]);

function SecondDataService($q, $timeout){

    var diagonals = [
        new Diagonal([0,0], [4,4], 5),
        new Diagonal([2,4], [4,6], 12),
        new Diagonal([5,7], [7,9], -7),
        new Diagonal([8,18], [12,22], 2),
        new Diagonal([1,22], [4,26], 92),
        new Diagonal([4,17], [6,19], 110)
    ];

    return {
        getDiagonals: getDiagonals
    };

    function getDiagonals(hotSpots) {
        var deferred = $q.defer();

        $timeout(function() {
            deferred.resolve(diagonals);
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

