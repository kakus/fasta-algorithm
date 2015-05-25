(function () {
    angular
        .module('fastaView')
        .factory('ConfigurationService', configurationService);

    function configurationService() {
        return {
            // default values
            baseSequence: "MYBASESEQUENCE",
            querySequence: "MYQUERYSEQUENCE",
            kTup: 2
        };
    }
})();