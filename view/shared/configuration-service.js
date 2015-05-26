(function () {
    angular
        .module('fastaView')
        .factory('ConfigurationService', configurationService);

    function configurationService() {
        return {
            // default values
            baseSequence: "AACACTTTTCAAT",
            querySequence: "ACTTATCA",
            kTup: 2
        };
    }
})();