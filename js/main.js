// Chip 8 Emulator
"use strict";

$(function(){
	var rows = 8,
		cols = 8,
		numMines = 10;

	var sweeper = new Sweeper(rows, cols, numMines);
	sweeper.init();
	sweeper.generate();

	drawGrid(sweeper, rows, cols);

	mouseEvents(sweeper);
	clickEvents(sweeper);
});

// Set up all the onClick events of various DOM elements
function clickEvents(sweeper){
	var $numMines = $("#numMines"),
		total = 0;

	$("#newGame").click(function(){
		sweeper.newGame();
		drawGrid(sweeper, sweeper.getRows(), sweeper.getCols());
		mouseEvents(sweeper);
		$numMines.html(sweeper.numMines);
		$("html").height(sweeper.size[1] * 25 + 400 + "px");
	});

	$("#cheat").click(function(){
		var mines = sweeper.getMines();

		for (var i = 0; i < mines.length; i++){
			var $curr = $("td[data-row='" + mines[i].getRow() +
						  "'][data-col='" + mines[i].getCol() + "']");

			$curr.removeClass();
			$curr.addClass("tile cheat");
		}
	});

	$("#addMine").click(function(){
		total = sweeper.addMine(1);
		$numMines.html(total);
	});

	$("#subMine").click(function(){
		total = sweeper.addMine(-1);
		$numMines.html(total);
	});

	var $dimensions = $("#dimensions"),
		size = [];

	$("#increaseSize").click(function(){
		size = sweeper.updateSize(1);
		$dimensions.html("[" + size[0] + "," + size[1] + "]");
	});

	$("#decreaseSize").click(function(){
		size = sweeper.updateSize(-1);
		$dimensions.html("[" + size[0] + "," + size[1] + "]");
	});	
}

// Place the table grid inside the container
function drawGrid(sweeper, rows, cols){
	var $container = $("#game");

	var table = "<table id='grid'>";

	for (var i = 0; i < rows; i++){
		table += "<tr>";

		for (var j = 0; j < cols; j++){
			table += "<td class='covered tile' data-row='" + i + "' data-col='" + j +
						 "'></td>";
		}

		table += "</tr>";
	}

	table += "</table>";
	$container.html(table);

	$("#container").width(rows * 25 + 50 + "px");
}

// Set up left and right click events for each tile in game
function mouseEvents(sweeper){
	$("#grid td").each(function(){
		$(this).mousedown(function(event){

			if (!sweeper.gameOver){
				if (event.which === 1){ // left

					$(this).removeClass();
					$(this).addClass("tile uncovered");

					var val = sweeper.get($(this).data("row"), $(this).data("col"));

					if (val >= 0){
						if (val > 0){
							$(this).html(val);
						}

						var goal = sweeper.goalCheck();
						if (goal) alert("Congratulations on your noble victory.");
					}
					else if (val === -1){
						$(this).html("<div class='mine'></div>");
						alert("You lost");
					}
				}

				else if (event.which === 3){ //right

					if ($(this).hasClass("flag")){
						$(this).removeClass("flag");
						$(this).html('');
					}
					else if ($(this).hasClass("covered")){
						$(this).addClass("flag");
						$(this).html('x');
					}
				}
			}
		});
	});
}

// Disable context menu if click is within game field
$(document).bind("contextmenu", function(event){
	var $grid = $("#grid"),
	left = $grid.position().left,
	top = $grid.position().top;

	if (event.pageX > left && event.pageX < (left + $grid.width())){
		if (event.pageY > top && event.pageY < (top + $grid.height())){
			return false;
		}
	}
});

//Returns a copy of array
Array.prototype.copy = function() {
	return this.slice(0);
};