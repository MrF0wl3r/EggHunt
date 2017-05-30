function Game() {
    this.grid = makeGrid();
    this.setup();
    this.eggCount = 0;
    this.finished = false;
}

Game.prototype.setup = function() {
    let options = [];
    let ctx = getContext();
    let ctxBG = getContextBG();
    ctx.beginPath();
    ctx.rect(0, 0, width, width);
    ctx.fillStyle = 'rgba(35, 35, 35, 0.8)';
    ctx.fill();
    for (let row = 0; row < this.grid.length; row++) {
        ctx.moveTo(0, row * cellWidth);
        ctx.lineTo(width, row * cellWidth);
        ctx.stroke();
        ctxBG.moveTo(0, row * cellWidth);
        ctxBG.lineTo(width, row * cellWidth);
        ctxBG.stroke();
        for (let col = 0; col < this.grid.length; col++) {
            options.push([row, col]);
            ctx.moveTo(row * cellWidth, 0);
            ctx.lineTo(row * cellWidth, width);
            ctx.stroke();
            ctxBG.moveTo(row * cellWidth, 0);
            ctxBG.lineTo(row * cellWidth, width);
            ctxBG.stroke();
        }
    }

    for (let i = 0; i < totalEggs; i++) {
        let index = Math.floor(Math.random() * options.length);
        let choice = options[index];
        let row = choice[0];
        let col = choice[1];
        options.splice(index, 1);
        this.grid[row][col].egg = true;
    }

    for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid.length; col++) {
            this.grid[row][col].countNeighbours(this.grid);
        }
        
    }
}

Game.prototype.draw = function() {
    console.log('drawing.');
    for (var row = 0; row < this.grid.length; row++) {
        for (var col = 0; col < this.grid.length; col++) {
            this.grid[row][col].show();
        }
    }
}

Game.prototype.getClickPosition = function(xPosition, yPosition) {
    if (!this.finished) {
        for (var row = 0; row < this.grid.length; row++) {
            for (var col = 0; col < this.grid.length; col++) {
                if (!this.grid[row][col].revealed) {
                    if (this.grid[row][col].clickInBounds(xPosition, yPosition)) {
                        this.grid[row][col].reveal(this.grid);
                        if (this.grid[row][col].egg) {
                            this.eggCount++;
                            if (this.eggCount == totalEggs) {
                                this.finished = true;
                                let ctx = getContext();
                                ctx.rect(0, 0, width, width);
                                ctx.fillStyle = 'black';
                                ctx.fill();
                                ctx.font = "72px Arial";
                                ctx.textAlign = "center";
                                ctx.fillStyle = 'red';
                                ctx.fillText("You've won!", width/2, width/2);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
}

function makeGrid() {
    let arr = new Array(rowCount);
    for (var row = 0; row < arr.length; row++) {
        arr[row] = new Array(columnCount);        
    }
    for (var row = 0; row < arr.length; row++) {
        for (var col = 0; col < arr.length; col++) {
            arr[row][col] = new Cell(row, col);            
        }        
    }
    return arr;
}

window.onload = function() {
    var backImage = new Image();
    backImage.src = "background.jpg";
    backImage.onload = function() {
        var ctx = getContext();
        ctx.drawImage(backImage, 0, 0, width, width);

        var ctxBG = getContextBG();
        ctxBG.drawImage(backImage, 0, 0, width, width);

        game = new Game();
        game.draw();
    }

    for (var i = 1; i <= totalEggs; i++) {
        var egg = new Image();
        egg.src = "egg" + i + ".png";
        eggImages.push(egg);
    }
};

var game;
var eggImages = [];

function getClickedPosition(e) {
    var xPosition = e.clientX - canvas.offsetLeft;
    var yPosition = e.clientY - canvas.offsetTop;
    game.getClickPosition(xPosition, yPosition);
}

function restartGame() {
    window.location.reload(false);
}