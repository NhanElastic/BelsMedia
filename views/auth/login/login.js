const { response } = require("express");

function submitForm(){
    const formData = new FormData(document.getElementById('loginForm'));
    const data = Object.fromEntries(formData);

    const apiUrl = 'http://localhost:8000/login';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if(response.status !== 200){
            throw new Error('Wrong username or password');
        }
        return response.json();
    })
    .then(jsonData => {
        console.log(jsonData);
    })
    .catch(error => {
        console.error(error);
    });

}