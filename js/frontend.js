

const form = document.querySelector('form')
const serverUrl = 'http://localhost:3000/addbook'


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)    
    const bookTitle = formData.get('bookTitle')
    const wordGoals = formData.get('wordGoals')
    const deadline = formData.get('deadline')
    
    const bookEntry = {
        bookTitle,
        wordGoals,
        deadline
    }
 
    async function postData(url, data = {}){
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response.json()
    }

    postData(serverUrl, bookEntry)
    .then(data => console.log(data)
    ).catch(error => console.error(error)
    )

    console.log(bookEntry);
    


    
})
