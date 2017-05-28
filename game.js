function Game() {
    this.grid = makeGrid();
    this.setup();
    this.eggCount = 0;
}

Game.prototype.setup = function() {
    var options = [];
    var ctx = getContext();
    for (var row = 0; row < this.grid.length; row++) {
        ctx.moveTo(0, row * cellWidth);
        ctx.lineTo(width, row * cellWidth);
        ctx.stroke();
        for (var col = 0; col < this.grid.length; col++) {
            options.push([row, col]);
            ctx.moveTo(row * cellWidth, 0);
            ctx.lineTo(row * cellWidth, width);
            ctx.stroke();
        }
    }

    for (var i = 0; i < totalEggs; i++) {
        var index = Math.floor(Math.random() * options.length);
        var choice = options[index];
        var row = choice[0];
        var col = choice[1];
        options.splice(index, 1);
        this.grid[row][col].egg = true;
    }

    for (var row = 0; row < this.grid.length; row++) {
        for (var col = 0; col < this.grid.length; col++) {
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
    console.log(xPosition + ", " + yPosition);
    for (var row = 0; row < this.grid.length; row++) {
        for (var col = 0; col < this.grid.length; col++) {
            if (!this.grid[row][col].revealed) {
                if (this.grid[row][col].clickInBounds(xPosition, yPosition)) {
                    this.grid[row][col].reveal(this.grid);
                    if (this.grid[row][col].egg) {
                        this.eggCount++;
                        if (this.eggCount == totalEggs) {
                            console.log("You've found all the eggs!");
                        }
                    }
                    break;
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