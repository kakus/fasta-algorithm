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
