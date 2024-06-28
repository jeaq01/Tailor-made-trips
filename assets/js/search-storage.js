let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) ?? [];

//const searchElement = document.getElementById("search-list");
const recentButton = document.getElementById('recent-button');
const inputBox = document.getElementsByClassName('tt-search-box-input-container');

function addRecentSearch(search) {
    recentSearches.push(search); // push adds to end
    if (recentSearches.length > 5) recentSearches.shift(); // shift gets rid of first
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    console.log(localStorage.getItem('recentSearches'));
}

recentButton.addEventListener('click', function() {
    let content = "";
    console.log(recentSearches);
    recentSearches.forEach(element => {
        content += "\"" + element + "\", ";
    });
    alert(content);
})
