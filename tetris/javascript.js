// Javascript Document
document.addEventListener('DOMContentLoaded', () => {
    
    const toAdd = document.createDocumentFragment();
    
    for (i = 0; i < 200; i++) {
        var newElement = document.createElement('div');
        newElement.id = 'g'+i;
        newElement.className = "gameBlock";
        toAdd.appendChild(newElement)
    };
    
    document.getElementById('grid').appendChild(toAdd);
    
    const divTaken = document.createDocumentFragment();
    
    for (i = 0; i < 10; i++) {
        var takenBlock = document.createElement('div');
        takenBlock.id = 't'+i;
        takenBlock.className = "taken";
        divTaken.appendChild(takenBlock)
    };
    
    document.getElementById('grid').appendChild(divTaken);
    
    const miniGrid = document.createDocumentFragment();
    
    for (i = 0; i < 16; i++) {
        var shapeGrid = document.createElement('div');
        shapeGrid.id = 'm_grid'+i;
        miniGrid.appendChild(shapeGrid)
    }
    
    document.getElementById('mini-grid').appendChild(miniGrid)
    
    console.log(newElement)
    console.log(takenBlock)
    console.log(shapeGrid)
    
    
    
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId = null;
    let score = 0;
    const colours = [
        'rgba(52, 80, 218, 1)',    // Blue
        'rgba(247, 187, 35, 1)',    // Orange
        'rgba(235, 91, 52, 1)',     // Red
        'rgba(100, 217, 98, 1)',    // Green
        'rgba(195, 98, 217, 1)',    // Purple
        'rgba(227, 237, 83, 1)',    // Yellow
        'rgba(70, 209, 244, 1)'     // Cyan
    ]
    
    // Tetrominos
    const jTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
    
    const lTetromino = [
        [0, 1, width+1, width*2+1],
        [2, width, width+1, width+2],
        [1, width+1, width*2+1, width*2+2],
        [width, width+1, width+2, width*2]
    ]
    
    const zTetromino = [
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2],
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2]
    ];
    
    const sTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ];
    
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];
    
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];
    
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];
    
    
    const theTetrominos = [jTetromino, lTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino];
    
    let currentPosition = 4;
    let currentRotation = 0;
    
    // Randomly Select Tetromino
    let random = Math.floor(Math.random()*theTetrominos.length)
    let current = theTetrominos[random][0];
    
    // Draw First Rotation
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colours[random]
        })
    };
    
    draw();
    
    
    // Undraw Tetromino
    function undraw() {
        current.forEach (index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    };
    
    // Assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)
    
    
    // Move Down Function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw()
        freeze()
    };
    
    // Freeze Statement
    
    function freeze() {
        if (current.some (index => squares [currentPosition + index + width].classList.contains('taken'))) {
            current.forEach (index => squares [currentPosition + index].classList.add('taken'));
    
            //Start a New Tetromino Falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominos.length);
            current = theTetrominos[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    };
    
    // Move the Tetromino left, unless is at the edge or blocked.
    
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    
        if (!isAtLeftEdge) currentPosition -= 1;
    
        if (current.some (index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        };
    
        draw();
    };
    
    // Move the Tetromino Right, unless is at edge or blocked.
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    
        if (!isAtRightEdge) currentPosition += 1;
    
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        };
    
        draw();
    };
    
    
    // Fix Collision Bug
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }
    
    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(p) {
        p = p || currentPosition    // Get current position. Then, check if near left side.
        if ((p + 1) % width < 4) {
            if (isAtRight()) {
                currentPosition += 1;
                checkRotatedPosition(p);
            }
        } else if (p % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1;
                checkRotatedPosition(p);
            }
        }
    };
    
    // Rotate the Tetromino
    function rotate() {
        undraw();
        currentRotation ++;
        if (currentRotation === current.length) { // If the current rotation gets to 4, return to 0
            currentRotation = 0;
        };
        current = theTetrominos[random][currentRotation];
        checkRotatedPosition();
        draw();
    };
    
    // Show Next-Up Tetromino in Mini Grid Display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;
    
    // The Tetrominos without Rotation
    const nextUpTetromino = [
        [1, displayWidth+1, displayWidth*2+1, 2],               // jTetromino
        [0, 1, displayWidth+1, displayWidth*2+1],               // lTetromino
        [1, displayWidth, displayWidth+1, displayWidth*2],      // zTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1],    // sTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2],      // tTetromino
        [0, 1, displayWidth, displayWidth+1],                   // oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTetromino
    ]
    
    // Display Shape in Mini Grid Display
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        nextUpTetromino[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom]
        })
    }
    
    // Start/Pause Function
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominos.length);
            displayShape()
        }
    });
    
    // Add Score
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
          if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
              squares[index].classList.remove('taken')
              squares[index].classList.remove('tetromino')
              squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
          }
        }
      }
    
    // Game Over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'End';
            clearInterval(timerId);
        }
    }
    
    
    
    
    });