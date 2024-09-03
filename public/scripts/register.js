document.querySelector('form').addEventListener('submit', function (event){
    event.preventDefault();

    console.log('hellothree')

    let emailInput = document.getElementById('email').value;
    let nameInput = document.getElementById('name').value;
    let passwordInput = document.getElementById('password').value;
    let passComp = document.getElementById('password2').value;

    if (passwordInput !== passComp){
        alert('Passwords do not match')
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({ email: emailInput, password: passwordInput, name: nameInput })
    })
        .then(response => response.json())
        .then(data => {

            console.log(data.message);

            if (data.message === 'user registered') {
                window.location.href = '/user-home'
            }

            else if (data.message.includes('E11000')) {
                alert('user with this email already exists')
                window.location.reload()
                return;
            }

            else if (data.message === 'user exists'){
                alert('user with this email already exists')
                window.location.reload()
                return;
            }

            else {
                alert('unknown error, please try again')
                window.location.reload();
                return;
            }
        })
        .catch(error => {
            console.log(error.message)
        })
})
