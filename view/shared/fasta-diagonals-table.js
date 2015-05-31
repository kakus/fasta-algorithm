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