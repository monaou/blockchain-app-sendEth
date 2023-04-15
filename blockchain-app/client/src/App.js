import React, { useState, useEffect } from 'react';
import './App.css';
// import Navbar from "./components/Navbar";
// import Main from "./components/Main";

const BLOCK_SHAPES = [
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0], [1, 1], [1, 0]],
  [[0, 1], [0, 1], [1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1], [1], [1], [1]],
];

const BLOCK_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];

const ROWS = 20;
const COLUMNS = 10;

const App = () => {
  // ゲームの状態を管理するためのステート
  const [grid, setGrid] = useState([]);
  const [currentBlock, setCurrentBlock] = useState([]);
  const [position, setPosition] = useState([0, 4]);
  const [nextBlock, setNextBlock] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // ゲームが始まった時に、グリッドを生成する
  useEffect(() => {
    const createGrid = () => {
      const rows = [];
      for (let i = 0; i < ROWS; i++) {
        rows.push(Array(COLUMNS).fill(0));
      }
      setGrid(rows);
    };
    createGrid();
  }, []);

  // 指定された行が完全に埋まっているかどうかをチェックする関数
  const checkRowFull = (row) => {
    return row.every((cell) => cell !== 0);
  };

  // 指定された行をクリアする関数
  const clearRow = (rowIndex) => {
    const newGrid = [...grid];
    newGrid.splice(rowIndex, 1);
    newGrid.unshift(Array(COLUMNS).fill(0));
    setGrid(newGrid);
  };

  // ゲームオーバーにする関数
  const endGame = () => {
    setGameOver(true);
  };

  // 次のブロックを生成する関数
  const createNextBlock = () => {
    const shapeIndex = Math.floor(Math.random() * BLOCK_SHAPES.length);
    const colorIndex = Math.floor(Math.random() * BLOCK_COLORS.length);
    const block = {
      shape: BLOCK_SHAPES[shapeIndex],
      color: BLOCK_COLORS[colorIndex],
    };
    setNextBlock(block);
  };

  // 新しいブロックを生成する関数
  const createBlock = () => {
    if (gameOver) return;
    const block = nextBlock;

    setCurrentBlock(block);
    setPosition([0, 4]);
    setScore(score + 10);
    createNextBlock();
    // 新しいブロックが置けない場合は、ゲームオーバーにする
    if (block.shape.some((row, rowIndex) =>
      row.some((cell, cellIndex) =>
        cell !== 0 && grid[rowIndex][cellIndex + 4] !== 0))) {
      endGame();
    }
  };

  // キーボードイベントをリッスンし、ブロックを移動させる
  const handleKeyDown = (event) => {
    if (event.keyCode === 37) { // 左矢印キー
      moveBlock("left");
    } else if (event.keyCode === 39) { // 右矢印キー
      moveBlock("right");
    } else if (event.keyCode === 40) { // 下矢印キー
      moveBlock("down");
    } else if (event.keyCode === 38) { // 上矢印キー
      rotateBlock();
    }
  };

  // ブロックを移動させる関数
  const moveBlock = (direction) => {
    const [x, y] = position;
    const block = currentBlock;
    switch (direction) {
      case "left":
        if (y > 0 && block.every((row, rowIndex) =>
          row.every((cell, cellIndex) =>
            cell !== 0 && grid[rowIndex][cellIndex + y - 1] !== 0))) {
          setPosition([x, y - 1]);
        }
        break;
      case "right":
        if (y < COLUMNS - block[0].length && block.every((row, rowIndex) =>
          row.every((cell, cellIndex) =>
            cell !== 0 && grid[rowIndex][cellIndex + y + 1] !== 0))) {
          setPosition([x, y + 1]);
        }
        break;
      case "down":
        if (x < ROWS - block.length && block.every((row, rowIndex) =>
          row.every((cell, cellIndex) =>
            cell !== 0 && (grid[rowIndex + x + 1][cellIndex + y] !== 0 ||
              rowIndex !== block.length - 1)))) {
          setPosition([x + 1, y]);
        } else {
          // ブロックが着地したら、新しいブロックを生成する
          updateGrid();
          createBlock();
        }
        break;
      default:
        if (y > 0 && block.every((row, rowIndex) =>
          row.every((cell, cellIndex) =>
            cell !== 0 && grid[rowIndex][cellIndex + y - 1] !== 0))) {
          setPosition([x, y - 1]);
        }
        break;
    }
  };

  // ブロックを回転させる関数
  const rotateBlock = () => {
    const block = currentBlock;
    const rotatedBlock = block[0].map((_, index) =>
      block.map(row => row[index]).reverse());
    if (position[1] + rotatedBlock[0].length > COLUMNS) {
      return;
    }
    // if (rotatedBlock.some((row, rowIndex) =>
    //   row.some((cell, cellIndex) =>
    //     cell !== 0 && grid[rowIndex + position[0]][cellIndex + position[1]] !== 0))) {
    //   return;
    // }
    setCurrentBlock(rotatedBlock);
  };

  // グリッドにブロックを反映する関数
  const updateGrid = () => {
    const [x, y] = position;
    const block = currentBlock;
    const newGrid = [...grid];
    block.forEach((row, rowIndex) =>
      row.forEach((cell, cellIndex) => {
        if (cell !== 0) {
          newGrid[rowIndex + x][cellIndex + y] = cell;
        }
      }));
    setGrid(newGrid);
    checkRows();
  };

  // 満たされた行がある場合は、それらをクリアする
  const checkRows = () => {
    const newGrid = [...grid];
    for (let i = newGrid.length - 1; i >= 0; i--) {
      if (checkRowFull(newGrid[i])) {
        clearRow(i);
        setScore(score + 100);
        i++;
      }
    }
  };

  // ゲームを開始する関数
  const startGame = () => {
    createBlock();
    createNextBlock();
    setScore(1);
    setGameOver(false);
  };

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex="0">
      <div className="game-container">
        <div className="score">board</div>
        <div className="game-board">
          {grid.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div key={`${rowIndex}-${cellIndex}`}
                className={`cell ${cell === 0 ? 'empty' : 'block'}`}
                style={{ backgroundColor: BLOCK_COLORS[cell - 1] }} />
            )))}
          {gameOver && <div className="game-over">Game Over</div>}
        </div>
        <div className="game-info">
          <div className="score">Score: {score}</div>
          <div className="next-block">
            Next block:
            {nextBlock.shape && nextBlock.shape.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div key={`${rowIndex}-${cellIndex}`}
                  className={`cell ${cell === 0 ? 'empty' : 'block'}`}
                  style={{ backgroundColor: BLOCK_COLORS[nextBlock.color] }} />
              )))}
          </div>
          <button className="start-button" onClick={startGame}>Start Game</button>
        </div>
      </div>
    </div>
  );
};

export default App;