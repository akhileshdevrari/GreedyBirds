
# Hungry Birds

A simple 2 player web game featuring a $6\times6$ grid with numbers on it. Players make moves alternatively. In each move, a player goes to an adjacent cell and the number on that cell is added to its score. When there are no numbers left on the board, the player with the higher score wins.

In single player mode, the bot is implemented using minimax algorithm with alpha-beta pruning. The heuristic function used to evaluate a board in favour of player2 = $const\times(player2score - player1score)$ + $\sum$ $cell[i]\times(dist(player1, cell[i[) - dist(player2, cell[i]))$.
