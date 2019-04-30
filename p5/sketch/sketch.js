var s = function (p) {
	var w = 500;
	var h = 500;
	let angles = [];
	let colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];
	let mapSort1;
	let linkedData = {};
	let keywordCount;
	let allKeywords;

	p.preload = function () {
		allPaper = p.loadTable("data/IEEE VIS papers 1990-2018 - Main dataset.csv", "csv", "header");
		cleanedData = p.loadTable("data/authors-affiliations-cleaned-March-25-2019.csv", "csv", "header");
	}

	p.setup = function () {
		// put setup code here
		setupSearch(cleanedData);
		let canvasDiv = document.getElementById('canvas');
		w = canvasDiv.offsetWidth;
		h = canvasDiv.offsetHeight;
		var canvas = p.createCanvas(w, h);
		canvas.parent('canvas');
		p.background(210);
		authorData = cleanedData.findRows('Alex T. Pang', 'AuthorNames-Deduped');
		setupAuthor(authorData, allPaper);
		allKeywords = getAllKeywords();
		p.updateSketch('Alex T. Pang');

	}

	p.updateSketch = function (author) {
		angles = [];
		authorData = cleanedData.findRows(author, 'AuthorNames-Deduped');
		updateAuthorDatas(author);
		keywordCount = getKeywordsCount(authorData, allKeywords);
		mapSort1 = new Map([...keywordCount.entries()].sort((a, b) => b[1] - a[1]));
		sum = 0;
		var i = 0;
		var iterator1 = mapSort1.entries();
		while (i < 20 && i < mapSort1.size) {
			sum += iterator1.next().value[1];
			i++;
		}

		i = 0;
		iterator1 = mapSort1.entries();
		while (i < 20 && i < mapSort1.size) {
			angles.push(+iterator1.next().value[1] / sum * 200);
			i++;
		}
	}

	function getKeywordsCount(datas, allKeywords) {
		var map1 = new Map();

		for (var i = 0; i < datas.length; i++) {
			paper = allPaper.findRow(datas[i].get("DOI"), "DOI");
			keywordList = paper.get("AuthorKeywords").split(",");

			abstract = paper.get("Abstract");
			title = paper.get("Title");

			for (var j = 0; j < keywordList.length; j++) {
				if (map1.get(keywordList[j].trim().removePlurials()) == undefined && keywordList[j].trim().removePlurials() != "") {
					map1.set(keywordList[j].trim().removePlurials(), 1);
				} else if (keywordList[j].trim().removePlurials() != "") {
					map1.set(keywordList[j].trim().removePlurials(), map1.get(keywordList[j].trim().removePlurials()) + 1);
				}
			}

			for (var j = 0; j < allKeywords.length; j++) {
				if ((abstract.includes(allKeywords[j].removePlurials()) || title.includes(allKeywords[j].removePlurials())) && !keywordList.includes(allKeywords[j].removePlurials())) {
					if (map1.get(allKeywords[j].removePlurials()) == undefined) {
						map1.set(allKeywords[j].removePlurials(), 1);
					} else if (allKeywords[j].removePlurials() != "") {
						map1.set(allKeywords[j].removePlurials(), map1.get(allKeywords[j].removePlurials()) + 1);
					}
				}
			}
		}

		return map1;
	}

	p.draw = function () {
		p.background(150);
		pieChart(300, angles);
	}

	function pieChart(diameter, data) {
		let lastAngle = 0;
		iterator1 = mapSort1.entries();
		for (let i = 0; i < data.length; i++) {
			let color = colors[i];
			p.noFill();
			p.stroke(color);
			p.strokeWeight(16);
			p.arc(
				w / 2,
				h / 2,
				diameter,
				diameter,
				lastAngle,
				lastAngle + p.radians(angles[i]),
				p.OPEN
			);
			p.noStroke();
			p.textSize(12);
			p.fill(color);
			p.translate(p.cos(lastAngle + p.radians(angles[i] / 2)) * 170 + w / 2, p.sin(lastAngle + p.radians(angles[i] / 2)) * 170 + h / 2);
			p.rotate(lastAngle + p.radians(angles[i]) / 2);
			p.text(iterator1.next().value[0], 0, 0);
			p.rotate(-lastAngle - p.radians(angles[i]) / 2);
			p.translate(-(p.cos(lastAngle + p.radians(angles[i] / 2)) * 170 + w / 2), -(p.sin(lastAngle + p.radians(angles[i] / 2)) * 170 + h / 2));
			lastAngle += p.radians(angles[i]) + p.radians(8);
		}
	}

	function mousePressed() {
		// Check if mouse is inside the circle
		let d = dist(mouseX, mouseY, width / 2, height / 2);
		console.log(d);
		textSize(32);
		text('word', 10, 30);
		fill(0, 102, 153);
		text('word', 10, 60);
		fill(0, 102, 153, 51);
		text('word', 10, 90);
	}

	function orderByAffiliation(datas) {
		var result = [];

		var firstaffiliation = {
			affiliation: datas[0].get("AuthorAffiliation"),
			start: datas[0].get("Year"),
			end: datas[0].get("Year"),
			papers: []
		};
		result.push(firstaffiliation);

		var cpt = 0;
		for (var i = 0; i < datas.length; i++) {
			if (datas[i].get("AuthorAffiliation") == result[cpt].affiliation) {
				result[cpt].end = datas[i].get("Year");
				result[cpt].papers.push(datas[i].obj);
			} else {
				var affiliation = {
					affiliation: datas[i].get("AuthorAffiliation"),
					start: datas[i].get("Year"),
					end: datas[i].get("Year"),
					papers: [datas[i].obj]
				};
				result.push(affiliation);
				cpt++;
			}
		}


		return result;
	}

	function getAllKeywords() {
		var list = [];
		console.log(allPaper);
		for (var i = 0; i < allPaper.getRowCount(); i++) {
			var keyword = allPaper.getRow(i).get("AuthorKeywords").split(",");
			for (var j = 0; j < keyword.length; j++) {
				if (!list.includes(keyword[j].trim())) {
					list.push(keyword[j].trim());
				}
			}
		}
		return list;
	}

	String.prototype.removePlurials = function () {
		return this.replace(/[e']s$/, '').replace(/([^aiou])s/, '$1');
	}
}



var t = function (p) {

	let table;
	let author = "Alex T. Pang";
	//let author = "Tamara Munzner";
	//let author = "Heidrun Schumann";
	let papers;
	let canvasWidth = window.innerWidth;
	let topMargin = 130;
	let coauthors;
	let yStep = 70;

	p.preload = function () {
		// @ts-ignore
		table = p.loadTable('data/IEEE VIS papers 1990-2018 - Main dataset.csv', 'csv', 'header');
	}

	p.setup = function () {
		let canvasDiv = document.getElementById('canvas2');
		canvasWidth = canvasDiv.offsetWidth;
		papers = getAuthorPapers(author, table);

		var minCitations = Infinity;
		var maxCitations = 0;
		papers.forEach(paper => {
			if (paper.citations < minCitations)
				minCitations = paper.citations;
			if (paper.citations > maxCitations)
				maxCitations = paper.citations;
		});
		papers.forEach(paper => {
			paper.minCitations = minCitations;
			paper.maxCitations = maxCitations;
			paper.color = p.color("#11144c");
			paper.gray = p.color(210);
		});

		initializePapersPositions(papers);

		coauthors = getUniqueAuthors(papers);

		removeFirst(coauthors, coauthor => coauthor.name == author);

		var minAuthorCitations = Infinity;
		var maxAuthorCitations = 0;
		coauthors.forEach(coauthor => {
			if (coauthor.citations < minAuthorCitations)
				minAuthorCitations = coauthor.citations;
			if (coauthor.citations > maxAuthorCitations)
				maxAuthorCitations = coauthor.citations;
		});
		coauthors.forEach(coauthor => {
			coauthor.minAuthorCitations = minAuthorCitations;
			coauthor.maxAuthorCitations = maxAuthorCitations;
			coauthor.color = p.color("#3a9679");
			coauthor.gray = p.color(210);
		});

		initializeCoauthorsPositions(coauthors);

		p.createCanvas(canvasWidth, papers.length * yStep + topMargin);
	}

	p.draw = function () {
		p.clear();
		drawTitle(author, canvasWidth / 2, topMargin / 2);

		var isMouseOverSomething = false;
		var highlightedPaper = undefined;
		var highlightedCoauthor = undefined;
		papers.forEach(paper => {
			if (paper.isMouseOver(p.mouseX, p.mouseY)) {
				isMouseOverSomething = true;
				highlightedPaper = paper;
			}
		});
		coauthors.forEach(coauthor => {
			if (coauthor.isMouseOver(p.mouseX, p.mouseY)) {
				isMouseOverSomething = true;
				highlightedCoauthor = coauthor;
			}
		});

		papers.forEach(paper => {
			paper.displayMode = isMouseOverSomething ? DisplayMode.GRAYED : DisplayMode.NORMAL;
		});
		coauthors.forEach(coauthor => {
			coauthor.displayMode = isMouseOverSomething ? DisplayMode.GRAYED : DisplayMode.NORMAL;
		});

		if (highlightedPaper !== undefined) {
			highlightedPaper.displayMode = DisplayMode.HIGHLIGHTED;
			coauthors.forEach(coauthor => {
				if (coauthor.papers.indexOf(highlightedPaper) >= 0)
					coauthor.displayMode = DisplayMode.HIGHLIGHTED;
			});
		}
		if (highlightedCoauthor !== undefined) {
			highlightedCoauthor.displayMode = DisplayMode.HIGHLIGHTED;
			highlightedCoauthor.papers.forEach(paper => paper.displayMode = DisplayMode.HIGHLIGHTED);
		}

		for (let i = 0; i < papers.length; i++)
			papers[i].drawConnection(i > 0 ? papers[i - 1] : undefined);

		for (let i = 0; i < coauthors.length; i++)
			coauthors[i].drawConnections();

		for (let i = 0; i < papers.length; i++)
			papers[i].drawShape(i > 0 ? papers[i - 1] : undefined);

		for (let i = 0; i < coauthors.length; i++)
			coauthors[i].drawShape();

		for (let i = 0; i < coauthors.length; i++)
			coauthors[i].drawName();

		for (let i = 0; i < papers.length; i++)
			papers[i].drawTitle();
	}

	function removeFirst(array, predicate) {
		for (let i = 0; i < array.length; i++) {
			const element = array[i];
			if (predicate(element)) {
				array.splice(i, 1);
				return;
			}
		}
	}

	function getAuthorCitations(author) {
		var citations = 0;
		for (let i = 0; i < table.getRowCount(); i++) {
			const row = table.getRow(i);
			if (row.get('AuthorNames-Deduped').toString().split(';').indexOf(author) >= 0) {
				var paperCitations = parseInt(row.get('AminerCitationCount_02-2019').toString());
				citations += isNaN(paperCitations) ? 0 : paperCitations;
			}
		}
		return citations;
	}

	function getUniqueAuthors(papers) {
		var authors = new Array();

		papers.forEach(paper => {
			paper.authors.forEach(authorName => {
				// @ts-ignore
				var author = authors.find(author => author.name == authorName);
				if (author == undefined) {
					author = new Author(authorName, getAuthorCitations(authorName));
					author.papers.push(paper);
					authors.push(author);
				} else {
					author.papers.push(paper);
				}
			});
		});

		return authors;
	}

	function getAuthorPapers(author, table) {
		var papers = Array();
		for (let i = 0; i < table.getRowCount(); i++) {
			const row = table.getRow(i);
			const authorsStr = row.get('AuthorNames-Deduped').toString();
			if (authorsStr.indexOf(author) >= 0) {
				var authors = Array();
				authorsStr.split(';').forEach(author => {
					authors.push(author);
				});
				var title = row.get('Title').toString();
				var year = parseInt(row.get('Year').toString());
				var authors = authors;
				var affiliation = row.get('AuthorAffiliation').toString();
				var citations = parseInt(row.get('AminerCitationCount_02-2019').toString());
				papers.push(new Paper(title, year, authors, affiliation, citations));
			}
		}
		return papers.sort((a, b) => a.year - b.year);;
	}

	function initializePapersPositions(papers) {
		var maxOffset = 50;
		for (let i = 0; i < papers.length; i++) {
			if (i == 0)
				papers[i].x = canvasWidth / 2;
			else if (papers[i - 1].x < canvasWidth / 3)
				papers[i].x = papers[i - 1].x + p.random(0, maxOffset);
			else if (papers[i - 1].x > canvasWidth / 3 * 2)
				papers[i].x = papers[i - 1].x + p.random(-maxOffset, 0);
			else
				papers[i].x = papers[i - 1].x + p.random(-maxOffset, maxOffset);

			papers[i].y = topMargin + i * yStep;
		}
	}

	function initializeCoauthorsPositions(coauthors) {
		for (let i = 0; i < coauthors.length; i++) {
			const coauthor = coauthors[i];
			if (coauthor.papers.length == 1) {
				coauthor.x = i % 2 == 0 ? coauthor.papers[0].x + 200 : coauthor.papers[0].x - 200;
				coauthor.y = coauthor.papers[0].y + p.random(-50, 50);
			} else {
				var minX = canvasWidth;
				var maxX = 0;
				var meanY = 0;
				coauthor.papers.forEach(paper => {
					if (paper.x < minX)
						minX = paper.x;
					if (paper.x > maxX)
						maxX = paper.x;
					meanY += paper.y;
				});
				meanY /= coauthor.papers.length;

				coauthor.x = i % 2 == 0 ? maxX + 300 : minX - 300;
				coauthor.y = meanY;;
			}
		}
	}

	var DisplayMode;
	(function (DisplayMode) {
		DisplayMode[DisplayMode["NORMAL"] = 0] = "NORMAL";
		DisplayMode[DisplayMode["GRAYED"] = 1] = "GRAYED";
		DisplayMode[DisplayMode["HIGHLIGHTED"] = 2] = "HIGHLIGHTED";
	})(DisplayMode || (DisplayMode = {}));

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
			var area = p.map(this.citations, this.minAuthorCitations, this.maxAuthorCitations, minArea, maxArea);
			return p.sqrt(area / p.PI);
		};
		Author.prototype.drawShape = function () {
			var size = this.getSize();
			switch (this.displayMode) {
				case DisplayMode.NORMAL:
					p.fill(this.color);
					break;
				case DisplayMode.GRAYED:
					p.fill(this.gray);
					break;
				case DisplayMode.HIGHLIGHTED:
					p.fill(this.color);
					break;
			}
			p.strokeWeight(0);
			p.rect(this.x - size / 2, this.y - size / 2, size, size);
		};
		Author.prototype.drawConnections = function () {
			var _this = this;
			p.strokeWeight(1);
			switch (this.displayMode) {
				case DisplayMode.NORMAL:
					p.stroke(this.color);
					this.papers.forEach(function (paper) { return dashedLine(_this.x, _this.y, paper.x, paper.y); });
					break;
				case DisplayMode.GRAYED:
					p.stroke(this.gray);
					this.papers.forEach(function (paper) { return dashedLine(_this.x, _this.y, paper.x, paper.y); });
					break;
				case DisplayMode.HIGHLIGHTED:
					this.papers.forEach(function (paper) {
						if (paper.displayMode == DisplayMode.HIGHLIGHTED) {
							p.stroke(_this.color);
							p.line(_this.x, _this.y, paper.x, paper.y);
						}
						else {
							p.stroke(_this.gray);
							_this.papers.forEach(function (paper) { return dashedLine(_this.x, _this.y, paper.x, paper.y); });
						}
					});
					break;
			}
		};
		Author.prototype.drawName = function () {
			if (this.displayMode == DisplayMode.HIGHLIGHTED) {
				var titleText = this.name + ' (' + this.citations + ' citations)';
				textWithBackground(titleText, 12, this.x, this.y + this.getSize() / 2 + 10, p.CENTER, p.TOP, this.color);
			}
		};
		return Author;
	}());

	var Paper = /** @class */ (function () {
		function Paper(title, year, authors, affiliation, citations) {
			this.title = title;
			this.year = year;
			this.authors = authors;
			this.affiliation = affiliation;
			this.citations = citations;
			if (this.citations == null || isNaN(this.citations))
				this.citations = 0;
		}
		Paper.prototype.isMouseOver = function (mouseX, mouseY) {
			return p.sqrt(p.pow(mouseX - this.x, 2) + p.pow(mouseY - this.y, 2)) <= this.getRadius() / 2;
		};
		Paper.prototype.getRadius = function () {
			var minArea = 500;
			var maxArea = 10000;
			var area = p.map(this.citations, this.minCitations, this.maxCitations, minArea, maxArea);
			var radius = p.sqrt(area / p.PI);
			return radius;
		};
		Paper.prototype.drawShape = function (previousPaper) {
			var radius = this.getRadius();
			switch (this.displayMode) {
				case DisplayMode.NORMAL:
					p.fill(this.color);
					break;
				case DisplayMode.GRAYED:
					p.fill(this.gray);
					break;
				case DisplayMode.HIGHLIGHTED:
					p.fill(this.color);
					break;
			}
			p.strokeWeight(0);
			p.ellipse(this.x, this.y, radius);
			var yearSize = 12;
			var textColor = this.displayMode == DisplayMode.GRAYED ? this.gray : p.color(0);
			if (previousPaper !== undefined && this.x < previousPaper.x)
				textWithBackground(this.year.toString(), yearSize, this.x - radius / 2 - 10, this.y, p.RIGHT, p.CENTER, textColor);
			else
				textWithBackground(this.year.toString(), yearSize, this.x + radius / 2 + 10, this.y, p.LEFT, p.CENTER, textColor);
		};
		Paper.prototype.drawConnection = function (previousPaper) {
			if (previousPaper !== undefined) {
				p.strokeWeight(1);
				switch (this.displayMode) {
					case DisplayMode.NORMAL:
						if (previousPaper.displayMode != DisplayMode.GRAYED)
							p.stroke(this.color);
						else
							p.stroke(this.gray);
						break;
					case DisplayMode.GRAYED:
						p.stroke(this.gray);
						break;
					case DisplayMode.HIGHLIGHTED:
						if (previousPaper.displayMode != DisplayMode.GRAYED)
							p.stroke(this.color);
						else
							p.stroke(this.gray);
						break;
				}
				p.line(this.x, this.y, previousPaper.x, previousPaper.y);
			}
		};
		Paper.prototype.drawTitle = function () {
			if (this.displayMode == DisplayMode.HIGHLIGHTED) {
				var titleText = this.title + ' (' + this.citations + ' citations)';
				textWithBackground(titleText, 12, this.x, this.y - this.getRadius() / 2 - 10, p.CENTER, p.BOTTOM, this.color);
			}
		};
		return Paper;
	}());

	function drawTitle(author, x, y) {
		textWithBackground(author, 20, x, y, p.CENTER, p.CENTER, p.color(0));
	}
	function dashedLine(x1, y1, x2, y2) {
		var distance = p.sqrt(p.pow(x1 - x2, 2) + p.pow(y1 - y2, 2));
		var nbPoints = distance / 2;
		var increment = 1 / nbPoints;
		for (var n = 0; n < 1; n += increment * 2) {
			var lineX1 = p.lerp(x1, x2, n);
			var lineY1 = p.lerp(y1, y2, n);
			var lineX2 = p.lerp(x1, x2, n + increment);
			var lineY2 = p.lerp(y1, y2, n + increment);
			p.line(lineX1, lineY1, lineX2, lineY2);
		}
	}
	function textWithBackground(textToDisplay, size, x, y, hAlign, vAlign, color) {
		p.textAlign(hAlign, vAlign);
		p.strokeWeight(0);
		p.textSize(size);
		var textW = p.textWidth(textToDisplay);
		var rectX = x;
		switch (hAlign) {
			case p.CENTER:
				rectX -= textW / 2;
				break;
			case p.RIGHT:
				rectX -= textW;
				break;
		}
		var rectY = y;
		switch (vAlign) {
			case p.CENTER:
				rectY -= size / 2;
				break;
			case p.BOTTOM:
				rectY -= size;
				break;
		}
		p.fill(255);
		p.rect(rectX, rectY, textW, size);
		p.fill(color);
		p.text(textToDisplay, x, y);
	}
}




var myp5 = new p5(s, 'canvas');
var myp52 = new p5(t, 'canvas2');
function updateSketchs(author) {
	console.log(myp5);
	myp5.updateSketch(author);
}