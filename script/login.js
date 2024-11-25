document.addEventListener("DOMContentLoaded", function () {
  // Clear localStorage when the login page loads
  localStorage.clear();
});

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    console.log(formData);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    fetch("/login", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          const userData = data.user_data;
          localStorage.setItem("user_data", JSON.stringify(userData));
          if (userData.type === "admin") {
            window.location.href = "/admindashboard";
          } else {
            window.location.href = "/dashboard";
          }
        } else {
          document.getElementById("message").innerText = data.message;
        }
      });
  });
