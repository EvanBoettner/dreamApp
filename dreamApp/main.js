import "./style.css";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  showSpinner();
  e.preventDefault(); //When a form is submitted it refreshes the entire page, we want to prevent that

  const data = new FormData(form); //We want to extract the data from the form so we instantiate a new FormData object using the form as the input
  //This will provide us with a data structure that behaves like a javascript map

  const response = await fetch("http://localhost:8080/dream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //since we are using a jsonAPI we want a header declaring that
    },
    body: JSON.stringify({
      //We are wrapping it in JSON.stringify in order to convert it into a string
      prompt: data.get("prompt"), //we are grabbing the prompt from the form using the get method
    }),
  });

  if (response.ok) {
    const { image } = await response.json(); //We are accessing the image by awaiting the response.json()

    const result = document.querySelector("#result");
    result.innerHTML = `<img src="${image}" width="512" />`; //Here we are inserting the image url recieved from the api
  } else {
    const err = await response.text();
    alert(err);
    console.error(err);
  }

  hideSpinner();
});

function showSpinner() {
  const button = document.querySelector("button");
  button.disabled = true; //While the api is loading we don't want users sending multiple forms so we disable the button
  button.innerHTML = 'Dreaming... <span class="spinner">🧠</span>';
}

function hideSpinner() {
  const button = document.querySelector("button");
  button.disabled = false;
  button.innerHTML = "Dream";
}
