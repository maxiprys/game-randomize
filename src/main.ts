import "./style.css";
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH } from "./consts";
import { Utils } from "./utils";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const $score = document.querySelector("span") as HTMLSpanElement;

const startButton = document.querySelector("#start-button") as HTMLSpanElement;

const dialogElement = document.querySelector("dialog") as HTMLDialogElement;

let TIME_REFRESH: number = 300;

type Piece = {
  position: {
    x: number;
    y: number;
  };
  shape: number[][];
  color: string;
};

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context?.scale(BLOCK_SIZE, BLOCK_SIZE);

let score = 0;

const playerPiece: Piece = {
  position: { x: 6, y: 0 },
  shape: [[1]],
  color: "blue",
};

const enemyPiece: Piece = {
  position: { x: 20, y: 20 },
  shape: [[1]],
  color: "red",
};

const coinPiece: Piece = {
  position: { x: 15, y: 20 },
  shape: [[1]],
  color: "green",
};

const createBoard = (width: number, height: number): number[][] => {
  return Array(height)
    .fill(0)
    .map(() => Array(width).fill(0));
};

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

let dropCounter = 0;
let lastTime: number = 0;

let requestAnimationFrame = 0;

const update = (time: number = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;

  if (dropCounter > TIME_REFRESH) {
    dropCounter = 0;

    if (
      Utils.getDifference(playerPiece.position.x, enemyPiece.position.x) >
      Utils.getDifference(playerPiece.position.y, enemyPiece.position.y)
    ) {
      if (playerPiece.position.x < enemyPiece.position.x) {
        enemyPiece.position.x--;
      } else {
        enemyPiece.position.x++;
      }
    } else {
      if (playerPiece.position.y < enemyPiece.position.y) {
        enemyPiece.position.y--;
      } else {
        enemyPiece.position.y++;
      }
    }
  }

  draw();

  requestAnimationFrame = window.requestAnimationFrame(update);
};

const draw = () => {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 0) {
        drawSquare(x, y, "#ccc");
      }
    });
  });

  drawSquare(playerPiece.position.x, playerPiece.position.y, playerPiece.color);

  drawSquare(enemyPiece.position.x, enemyPiece.position.y, enemyPiece.color);

  drawSquare(coinPiece.position.x, coinPiece.position.y, coinPiece.color);

  if (checkCoinCollision()) {
    score += 10;

    if (TIME_REFRESH > 20) {
      TIME_REFRESH -= 50;
    }

    updatePiecePositionRandom(coinPiece);
  }

  if (checkEnemyCollision()) {
    gameOver();
  }

  $score.innerText = score.toString();
};

const drawSquare = (x: number, y: number, color: string) => {
  context.fillStyle = color;
  context.fillRect(x, y, 1, 1);

  const borderSize = 1 / 10;

  context.strokeStyle = "white";
  context.lineWidth = borderSize;
  context.strokeRect(x, y, 1, 1);
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    playerPiece.position.x--;
  }

  if (event.key === "ArrowRight") {
    playerPiece.position.x++;
  }

  if (event.key === "ArrowDown") {
    playerPiece.position.y++;
  }

  if (event.key === "ArrowUp") {
    playerPiece.position.y--;
  }
});

const checkEnemyCollision = () => {
  return (
    playerPiece.position.x === enemyPiece.position.x &&
    playerPiece.position.y === enemyPiece.position.y
  );
};

const checkCoinCollision = () => {
  return (
    playerPiece.position.x === coinPiece.position.x &&
    playerPiece.position.y === coinPiece.position.y
  );
};

const resetMainPiece = () => {
  // reset position
  playerPiece.position.x = Math.floor(BOARD_WIDTH / 2);
  playerPiece.position.y = 0;
};

const gameOver = () => {
  startButton.textContent = "Start Game";

  showGameOverModal();

  window.cancelAnimationFrame(requestAnimationFrame);
};

const showGameOverModal = () => {
  dialogElement.show();
};

const startGame = () => {
  board.forEach((row) => row.fill(0));

  resetMainPiece();

  update();

  startButton.textContent = "Restart Game";

  updatePiecePositionRandom(coinPiece);
};

const updatePiecePositionRandom = (piece: Piece) => {
  piece.position.x = Utils.getRandomInt(1, BOARD_WIDTH - 1);
  piece.position.y = Utils.getRandomInt(1, BOARD_HEIGHT - 1);
};

startButton.onclick = startGame;
