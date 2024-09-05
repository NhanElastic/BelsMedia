


function greeting(user){
    const greeting = document.getElementById('homeDiv');
    greeting.innerHTML = `<h1>Welcome ${user}!</h1>`;
}

async function fetchUserData(){
    const token = localStorage.getItem('accesstoken');
    console.log(`Bearer ${token}`);


    if(token === undefined){
        window.location.href = '/auth/login.html';
        return;
    }

    
    fetch('http://localhost:8000/api/auth/profile', {
        method: 'Get',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if(response.status === 401){
            window.location.href = 'auth/login.html';
        }
        return response.json();
    })
    .then(data => {
        if(data.username !== undefined){
            greeting(data.username);
        }

    })
    .catch(error => {
        console.error('Error:', error);
    });
    

    

}

fetchUserData();