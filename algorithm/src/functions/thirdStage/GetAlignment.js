var fasta;
(function (fasta) {

    function getAlignment(path, baseSequence, querySequence) {
        var diagonals = path.diagonals,
            previous = diagonals[0],
            baseAlignment = baseSequence.substring(previous.startPoint[0], previous.endPoint[0] + 1),
            queryAlignment = querySequence.substring(previous.startPoint[1], previous.endPoint[1] + 1);

        for (var i = 1; i < diagonals.length; i++) {
            var current = diagonals[i];
            baseAlignment += createBaseAlignment(current, previous, baseSequence);
            queryAlignment += createQueryAlignment(current, previous, querySequence);
            previous = current;
        }

        return new fasta.Alignment(baseAlignment, queryAlignment,  diagonals[0].startPoint[0], diagonals[0].startPoint[1]);
    }

    function createBaseAlignment(current, previous, baseSequence) {
        var baseAlignment = Array((current.startPoint[1] - previous.endPoint[1])).join('-'),
            additionalBase = 0;

        if (current.startPoint[0] === previous.endPoint[0]) {
            baseAlignment += '-';
            additionalBase = 1;
        } else {
            baseAlignment += baseSequence.substring(previous.endPoint[0] + 1, current.startPoint[0]);
        }
        baseAlignment += baseSequence.substring(current.startPoint[0] + additionalBase, current.endPoint[0] + 1);

        return baseAlignment;
    }

    function createQueryAlignment(current, previous, querySequence) {
        var queryAlignment = "",
            additionalQuery = 0;
        if (current.startPoint[1] !== previous.endPoint[1]) {
            queryAlignment += querySequence.substring(previous.endPoint[1] + 1, current.startPoint[1]);
        } else {
            queryAlignment += '-';
            additionalQuery = 1;
        }
        queryAlignment += Array((current.startPoint[0] - previous.endPoint[0])).join('-');
        queryAlignment += querySequence.substring(current.startPoint[1] + additionalQuery, current.endPoint[1] + 1);

        return queryAlignment;
    }

    fasta.getAlignment = getAlignment;
})(fasta = fasta || {});
