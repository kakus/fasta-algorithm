var fasta;
(function (fasta) {

    function getSWAlignmentsForEachSequence(solutionsBySequences, querySequence) {
        var alignments = {},
            sequence, solutions;
        for (sequence in solutionsBySequences) {
            solutions = solutionsBySequences[sequence];
            alignments[sequence] = getSWAlignments(solutions, sequence, querySequence);
        }

        return alignments;
    }

    function getSWAlignments(solutions, baseSequence, querySequence) {
        var alignments = [];
        for (var i = 0; i < solutions.length; i++) {
            alignments.push(getSWAlignment(solutions[i], baseSequence, querySequence));
        }
        return alignments;
    }

    function getSWAlignment(solution, baseSequence, querySequence) {
        var path = solution.path,
            current,
            previous = path[0],
            baseOffset = previous[0] - 1,
            queryOffset = previous[1] - 1,
            baseAlignment = baseSequence.substr(previous[0] - 1, 1),
            queryAlignment = querySequence.substr(previous[1] - 1, 1);

        for (var i = 1; i < path.length; i++) {
            current = path[i];
            if (current[0] === previous[0]) {
                baseAlignment += '-';
                queryAlignment += querySequence.substr(current[1] - 1, 1);
            } else if (current[1] === previous[1]) {
                baseAlignment += baseSequence.substr(current[0] - 1, 1);
                queryAlignment += '-';
            } else {
                baseAlignment += baseSequence.substr(current[0] - 1, 1);
                queryAlignment += querySequence.substr(current[1] - 1, 1);
            }
            previous = current;
        }

        return new fasta.Alignment(baseAlignment, queryAlignment, baseOffset, queryOffset);
    }

    fasta.getSWAlignmentsForEachSequence = getSWAlignmentsForEachSequence;
    fasta.getSWAlignments = getSWAlignments;
})(fasta = fasta || {});