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
