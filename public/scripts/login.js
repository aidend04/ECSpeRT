document.querySelector('form').addEventListener('submit', 
    function (event) {
        
        event.preventDefault();
        let emailInput = document.getElementById('email').value;
        let passwordInput = document.getElementById('password').value;

        if (emailInput === 'admin'){
            
            fetch('/login/adm', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({email: emailInput, password: passwordInput})
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'user found') {
                    window.location.href = '/admin'
                } else if (data.message === 'wrong pass') {
                    alert('the password does not match the records, try again');
                    return;
                }
                else {
                    alert('this email is not registered, please try again or register today.')
                    return;
                }
            })
            .catch(error => {
                console.log(error.message);
            })

        } else {
            
            fetch('/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: 
                    JSON.stringify({email: emailInput, password: passwordInput})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                if (data.message === 'user found'){
                    window.location.href = '/user-home'
                } else if (data.message === 'wrong pass') {
                    alert('the password does not match the records, try again');
                    return;
                }
                else {
                    alert('this email is not registered, please try again or register today.')
                    return;
                }
            })
            .catch(error => {
                console.log(error.message)
            })
        
        }
    }
        
)