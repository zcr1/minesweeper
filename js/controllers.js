(function (){
    'use strict';

    function GameController($scope, GameService){
        this.gameService = GameService;
        this.grid = this.gameService.grid;

        this.clickSquare = function(row, col){
            // Square at [row, col] has been clicked by user
            if (!this.gameService.gameOver && row != undefined && col != undefined){
                var val = this.gameService.getSquareValue(row, col);
                if (val === -1){
                    setTimeout(function(){
                        alert('Game Over Chum');
                    }, 100)
                }
            }
        };

        this.newGame = function(){
            this.gameService.newGame();
            this.grid = this.gameService.grid;
        };

    }

    GameController.$inject = ['$scope', 'GameService'];

    angular
    .module('minesweeper')
    .controller('GameController', GameController);
})();
