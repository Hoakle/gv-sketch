var p = new p5();
function drawTitle(author, x, y) {
    textWithBackground(author, 20, x, y, p.CENTER, p.CENTER, p.color(0));
}
function dashedLine(x1, y1, x2, y2) {
    var distance = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
    var nbPoints = distance / 2;
    var increment = 1 / nbPoints;
    for (var n = 0; n < 1; n += increment * 2) {
        var lineX1 = lerp(x1, x2, n);
        var lineY1 = lerp(y1, y2, n);
        var lineX2 = lerp(x1, x2, n + increment);
        var lineY2 = lerp(y1, y2, n + increment);
        line(lineX1, lineY1, lineX2, lineY2);
    }
}
function textWithBackground(textToDisplay, size, x, y, hAlign, vAlign, color) {
    textAlign(hAlign, vAlign);
    strokeWeight(0);
    textSize(size);
    var textW = textWidth(textToDisplay);
    var rectX = x;
    switch (hAlign) {
        case CENTER:
            rectX -= textW / 2;
            break;
        case RIGHT:
            rectX -= textW;
            break;
    }
    var rectY = y;
    switch (vAlign) {
        case CENTER:
            rectY -= size / 2;
            break;
        case BOTTOM:
            rectY -= size;
            break;
    }
    fill(255);
    rect(rectX, rectY, textW, size);
    fill(color);
    text(textToDisplay, x, y);
}
