var w = 1300;
var h = 1000;
let angles = [];
let colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];

function preload() {
	allPaper = loadTable("data/IEEE VIS papers 1990-2018 - Main dataset.csv", "csv", "header");
	cleanedData = loadTable("data/authors-affiliations-cleaned-March-25-2019.csv", "csv", "header");
}

function setup() {
  // put setup code here
  createCanvas(w, h);
  background(210);
  authorData = cleanedData.findRows('Alex T. Pang', 'AuthorNames-Deduped');
  keywordCount = getKeywordsCount(authorData);
  
  const mapSort1 = new Map([...keywordCount.entries()].sort((a, b) => b[1] - a[1]));
  console.log(mapSort1);
  
  sum = 0;
  var i = 0;
  var iterator1 = mapSort1.entries();
  while(i < 20 && i < mapSort1.size) {
	sum += iterator1.next().value[1];
	i++;
  }
  
  console.log(sum);
  
  i = 0;
  iterator1 = mapSort1.entries();
  while(i < 20 && i < mapSort1.size) {
	angles.push(+iterator1.next().value[1] / sum * 200);
	i++;
  }
  /*mapSort1.forEach((value, key) => {
	  sum += value;
  });
  
  mapSort1.forEach((value, key) => {
	  angles.push(value/sum * 360);
  });*/
  console.log(angles);
}

function getKeywordsCount(datas) {
	var map1 = new Map();
	
	for(var i = 0; i < datas.length; i++)
	{
		paper = allPaper.findRow(datas[i].get("DOI"), "DOI");
		keywordList = paper.get("AuthorKeywords").split(",");
		for(var j = 0; j < keywordList.length; j++) {
			if(map1.get(keywordList[j].trim()) == undefined && keywordList[j].trim() != ""){
				map1.set(keywordList[j].trim(), 1);
			} else if(keywordList[j].trim() != ""){
				map1.set(keywordList[j].trim(), map1.get(keywordList[j].trim()) + 1);
			}
		}
	}
	
	return map1;
}

function draw() {
  background(100);
  pieChart(300, angles);
}

function pieChart(diameter, data) {
  let lastAngle = 0;
  for (let i = 0; i < data.length; i++) {
    let color = colors[i];
    noFill();
	stroke(color);
	strokeWeight(16);
    arc(
      width / 2,
      height / 2,
      diameter,
      diameter,
      lastAngle,
      lastAngle + radians(angles[i]),
	  OPEN
    );
    lastAngle += radians(angles[i]) + radians(8);
  }
}

function mouseMoved() {
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  if( d <= 300 && d >= 284) {
	  textSize(32);
			fill(0, 102, 153);
	 text( "coucou", width / 2, height / 2);
  }
}

function drawText(x, y, text) {
	textSize(32);
	fill(0, 102, 153);
	text(text, x, y);
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
	for(var i = 0; i < datas.length; i++)
	{
		if(datas[i].get("AuthorAffiliation") == result[cpt].affiliation) {
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
	
	
	console.log(result);
	return result;
}