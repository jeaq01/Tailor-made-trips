let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) ?? [];
let favoriteSearches = JSON.parse(localStorage.getItem("favoriteSearches")) ?? [];

function addRecentSearch(item) {
    recentSearches.push(item);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    console.log('Added \"' + item + '\" to: ' + localStorage.getItem("recentSearches"));
}

function addFavoriteSearch(item) {
    favoriteSearches.push(item);
    localStorage.setItem("favoriteSearches", JSON.stringify(favoriteSearches));
    console.log('Added \"' + item + '\" to: ' + localStorage.getItem("favoriteSearches"));
}

// Added for testing purposes. These functions are built for easy compatibility
document.addEventListener('keydown', function(event) {
    switch (event.code) {
        case 'KeyE':
            console.log("E ");
            addRecentSearch("testing testing 123");
            break;
        case 'KeyQ':
            console.log('Q');
            addFavoriteSearch("testing testing 123");
            break;
    }
});