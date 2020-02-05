const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL = "http://localhost:5000/shouts"
const shoutsElement = document.querySelector('.shouts');


loadingElement.style.display = "";

getAllShouts();

form.addEventListener('submit',(event) =>{
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    

    const shout = {
        name,
        content
    };
    
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method:'POST',
        body:JSON.stringify(shout),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response =>response.json())
    .then(createdShout =>{
        form.reset();
        setTimeout(()=>{
            form.style.display='';

        }, 20000);
        getAllShouts();

    });
});

function getAllShouts(){
    shoutsElement.innerHTML = '';

    fetch(API_URL)
    .then(response =>response.json())
    .then(shouts => {
        shouts.reverse();
        shouts.forEach(shout => {

            const div = document.createElement('div');
            const header = document.createElement('h3');
            header.textContent = shout.name;

            const contents = document.createElement('p');
            contents.textContent = shout.content;

            const date = document.createElement('small');
            date.textContent = new Date(shout.created);

            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date);

            shoutsElement.appendChild(div);
        });
        loadingElement.style.display='none';
    });
}