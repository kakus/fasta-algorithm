(function () {
    angular
        .module('fastaView')
        .factory('CurrentStageService', currentStageService);

    function currentStageService() {
        return {
            currentStage: 0
        };
    }
})();
