function setupAuthor(authorData, allPaper) {
    var papers = getAllPaper(authorData, allPaper);
    let authorName = document.getElementById('author-name');
    authorName.innerHTML = "Alex T. Pang";
    let authorDiv = document.getElementById('author');
    console.log(papers);
    for (let i = 0; i < papers.length; i++) {
        let title = document.createElement("h2");
        title.innerHTML = papers[i].get("Title");
        authorDiv.appendChild(title);
        let abstract = document.createElement("p");
        abstract.innerHTML = papers[i].get("Abstract");
        authorDiv.appendChild(abstract);
    }
}

function getAllPaper(datas, allPaper) {
    var list = [];
    for (var i = 0; i < datas.length; i++) {
        var paper = allPaper.findRow(datas[i].get("DOI"), "DOI");
        list.push(paper);
    }
    return list;
}

function updateAuthorDatas(author) {
    var papers = getAllPaper(authorData, allPaper);
    let authorName = document.getElementById('author-name');
    authorName.innerHTML = author;
    let authorDiv = document.getElementById('author');
    while (authorDiv.firstChild) {
        authorDiv.removeChild(authorDiv.firstChild);
    }
    authorDiv.appendChild(authorName);
    for (let i = 0; i < papers.length; i++) {
        let title = document.createElement("h2");
        title.innerHTML = papers[i].get("Title");
        authorDiv.appendChild(title);
        let abstract = document.createElement("p");
        abstract.innerHTML = papers[i].get("Abstract");
        authorDiv.appendChild(abstract);
    }
}