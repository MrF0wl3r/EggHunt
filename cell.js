
function Cell(rowIndex, colIndex) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.x = colIndex * cellWidth;
    this.y = rowIndex * cellWidth;

    this.revealed = false;
    this.egg = false;
    this.neighborCount = 0;
}

Cell.prototype.show = function() {
    ctx = getContext();
    let radius = cellWidth/2;
    if (this.revealed) {  
        if (this.egg) {
            var image = eggImages[0];
            eggImages.splice(0, 1);
            ctx.drawImage(image,this.x,this.y, cellWidth, cellWidth);
            //drawEllipse(this.x + radius, this.y + radius, cellWidth - eggOffset, cellWidth - eggOffset);
        }
        else {
            ctx.fillStyle = "black";
            if (this.neighborCount > 0) {
                ctx.font = "24px Arial";
                ctx.textAlign = "center";
                ctx.fillText(this.neighborCount, this.x + radius, this.y + radius + 6);
            }
            else {
                ctx.beginPath();
                ctx.rect(this.x, this.y, cellWidth, cellWidth);
                ctx.fillStyle = "red";
                ctx.fill();
            }
        }
    }
}

Cell.prototype.clickInBounds = function(mouseX, mouseY) {
    if (!this.revealed) {
        if (mouseX >= this.x && mouseX < this.x + cellWidth) {
            // correct column
            if (mouseY >= this.y && mouseY < this.y + cellWidth) {
                // correct row as well
                return true;
            }
        }
    }
    return false;
}

Cell.prototype.reveal = function(grid) {
    this.revealed = true;
    if (this.neighborCount == 0) {
        this.floodFill(grid);
    }
    this.show();
}

Cell.prototype.countNeighbours = function(grid) {
    if (this.egg) {
        this.neighborCount = -1;
        return;
    }
    var total = 0;
    for (var rowOff = -1; rowOff <= 1; rowOff++) {
        for (var colOff = -1; colOff <= 1; colOff++) {
            var row = this.rowIndex + rowOff;
            var col = this.colIndex + colOff;
            if (row > -1 && row < rowCount && col > -1 && col < columnCount) {
                var neighbor = grid[row][col];
                if (neighbor.egg) {
                    total++;
                }
            }
        }
    }
    this.neighborCount = total;
}

Cell.prototype.floodFill = function(grid) {
    for (var rowOff = -1; rowOff <= 1; rowOff++) {
        for (var colOff = -1; colOff <= 1; colOff++) {
            var row = this.rowIndex + rowOff;
            var col = this.colIndex + colOff;
            if (row > -1 && row < rowCount && col > -1 && col < columnCount) {
                var neighbor = grid[row][col];
                if (!neighbor.egg && !neighbor.revealed) {
                    neighbor.reveal(grid);
                }
            }
        }
    }
}