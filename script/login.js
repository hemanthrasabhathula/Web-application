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
          localStorage.setItem("user_data", JSON.stringify(data.user_data));
          window.location.href = "/dashboard";
        } else {
          document.getElementById("message").innerText = data.message;
        }
      });
  });
