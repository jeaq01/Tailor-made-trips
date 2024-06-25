let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) ?? [];
let favoriteSearches = JSON.parse(localStorage.getItem("favoriteSearches")) ?? [];

const cancelBtn = document.getElementById("cancel");

const searchList = document.getElementById("search-list");
const favoriteList = document.getElementById("favorite-list");

// switch to the options page, either on profile or settings
function changePage() {
    console.log("HELP")
    history.back();
}

cancelBtn.addEventListener("click", changePage);

function OnAwake() {
    // cut size of the list if it is too big! Might move this to somewhere else, doesn't feel efficient here.
    let recentSize = recentSearches.length;
    if (recentSize > 5) {
        recentSearches = recentSearches.slice(recentSize-5, recentSize);
    }
    recentSearches.forEach(element => {
        let item = document.createElement('ul');
        item.textContent = element;
        searchList.appendChild(item);
    });

    let favoriteSize = favoriteSearches.length;
    if (favoriteSize > 5) {
        favoriteSearches = favoriteSearches.slice(favoriteSize-5, favoriteSize);
    }
    favoriteSearches.forEach(element => {
        let item = document.createElement('ul');
        item.textContent = element;
        favoriteList.appendChild(item);
    });
}
OnAwake();