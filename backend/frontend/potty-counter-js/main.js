const peeCountDisplayID = "daily-pee-display";
const poopCountDisplayID = "daily-poop-display";
const poopButtonID = "poop-button";
const peeButtonID = "pee-button";

const poopButton = document.getElementById(poopButtonID);
const poopDisplay = document.getElementById(poopCountDisplayID);

const peeButton = document.getElementById(peeButtonID);
const peeDisplay = document.getElementById(peeCountDisplayID);



fetch("http://10.0.0.35:7300/poop")
  .then((response) => response.json())
  .then((data) => {
    poopDisplay.textContent = data.poopCount;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

fetch("http://10.0.0.35:7300/pee")
  .then((response) => response.json())
  .then((data) => {
    peeDisplay.textContent = data.peeCount;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

poopButton.onclick = (e) => {
  const feedDate = new Date();
  fetch("http://10.0.0.35:7300/poop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ time: feedDate.getTime() }),
  })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  poopDisplay.textContent = Number(poopDisplay.textContent) + 1 + "";
  //   console.log("timer updated");
};

peeButton.onclick = (e) => {
  const feedDate = new Date();
  fetch("http://10.0.0.35:7300/pee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ time: feedDate.getTime() }),
  })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  peeDisplay.textContent = Number(peeDisplay.textContent) + 1;
  //   console.log("timer updated");
};


