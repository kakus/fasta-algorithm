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