function getContext() {
    var c = document.getElementById("Canvas");
    var ctx = c.getContext("2d");
    return ctx;
}

function drawEllipse(centerX, centerY, width, height) {
    var ctx = getContext();
    ctx.beginPath();

    ctx.moveTo(centerX, centerY - height/2);

    ctx.bezierCurveTo(
        centerX + width/2, centerY - height/2,
        centerX + width/2, centerY + height/2,
        centerX, centerY + height/2);

    ctx.bezierCurveTo(
        centerX - width/2, centerY + height/2,
        centerX - width/2, centerY - height/2,
        centerX, centerY - height/2);

    ctx.stroke();
    ctx.closePath();
}
