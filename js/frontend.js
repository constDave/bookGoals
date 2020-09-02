const form = document.querySelector("form");
const formBookTitle = document.querySelector("#bookTitle");
const formWordGoals = document.querySelector("#wordGoals");
const formDeadline = document.querySelector("#deadline");
const booksDiv = document.querySelector("#books");
const bookSubmissions = document.querySelector("#book-submissions");

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
  setTimeout(() => {
    getBooks(serverUrl);
  }, 0300);
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
    if (bookEntries.length > 0) {
      createElements(bookEntries);
      bookSubmissions.style.visibility = "visible";
    } 
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
    const row = document.createElement("div");
    const deleteIcon = document.createElement("a");
    let cardTitle = document.createElement("h2");
    const wordsCompleted = document.createElement('div')
    let currentWords = 0;
    
    wordsCompleted.innerHTML = `<h5>Words completed: ${currentWords}</h5> <a href="#">Update words completed</a>`
    wordsCompleted.classList.add('col-md-4')
    row.appendChild(wordsCompleted)
    

    deleteIcon.innerHTML = "Delete entry";
    deleteIcon.classList.add("delete-icon");
    deleteIcon.classList.add("p-2");
    deleteIcon.style.color = "red";
    deleteIcon.style.visibility = 'hidden'

    dateDue.classList.add("col-md-4");
    dateDue.classList.add("text-center");
    dateDue.innerHTML = `<h5>Deadline: ${book.deadline} </h5>`;

    wordsToComplete.classList.add("col-md-4");
    wordsToComplete.classList.add("text-center");
    wordsToComplete.innerHTML = `<h5>Words Goal: ${book.wordgoals} </h5>`;

    row.classList.add("row");
    row.appendChild(wordsToComplete);

    card.classList.add("card");
    cardBody.classList.add("card-body");

    cardTitle.classList.add("text-center");
    cardTitle.classList.add("mb-3");
    cardTitle.innerHTML = `${book.booktitle}`;
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(row);
    if (book.deadline !== null) {
      row.appendChild(dateDue);
    }
    card.appendChild(deleteIcon);

    card.appendChild(cardBody);
    booksDiv.appendChild(card);

    card.addEventListener('mouseover', () => {
      deleteIcon.style.visibility = 'visible'
    })

    card.addEventListener('mouseout', () => {
      deleteIcon.style.visibility = 'hidden'
    })
  });
}

getBooks(serverUrl);
