window.onload = function () {
	//initialize game here
	newGame();
}


function newGame()
{
	//initialize game here
	var game = new Game();
	game.updateScreen();
}


function engine()
{
	turn = -1;
	game.print();
}


function finishGame()
{
	console.log("Well done :)");
}






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Modal - Showing instructions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showInstructions()
{
	document.getElementById('myModal').style.display = "block";
}

function closeInstructions()
{
	document.getElementById('myModal').style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
        document.getElementById('myModal').style.display = "none";
    }
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Class Board
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Board
{
	constructor(_numRows)
	{
		//Set empty game board
		this.numRows = _numRows;
		this.matrix = new Array(this.numRows);
		for(var i=0; i<this.numRows; i++)
			this.matrix[i] = new Array(this.numRows);
		for(var i=0; i<this.numRows; i++)
		{
			for(var j=0; j<this.numRows; j++)
			{
				var num =  1+Math.floor(Math.random() * 5);
				this.matrix[i][j] = num;
			}
		}
	}

	setInitialPositions()
	{
		// initial position of player
		var xPlayer = Math.floor(Math.random() * this.numRows);
		var yPlayer = Math.floor(Math.random() * this.numRows);
		this.matrix[xPlayer][yPlayer] = -1;
		// initial position of bot
		var xBot = xPlayer;
		var yBot = yPlayer;
		while(xBot == xPlayer && yBot == yPlayer)
		{
			xBot = Math.floor(Math.random() * this.numRows);
			yBot = Math.floor(Math.random() * this.numRows);			
		}
		this.matrix[xBot][yBot] = -2;

		console.log(this.matrix);

		return [xPlayer, yPlayer, xBot, yBot];
	}

	// Prints board on screen
	// if value of a cell is -1, it means it is occupied by the player
	// if value of a cell is -2, it means it is occupied by the bot
	// if value of a cell is more than 0, it represents the number of apples present at that cell
	printBoard()
	{
		// console.log("printBoard called");
		for(var i=0; i<this.numRows; i++)
		{
			for(var j=0; j<this.numRows; j++)
			{
				var cell = document.getElementById(i.toString()+j.toString());
				// Filling values/numbers
				if(this.matrix[i][j] == -1)
					cell.innerHTML = "<img src=\"bird.jpeg\">";
				else if(this.matrix[i][j] == -2)
					cell.innerHTML = "<img src=\"pig.png\">";
				else if(this.matrix[i][j] == 0)
					cell.innerHTML = "";
				else
					cell.innerHTML = this.matrix[i][j];
			}
		}
	}

	findPossibleMoves(turn, xPlayer, yPlayer, xBot, yBot, numRows)
	{
		// Find possible moves
		var possibleMoves = new Array();
		if(turn == -1)
		{
			if(xPlayer > 0)
			{
				var move = new Move(xPlayer-1, yPlayer);
				possibleMoves.push(move);
			}
			if(xPlayer < numRows-1)
			{
				var move = new Move(xPlayer+1, yPlayer);
				possibleMoves.push(move);
			}
			if(yPlayer > 0)
			{
				var move = new Move(xPlayer, yPlayer-1);
				possibleMoves.push(move);
			}
			if(yPlayer < numRows-1)
			{
				var move = new Move(xPlayer, yPlayer+1);
				possibleMoves.push(move);
			}
		}
		else
		{
			if(xBot > 0)
			{
				var move = new Move(xBot-1, yBot);
				possibleMoves.push(move);
			}
			if(xBot < numRows-1)
			{
				var move = new Move(xBot+1, yBot);
				possibleMoves.push(move);
			}
			if(yBot > 0)
			{
				var move = new Move(xBot, yBot-1);
				possibleMoves.push(move);
			}
			if(yBot < numRows-1)
			{
				var move = new Move(xBot, yBot+1);
				possibleMoves.push(move);
			}
		}
		return possibleMoves;
	}

	highlightPossibleMoves(possibleMoves, game)
	{
		for(var i=0; i<possibleMoves.length; i++)
		{
			var move = possibleMoves[i];
			console.log(move.x+" "+move.y);
			var cell = document.getElementById(move.x.toString()+move.y.toString());
			var inputElement = document.createElement('input');
			inputElement.type = "button";
			this.setMoveOnClick(inputElement, move, game);

			cell.innerHTML = '';
			if(game.board.matrix[move.x][move.y] > 0)
				inputElement.value = game.board.matrix[move.x][move.y];
			cell.appendChild(inputElement);
		}
	}
	//Function to set on which button click, which move to make
	setMoveOnClick(element, move, game)
	{
		element.addEventListener('click', function(){
		    game.makeMove(move);
		});
	}
}











///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Class Move
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class Move
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
}





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Class Game
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class Game
{
	constructor()
	{
		// console.log("play again!");
		this.turn = -1; // Player's turn to act
		// mode = 0 means two player, 1 means easy, 2 means medium, 3 means hard
		this.mode = 0;
		this.playerScore = 0;
		this.botScore = 0;
		this.numRows = 6;

		// initialize a board with 6x6 grid
		this.board = new Board(this.numRows, this);
		var positions = this.board.setInitialPositions();
		this.xPlayer = positions[0];
		this.yPlayer = positions[1];
		this.xBot = positions[2];
		this.yBot = positions[3];
		this.possibleMoves = new Array();
	}

	// show board and score
	updateScreen()
	{
		this.board.printBoard();
		this.possibleMoves = this.board.findPossibleMoves(this.turn, this.xPlayer, this.yPlayer, this.xBot, this.yBot, this.numRows);
		this.board.highlightPossibleMoves(this.possibleMoves, this);
		// print score
		document.getElementById("playerScore").innerHTML = this.playerScore;
		document.getElementById("botScore").innerHTML = this.botScore;
	}

	// Make a move in response to a click
	makeMove(move)
	{
		var x = move.x;
		var y = move.y;
		// First player makes the move
		if(this.turn == -1)
		{
			console.log("x = "+x+"  y = "+y+"  xPlayer = "+this.xPlayer+"  yPlayer = "+this.yPlayer);
			this.board.matrix[this.xPlayer][this.yPlayer] = 0;
			this.playerScore = this.playerScore + this.board.matrix[x][y];
			this.board.matrix[x][y] = -1;
			this.xPlayer = x;
			this.yPlayer = y;
			this.turn = -2;
			if(this.mode != 0)
				engine();
		}
		// Second player/ Bot makes the move
		else if(this.turn == -2)
		{
			this.board.matrix[this.xBot][this.yBot] = 0;
			this.botScore = this.botScore + this.board.matrix[x][y];
			this.board.matrix[x][y] = -2;
			this.xBot = x;
			this.yBot = y;
			this.turn = -1;
		}

		this.updateScreen();
	}
}
