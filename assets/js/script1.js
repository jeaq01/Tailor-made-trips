const profileBtn = document.getElementById("profile");

// switch to the options page, either on profile or settings
function changePage() {
    document.location.replace("options.html");
}
profileBtn.addEventListener("click", changePage);