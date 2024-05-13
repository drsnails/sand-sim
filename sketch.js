var gWidth = 5
var gScreenSize = 720
var gLength = gScreenSize / gWidth
let gGrid = createNewGrid()
let gVelocityMat = createNewGrid()
let gAcc = 0.1
var gIsRainbow = false
let gHue = gIsRainbow ? 185 : 50
let bgColor = [200, 255, gIsRainbow ? 0 : 210]

function setup() {
    gGrid = createNewGrid()
    gVelocityMat = createNewGrid()
    colorMode(HSB, 360, 255, 255)
    createCanvas(gScreenSize, gScreenSize);
    renderGrid()

}


function draw() {
    renderGrid()
    gGrid = calculateNextGen(gGrid)
    if (mouseIsPressed) updateGrid();
}

function renderGrid() {
    background(...bgColor)
    for (let i = 0; i < gGrid.length; i++) {
        for (let j = 0; j < gGrid[0].length; j++) {
            const cell = gGrid[i][j]
            noStroke()
            if (cell) {
                const x = j * gWidth
                const y = i * gWidth
                fill(cell, 255, 255)
                // stroke(0)
                square(x, y, gWidth)
            }
        }
    }

}

function toggleColors() {
    gIsRainbow = !gIsRainbow
    gHue = gIsRainbow ? 185 : 50
    bgColor = [200, 255, gIsRainbow ? 0 : 210]
}

function calculateNextGen() {
    let nextGrid = createNewGrid(gGrid)
    for (let i = 0; i < gLength - 1; i++) {
        for (let j = 0; j < gLength; j++) {
            const cell = gGrid[i][j]
            if (!cell) continue
            const cellBelow = gGrid[i + 1][j]
            const dir = (Math.random() > 0.5) ? 1 : -1
            const cellBlowA = gGrid[i + 1][j + dir]
            const cellBelowB = gGrid[i + 1][j - dir]
            if (cellBelow) {
                if (cellBlowA === 0) {
                    nextGrid[i][j + dir] = gGrid[i][j]
                    nextGrid[i][j] = 0
                } else if (cellBelowB === 0) {
                    nextGrid[i][j - dir] = gGrid[i][j]
                    nextGrid[i][j] = 0
                }
            } else {
                let vel = gVelocityMat[i][j] || gAcc
                let diff = getNextEmptyRowDiff({ i, j }, ceil(vel))
                const nextRowIdx = i + diff
                nextGrid[nextRowIdx][j] = gGrid[i][j]
                nextGrid[i][j] = 0
                gVelocityMat[nextRowIdx][j] = vel + gAcc
            }
            gVelocityMat[i][j] = 0
        }
    }
    return nextGrid
}


function mouseDragged() {
    updateGrid()
}

function mouseClicked() {
    updateGrid()
}

function updateGrid() {
    let extra = 2
    let rowIdx = floor(mouseY / gWidth);
    let colIdx = floor(mouseX / gWidth)
    for (let j = colIdx - extra; j <= colIdx + extra; j++) {
        for (let i = rowIdx - extra; i <= rowIdx + extra; i++) {
            // let j = colIdx
            if (i >= 0 && i < gLength &&
                j >= 0 && j < gLength && !gGrid[i][j]) {
                gGrid[i][j] = gHue;
                gVelocityMat[i][j] = 0.3;

            }
        }
    }
    if (gIsRainbow) {
        gHue += 0.045
        if (gHue > 360) gHue = 1
    }
}

function getNextEmptyRowDiff(pos, diff) {
    let cell = gGrid[pos.i + diff]?.[pos.j]
    while (cell || cell === undefined) {
        diff--
        cell = gGrid[pos.i + diff]?.[pos.j]
    }
    return diff < 0 ? 1 : diff
}


//* utils

function createNewGrid(prevGrid) {
    if (prevGrid) return copyGrid(prevGrid)

    return [...Array(gLength)].map(_ => (
        [...Array(gLength)].map(_ => 0)
    ))

}




function copyGrid(grid) {
    return grid.map(row => [...row])
}


