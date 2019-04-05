var w = 1300;
var h = 1000;

function preload() {
	allPaper = loadTable("data/IEEE VIS papers 1990-2018 - Main dataset.csv", "csv", "header");
	cleanedData = loadTable("data/authors-affiliations-cleaned-March-25-2019.csv", "csv", "header");
}

function setup() {
  // put setup code here
  createCanvas(w, h);
  background(210);
  authorData = cleanedData.findRows('Lambertus Hesselink', 'AuthorNames-Deduped');
  affiliationList = orderByAffiliation(authorData);
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