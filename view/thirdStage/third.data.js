(function(){
    angular
    .module('fastaView')
    .factory('ThirdDataService', [ThirdDataService]);

function ThirdDataService(){
    return {
        diagonals: [
            new Diagonal([0,0], [4,4], 5),
            new Diagonal([2,4], [4,6], 12),
            new Diagonal([5,7], [7,9], -7),
            new Diagonal([8,18], [12,22], 2),
            new Diagonal([1,22], [4,26], 92),
            new Diagonal([4,17], [6,19], 110)
        ]
    };
}
})();

