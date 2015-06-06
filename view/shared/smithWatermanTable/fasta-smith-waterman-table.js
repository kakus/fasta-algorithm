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
