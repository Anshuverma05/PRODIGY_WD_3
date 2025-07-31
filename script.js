document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const status = document.getElementById('status');
  const resetButton = document.getElementById('reset');
  const pvpButton = document.getElementById('pvp');
  const pvcButton = document.getElementById('pvc');
  
  let currentPlayer = 'X';
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;
  let gameMode = null; // 'pvp' or 'pvc'

  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  // Initialize board
  function initializeBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-index', i);
      cell.addEventListener('click', handleCellClick);
      board.appendChild(cell);
    }
  }

  // Handle cell click
  function handleCellClick(e) {
    if (!gameMode || !gameActive) return;
    
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '') return;

    makeMove(clickedCellIndex, currentPlayer);
    
    if (gameMode === 'pvc' && gameActive && currentPlayer === 'O') {
      setTimeout(computerMove, 500); // Delay for better UX
    }
  }

  // Make a move
  function makeMove(index, player) {
    gameState[index] = player;
    document.querySelector(`.cell[data-index="${index}"]`).textContent = player;
    document.querySelector(`.cell[data-index="${index}"]`).classList.add(player.toLowerCase());
    
    checkResult();
    if (gameActive) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Player ${currentPlayer}'s turn`;
    }
  }

  // Computer move (random)
  function computerMove() {
    const emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      makeMove(randomIndex, 'O');
    }
  }

  // Check game result
  function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;

      if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      const winner = currentPlayer === 'X' ? 'X' : 'O';
      status.textContent = gameMode === 'pvp' 
        ? `Player ${winner} wins!` 
        : winner === 'X' ? 'You win!' : 'Computer wins!';
      gameActive = false;
      return;
    }

    if (!gameState.includes('')) {
      status.textContent = "Game ended in a draw!";
      gameActive = false;
    }
  }

  // Reset game
  function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = gameMode === 'pvp' 
      ? 'Player X\'s turn' 
      : 'Your turn (X)';
    
    document.querySelectorAll('.cell').forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o');
    });
  }

  // Set game mode
  pvpButton.addEventListener('click', () => {
    gameMode = 'pvp';
    initializeBoard();
    resetGame();
  });

  pvcButton.addEventListener('click', () => {
    gameMode = 'pvc';
    initializeBoard();
    resetGame();
  });

  resetButton.addEventListener('click', resetGame);
});

