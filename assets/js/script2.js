const cancelBtn = document.getElementById("cancel");

// switch to the options page, either on profile or settings
function changePage() {
    console.log("HELP")
    history.back();
}

cancelBtn.addEventListener("click", changePage);