window.onload = function() {
    fetch('/data/get-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
        
    }).then(response => response.json())
    .then(data => {
        if (data.form !== 'no form'){
            document.getElementById('overnight').innerHTML = data.form;
            let submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {

                submitBtn.onclick = function (event) {

                    let temp = [];

                    event.preventDefault(); // Prevents the default form submission

                    let selected = document.querySelectorAll('[id^="available-"]');


                    let selArr = Array.from(selected);

                    selArr.forEach(element => {
                        if (element.checked === true){
                            temp.push('available');
                        } else {
                            temp.push('unavailable');
                        }
                    });

                    console.log(temp);

                    confirm('Are you sure you are ready to submit?');

                    fetch('/data/sendAvail', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ avail: temp })
                    }).then(response => response.json())
                    .then(data => {

                        if (data.message === 'good'){
                            alert('sent!');
                            window.location.reload();
                        } else {
                            alert('error sending, please try again');
                        }

                    }).catch(error => {
                        alert('please try again');
                    })
                }
            }
        }
    });
}
