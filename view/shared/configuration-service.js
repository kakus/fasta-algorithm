(function () {
    angular
        .module('fastaView')
        .factory('ConfigurationService', configurationService);

    function configurationService() {

        var scoreMatrix = {
            A: {A: 10, C: -1, G: -3, T: -4},
            C: {A: -1, C: 7, G: -5, T: -3},
            G: {A: -3, C: -5, G: 9, T: 0},
            T: {A: -4, C: -3, G: 0, T: 8}
        };

        return {
            // default values
            baseSequences: [
                "GAGGAAGTAAACTGCTATTC",
                "GTCGCCGATGGTGGTAACTA",
                "ATTATGTTCCTTGCCACTAC",
                "AATTGTATCTAAGCCGTGTA",
                "ATGAGAACATCCACACCTTA",
                "GTGAATCGATGCGCCGCTTC",
                "GGAATACCGTTTTGGCTACC",
                "TGTTACTAAGCCCATCGCGA",
                "TTTTCAGGTATCGTGCACGT",
                "AGGGTTGCACCGCACGCATG"
            ],
            querySequence: "TCGAACTGGTGGCGAAGTAC",
            kTup: 2,
            scoreMatrix: scoreMatrix,
            gapPenalty: -5,
            maxDistance: 1,
            secondStage: {},
            thirdStage: {},
            fourthStage: {},
            started: false
        };
    }
})();