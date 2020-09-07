const form = document.querySelector("form");
const formBookTitle = document.querySelector("#bookTitle");
const formWordGoals = document.querySelector("#wordGoals");
const formDeadline = document.querySelector("#deadline");
const booksDiv = document.querySelector("#books");
const bookSubmissions = document.querySelector("#book-submissions");

//icon.nextElementSibling.firstElementChild.innerText

const serverUrl = "http://localhost:3000/addbook";
const deleteUrl = "http://localhost:3000/deletebook";

// FORM LISTENER
form.addEventListener("submit", e => {
  e.preventDefault();
  // Get the form data from form fields
  const formData = new FormData(form);
  const bookTitle = formData.get("bookTitle");
  const wordGoals = formData.get("wordGoals");
  const deadline = formData.get("deadline");

  // If the fields are empty alert they are required
  if (formBookTitle.value === "" || formWordGoals.value === "") {
    alert("Fields are required.");
  }

  // Create an object of the fields data to send in the API request
  const bookEntry = {
    bookTitle,
    wordGoals,
    deadline: new Date(deadline)
  };

  // Post function to call to send data
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

  // Call the Post data to the server URL sending the object created from the form fields
  postData(serverUrl, bookEntry)
    .then(data => console.log(data))
    .catch(error => console.error(error));

  //Clear the fields after submission
  formBookTitle.value = "";
  formWordGoals.value = "";
  document.querySelector("#books").innerHTML = "";
  // Get the new books that were just submitted
  setTimeout(() => {
    getBooks(serverUrl);
  }, 0300);
  applyDeleteIcons();
});

// function to getbooks from the API
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
    } else {
      bookSubmissions.style.visibility = "hidden";
    }
  } catch (error) {
    console.log(error);
  }
}

// Function needed to find out how many days left from a deadline
function daysDifference(date) {
  const oneDay = 24 * 60 * 60 * 1000; // numerical value for one day to be used to count difference for deadlines
  const dueDate = new Date(date);
  const currentDate = new Date(Date.now());
  const daysLeft = Math.round(Math.abs((dueDate - currentDate) / oneDay));
  return daysLeft;
}

// Function to create all the elements of the Card after submission
function createElements(data) {
  data.forEach(book => {
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const wordsToComplete = document.createElement("div");
    const dateDue = document.createElement("div");
    const row = document.createElement("div");
    const deleteIcon = document.createElement("a");
    let cardTitle = document.createElement("h1");
    const wordsCompleted = document.createElement("div");
    const daysUntilDue = document.createElement("div");
    daysUntilDue.innerHTML = `<h5>Days left: ${daysDifference(
      book.deadline
    )} </h5>`;

    let currentWords = 0;

    wordsCompleted.innerHTML = `<h5>Words completed: ${currentWords}</h5> <a href="#">Update words completed</a>`;
    wordsCompleted.classList.add("col-md-4");
    row.appendChild(wordsCompleted);

    deleteIcon.innerHTML = "Delete entry";
    deleteIcon.classList.add("delete-icon");
    deleteIcon.classList.add("p-2");
    deleteIcon.style.color = "red";
    deleteIcon.style.visibility = "hidden";

    dateDue.classList.add("col-md-4");
    dateDue.classList.add("text-center");
    dateDue.classList.add("deadlineDate");
    dateDue.innerHTML = `<h5>Deadline: ${book.deadline}</h5>`;
    // Gather the deadlines and format them to be nicer to read
    setTimeout(() => {
      const deadlineDate = Array.from(
        document.querySelectorAll(".deadlineDate")
      );

      deadlineDate.forEach(date => {
        date.innerText = date.innerText.slice(0, 20);
      });
    }, 500);

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
      cardBody.appendChild(daysUntilDue);
    }
    card.appendChild(deleteIcon);

    card.appendChild(cardBody);
    booksDiv.appendChild(card);

    card.addEventListener("mouseover", () => {
      deleteIcon.style.visibility = "visible";
    });

    card.addEventListener("mouseout", () => {
      deleteIcon.style.visibility = "hidden";
    });
  });
}

getBooks(serverUrl);

async function deletePost(url, data = {}) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

function applyDeleteIcons() {
  setTimeout(() => {
    const deleteIcons = document.querySelectorAll(".delete-icon");
    console.log(deleteIcons);
    deleteIcons.forEach(icon => {
      icon.addEventListener("click", function(event) {
        confirm("Are you sure you want to delete this entry?");
        console.log(
          event.target.nextElementSibling.firstElementChild.innerText
        );
        const cardName = event.target.nextElementSibling.firstElementChild.innerText.toLowerCase();
        const deleteName = {
          name: cardName
        };
        deletePost(deleteUrl, deleteName);
        this.parentElement.remove();

        setTimeout(() => {
          if (!document.querySelector(".card")) {
            document.querySelector("#book-submissions").remove();
          }
        }, 0300);
      });
    });
  }, 1000);
}

applyDeleteIcons();
