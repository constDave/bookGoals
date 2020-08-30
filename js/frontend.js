const form = document.querySelector("form");
const formBookTitle = document.querySelector("#bookTitle");
const formWordGoals = document.querySelector("#wordGoals");
const formDeadline = document.querySelector("#deadline");
const booksDiv = document.querySelector("#books");

const serverUrl = "http://localhost:3000/addbook";

form.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(form);
  const bookTitle = formData.get("bookTitle");
  const wordGoals = formData.get("wordGoals");
  const deadline = formData.get("deadline");

  if (formBookTitle.value === "" || formWordGoals.value === "") {
    alert("Fields are required.");
  }

  const bookEntry = {
    bookTitle,
    wordGoals,
    deadline: new Date(deadline)
  };

  async function postData(url, data = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  postData(serverUrl, bookEntry)
    .then(data => console.log(data))
    .catch(error => console.error(error));

  console.log(bookEntry);
  formBookTitle.value = "";
  formWordGoals.value = "";
  document.querySelector("#books").innerHTML = "";
  getBooks(serverUrl);
});

async function getBooks(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    const bookEntries = Array.from(data);
    createElements(bookEntries);
  } catch (error) {
    console.log(error);
  }
}

function createElements(data) {
  data.forEach(book => {
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const wordsToComplete = document.createElement("div");
    const dateDue = document.createElement("div");
    const row = document.createElement('div')
    row.classList.add('row')
    dateDue.classList.add("col-md-6");
    dateDue.innerHTML = `Your deadline: ${book.deadline}`;
    wordsToComplete.classList.add("col-md-6");
    wordsToComplete.innerHTML = `Total Words Goal: ${book.wordgoals}`;
    row.appendChild(wordsToComplete)
    card.classList.add("card");
    cardBody.classList.add("card-body");
    let cardTitle = document.createElement("h4");
    cardTitle.classList.add("text-center");
    cardTitle.classList.add("mb-4");
    cardTitle.innerHTML = `${book.booktitle}`;
    cardBody.appendChild(cardTitle);
    //cardBody.appendChild(wordsToComplete);
    cardBody.appendChild(row)
    if (book.deadline !== null) {
      row.appendChild(dateDue);
    }
    console.log(wordsToComplete);

    card.appendChild(cardBody);
    booksDiv.appendChild(card);
  });
}

getBooks(serverUrl);
