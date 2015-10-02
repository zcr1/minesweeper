(function (){
    'use strict';

    function GameController($scope, GameService){
        this.gameService = GameService;
        this.grid = this.gameService.grid;

        this.clickSquare = function(square){
            // User clicked square
            if (!this.gameService.gameOver && square){
                var val = this.gameService.getSquareValue(square);
                if (val === -1){
                    setTimeout(function(){
                        alert('Game Over Chum');
                    }, 100)
                }
            }
        };

        this.newGame = function(){
            // Start a new game
            this.gameService.newGame();
            this.grid = this.gameService.grid;
        };

    }

    GameController.$inject = ['$scope', 'GameService'];

    angular
    .module('minesweeper')
    .controller('GameController', GameController);
})();
