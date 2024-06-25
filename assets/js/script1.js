const profileBtn = document.getElementById("profile");

// switch to the options page, either on profile or settings
function changePage() {
    window.location.assign("file:///C:/Users/origi/bootcamp/Tailor-made-trips/options.html")
}

profileBtn.addEventListener("click", changePage);