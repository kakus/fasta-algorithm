(function () {
    angular
        .module('fastaView')
        .factory('ConfigurationService', configurationService);

    function configurationService() {

        var scoreMatrix = {
            A: {A:1, C:-1, G:-1, T:-1},
            C: {A:-1, C:1, G:-1, T:-1},
            G: {A:-1, C:-1, G:1, T:-1},
            T: {A:-1, C:-1, G:-1, T:1}
        };

        return {
            // default values
            baseSequences: [
                "AACACTTTTCA",
                "ACCTACTTTAC",
                "ATCATCTACTACT",
                "CTACTATCATCATCAT",
                "ACACATCATCACTCT",
                "ACTCTCTACTCATACT",
                "ACTCACTCATCTACT",
                "TACTCTTCCTCTATC",
                "CTAGCTGCTGAATCTTCA",
                "ACTCTCTTACGCTACATCGTAC"
            ],
            querySequence: "ACTTATCAACTCATTCCCA",
            kTup: 2,
            scoreMatrix: scoreMatrix,
            gapPenalty: -5,
            secondStage: {},
            thirdStage: {},
            fourthStage: {}
        };
    }
})();