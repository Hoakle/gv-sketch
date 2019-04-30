var Author = /** @class */ (function () {
    function Author(name, citations) {
        this.name = name;
        this.citations = citations;
        this.papers = new Array();
    }
    Author.prototype.isMouseOver = function (mouseX, mouseY) {
        var size = this.getSize();
        return mouseX >= this.x - size / 2 &&
            mouseX <= this.x + size / 2 &&
            mouseY >= this.y - size / 2 &&
            mouseY <= this.y + size / 2;
    };
    Author.prototype.getSize = function () {
        var minArea = 250;
        var maxArea = 5000;
        var area = map(this.citations, this.minAuthorCitations, this.maxAuthorCitations, minArea, maxArea);
        return sqrt(area / PI);
    };
    Author.prototype.drawShape = function () {
        var size = this.getSize();
        switch (this.displayMode) {
            case DisplayMode.NORMAL:
                fill(this.color);
                break;
            case DisplayMode.GRAYED:
                fill(this.gray);
                break;
            case DisplayMode.HIGHLIGHTED:
                fill(this.color);
                break;
        }
        strokeWeight(0);
        rect(this.x - size / 2, this.y - size / 2, size, size);
    };
    Author.prototype.drawConnections = function () {
        var _this = this;
        strokeWeight(1);
        switch (this.displayMode) {
            case DisplayMode.NORMAL:
                stroke(this.color);
                this.papers.forEach(function (paper) { return dashedLine(_this.x, _this.y, paper.x, paper.y); });
                break;
            case DisplayMode.GRAYED:
                stroke(this.gray);
                this.papers.forEach(function (paper) { return dashedLine(_this.x, _this.y, paper.x, paper.y); });
                break;
            case DisplayMode.HIGHLIGHTED:
                this.papers.forEach(function (paper) {
                    if (paper.displayMode == DisplayMode.HIGHLIGHTED) {
                        stroke(_this.color);
                        line(_this.x, _this.y, paper.x, paper.y);
                    }
                    else {
                        stroke(_this.gray);
                        _this.papers.forEach(function (paper) { return dashedLine(_this.x, _this.y, paper.x, paper.y); });
                    }
                });
                break;
        }
    };
    Author.prototype.drawName = function () {
        if (this.displayMode == DisplayMode.HIGHLIGHTED) {
            var titleText = this.name + ' (' + this.citations + ' citations)';
            textWithBackground(titleText, 12, this.x, this.y + this.getSize() / 2 + 10, CENTER, TOP, this.color);
        }
    };
    return Author;
}());
