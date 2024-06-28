let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) ?? [];

//const searchElement = document.getElementById("search-list");
const recentButton = document.getElementById('search-button');
const inputBox = document.getElementsByClassName('tt-search-box-input');

function addRecentSearch(search) {
    recentSearches.push(search); // push adds to end
    if (recentSearches.length > 5) recentSearches.shift(); // shift gets rid of first
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    //console.log(localStorage.getItem('recentSearches'));
}

// function that takes an html <ul> and fills it <li> elements
// function fillList(element) {
//     recentSearches.forEach(item => {
//         const ulItem = document.createElement('ul');
//         ulItem.textContent = item;
//         element.appendChild(ulItem);
//         console.log("Put " + item + " into " + element);
//     });
// }

recentButton.addEventListener('click', function() {
    inputBox.textContent('testing');
    console.log('testing');
})
