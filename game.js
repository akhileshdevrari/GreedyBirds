var globalGame;
var globalMode;
var globalEngine;

window.onload = function () {
	globalMode = 1;
	document.getElementById('easy').checked = true;
	globalEngine = new Engine();
	newGame();
}

function newGame()
{
	document.getElementById("gameOver").innerHTML = "";
	//initialize game here
	globalGame = new Game(globalMode);
	globalGame.updateScreen();
}


function changeGameMode(mode)
{
	console.log("mode = "+mode);
	globalGame.mode = mode;
	globalMode = mode;
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

	clone()
	{
		var b = new Board(this.numRows);
		for(var i=0; i<this.numRows; i++)
			b.matrix[i] = this.matrix[i].slice();
		return b;
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

		return [xPlayer, yPlayer, xBot, yBot];
	}

	// Prints board on screen
	// if value of a cell is -1, it means it is occupied by the player
	// if value of a cell is -2, it means it is occupied by the bot
	// if value of a cell is more than 0, it represents the number of apples present at that cell
	printBoard()
	{
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

	findPossibleMoves(xPlayer, yPlayer, numRows)
	{
		// Find possible moves
		var possibleMoves = new Array();
		if(xPlayer > 0 && this.matrix[xPlayer-1][yPlayer]>=0)
		{
			var move = new Move(xPlayer-1, yPlayer);
			possibleMoves.push(move);
		}
		if(xPlayer < numRows-1 && this.matrix[xPlayer+1][yPlayer]>=0)
		{
			var move = new Move(xPlayer+1, yPlayer);
			possibleMoves.push(move);
		}
		if(yPlayer > 0 && this.matrix[xPlayer][yPlayer-1]>=0)
		{
			var move = new Move(xPlayer, yPlayer-1);
			possibleMoves.push(move);
		}
		if(yPlayer < numRows-1 && this.matrix[xPlayer][yPlayer+1]>=0)
		{
			var move = new Move(xPlayer, yPlayer+1);
			possibleMoves.push(move);
		}
		return possibleMoves;
	}

	highlightPossibleMoves(possibleMoves, game)
	{
		for(var i=0; i<possibleMoves.length; i++)
		{
			var move = possibleMoves[i];
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
	clone()
	{
		var m = new Move(this.x, this.y);
		return m;
	}
}





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Class Game
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class Game
{
	constructor(mode)
	{
		// Player's turn to act, -2 would mean bot starts first
		this.turn = -1;
		// mode = 0 means two player, 1 means easy, 2 means hard
		this.mode = mode;
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

	clone()
	{
		var g = new Game(this.mode);
		g.turn = this.turn;
		g.playerScore = this.playerScore;
		g.botScore = this.botScore;
		g.numRows = this.numRows;
		g.board = this.board.clone();
		g.xPlayer = this.xPlayer;
		g.yPlayer = this.yPlayer;
		g.xBot = this.xBot;
		g.yBot = this.yBot;
		return g;
	}

	// show board and score
	updateScreen()
	{
		this.board.printBoard();
		
		if(this.turn == -1)
			this.possibleMoves = this.board.findPossibleMoves(this.xPlayer, this.yPlayer, this.numRows);
		else this.possibleMoves = this.board.findPossibleMoves(this.xBot, this.yBot, this.numRows);

		this.board.highlightPossibleMoves(this.possibleMoves, this);
		// print score
		document.getElementById("playerScore").innerHTML = this.playerScore;
		document.getElementById("botScore").innerHTML = this.botScore;

		// Check if game is finished
		if(this.isGameOver())
		{
			this.gameOver();
		}
	}

	// Make a move in response to a click
	makeMove(move)
	{
		var x = move.x;
		var y = move.y;
		// First player makes the move
		if(this.turn == -1)
		{
			this.board.matrix[this.xPlayer][this.yPlayer] = 0;
			this.playerScore = this.playerScore + this.board.matrix[x][y];
			this.board.matrix[x][y] = -1;
			this.xPlayer = x;
			this.yPlayer = y;
			this.turn = -2;
			if(this.mode != 0)
			{
				var m;
				// For easy mode, keep depth of minimax tree = 3
				if(this.mode == 1)
					m = globalEngine.findBestMove(this.clone(), 3);
				// For hard mode, keep depth of minimax tree = 8
				else if(this.mode == 2)
					m = globalEngine.findBestMove(this.clone(), 8);
				this.makeMove(m);
			}
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

	isGameOver()
	{
		var flag = true;
		for(var i=0; i<this.numRows; i++)
		{
			for(var j=0; j<this.numRows; j++)
			{
				if(this.board.matrix[i][j] > 0)
					flag = false;
			}
		}
		return flag;
	}

	gameOver()
	{
		document.getElementById("gameOver").innerHTML = "GAME OVER";
	}
}









///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Class Engine
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Engine
{
	findBestMove(game, depth)
	{
		// turn would be -2 obviously
		game.possibleMoves = game.board.findPossibleMoves(game.xBot, game.yBot, game.numRows);
		var bestMove = game.possibleMoves[0];
		var maxVal = -Number.MAX_VALUE;
		for(var i=0; i<game.possibleMoves.length; i++)
		{
			var newGame = game.clone();
			this.makeMove(newGame, game.possibleMoves[i]);
			var currVal = this.minimax(newGame, depth, -Number.MAX_VALUE, Number.MAX_VALUE);
			// console.log("Move = "+game.possibleMoves[i].x+" "+game.possibleMoves[i].y+"  currVal = "+currVal+"  numNodes = "+this.numNodes);
			if(currVal == maxVal)
			{
				var currValOne = this.getHeuristicVal(newGame);
				var newGameOne = game.clone();
				this.makeMove(newGameOne, bestMove);
				var maxValOne = this.getHeuristicVal(newGameOne);
				// console.log("currValOne = "+currValOne+"  maxValOne = "+maxValOne);
				if(currValOne > maxValOne)
					bestMove = game.possibleMoves[i];
			}
			if(currVal > maxVal)
			{
				maxVal = currVal;
				bestMove = game.possibleMoves[i];
			}
		}
		// console.log("bestMove : "+bestMove.x+" "+bestMove.y);
		return bestMove;
	}


	// Get heuristic value
	getHeuristicVal(game)
	{
		var positionVal = 0, num=0;
		for(var i=0; i<game.numRows; i++)
		{
			for(var j=0; j<game.numRows; j++)
			{
				if(game.board.matrix[i][j] > 0)
				{
					num = num+1;
					var dist = Math.abs(i-game.xPlayer)+Math.abs(j-game.yPlayer) - Math.abs(i-game.xBot)-Math.abs(j-game.yBot);
					positionVal = positionVal + game.board.matrix[i][j]*dist;
				}
			}
		}
		// multiplication factor of 20 is just a heuristic
		return positionVal + 20*(game.botScore - game.playerScore);
	}

	makeMove(game, move)
	{
		if(game.turn == -1)
		{
			game.board.matrix[game.xPlayer][game.yPlayer] = 0;
			game.playerScore = game.playerScore + game.board.matrix[move.x][move.y];
			game.board.matrix[move.x][move.y] = -1;
			game.xPlayer = move.x;
			game.yPlayer = move.y;
			game.turn = -2;
		}
		else
		{
			game.board.matrix[game.xBot][game.yBot] = 0;
			game.botScore = game.botScore + game.board.matrix[move.x][move.y];
			game.board.matrix[move.x][move.y] = -2;
			game.xBot = move.x;
			game.yBot = move.y;
			game.turn = -1;
		}
	}

	minimax(game, depth, alpha, beta)
	{
		if(depth == 0)
			return this.getHeuristicVal(game);
		if(game.turn == -2)
		{
			var maxVal = -Number.MAX_VALUE;
			// choose maximum in Bot's turn
			game.possibleMoves = game.board.findPossibleMoves(game.xBot, game.yBot, game.numRows);
			for(var i=0; i<game.possibleMoves.length && alpha < beta; i++)
			{
				var newGame = game.clone();
				this.makeMove(newGame, game.possibleMoves[i]);
				var currVal = this.minimax(newGame, depth-1, alpha, beta);
				if(currVal > maxVal)
					maxVal = currVal;
				if(maxVal > alpha)
					alpha = maxVal;
			}
			return maxVal;
		}
		else
		{
			// choose minimum in player's turn
			var minVal = Number.MAX_VALUE;
			// choose maximum in Bot's turn
			game.possibleMoves = game.board.findPossibleMoves(game.xPlayer, game.yPlayer, game.numRows);
			for(var i=0; i<game.possibleMoves.length && alpha < beta; i++)
			{
				var newGame = game.clone();
				this.makeMove(newGame, game.possibleMoves[i]);
				var currVal = this.minimax(newGame, depth-1, alpha, beta);
				if(currVal < minVal)
					minVal = currVal;
				if(minVal < beta)
					beta = minVal;
			}
			return minVal;
		}
	}
}