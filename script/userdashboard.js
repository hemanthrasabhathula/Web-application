document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("user_data"));
  if (userData) {
    document.getElementById("user-name").textContent = userData.firstname;
    document.getElementById("profile-letter").textContent = userData.firstname
      .charAt(0)
      .toUpperCase();
  }
});

const profileIcon = document.getElementById("profile-icon");
const profileUpload = document.getElementById("profile-upload");
const profileLetter = document.getElementById("profile-letter");

// Event listener for clicking on the profile icon to upload a picture
profileIcon.addEventListener("click", () => {
  profileUpload.click();
});

// Event listener for handling the file upload
profileUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileIcon.style.backgroundImage = `url(${e.target.result})`;
      profileLetter.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});
