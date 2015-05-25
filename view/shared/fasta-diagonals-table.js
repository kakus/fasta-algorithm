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