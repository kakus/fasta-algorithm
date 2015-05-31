(function () {
    angular
        .module('fastaView')
        .directive('fastaHighlight', ['$document', fastaHighlight]);

    function fastaHighlight($document) {
        return {
            restrict: 'A',
            scope: {
                highlightParagraphsList: '='
                //paragraphId: '@',
                //content: '=',
                //startIndex: '=',
                //length: '='
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
