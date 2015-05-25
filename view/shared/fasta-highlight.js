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
