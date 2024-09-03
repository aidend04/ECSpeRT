window.onload = function () {
    fetch('/admin/user-panel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let verifiedDiv = document.getElementById('verified');
            let unverifiedDiv = document.getElementById('unverified');

            let ranks = [];

            data.forEach(user => {
                
                const [email, name, status] = user;
                ranks.push(user[3]);
                const addElem = createUser(name, email, status);

                if (status === 'await') {
                    unverifiedDiv.innerHTML += addElem;
                } else {
                    verifiedDiv.innerHTML += addElem;
                }
            });

            let count = ranks.length;
            let count2 = 0;
            Array.from(document.getElementById('verified').getElementsByClassName
            ('addRank')).forEach(div => {

                console.log(div);
                let selectorDiv = document.createElement('div');
                selectorDiv.innerHTML = `<select class="rankSel">
                <option value="observer">
                    Observer
                </option>
                <option value="mfr">
                    MFR
                </option>
                <option value="mfr2">
                    MFR II
                </option>
                </select>`;
                let nameDiv = div.querySelector('#nameDiv'); 
                if (nameDiv) {
                    nameDiv.insertAdjacentElement('afterend', selectorDiv);
                }
            });

            const rankElements = Array.from(document.getElementsByClassName('rankSel'));
            console.log('rankSel elements found:', rankElements.length);

            rankElements.forEach(rank => {
                rank.value = ranks[count2];
                count2++;
            })

            rankElements.forEach(rank => {
                console.log('Attaching event listener to:', rank);
                rank.addEventListener('change', function () {
                    fetch('/admin/rank-change', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email: rank.parentElement.parentElement.id, rankSet: rank.value})
                    })
                    .then(response => response.json())
                    .then(data => {
                        
                    })
                });
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
};






function createUser(name, email, status) {

    if (status === 'await'){
        status = 'Unverified';
    } else {
        status = 'Verified';
    }
    const isVerified = status === 'Verified';
    const statusClass = isVerified ? 'text-green-500' : 'text-red-500';
    const statusSymbol = isVerified ? '&#10003;' : '&#10007;';

    if (status === 'Unverified'){
        return `
        <div id=${email} class="grid grid-cols-4 gap-4 items-center p-2 border-b border-gray-200">
            <div id="nameDiv" class="truncate">${name}</div>
            <div class="truncate">${email}</div>
            <button onclick="verify('${email}')" class="verify ${statusClass} font-semibold">${statusSymbol} ${status}</button>
        <button onclick="remove('${email}')" id=${email + 'rmv'} class="remove-btn text-red-500 hover:text-red-700">
                Remove
            </button>
        </div>
    `;
    } else {
        return `
        <div id=${email} class="addRank grid grid-cols-5 gap-4 items-center p-2 border-b border-gray-200">
            <div id="nameDiv" class="truncate">${name}</div>
            <div class="truncate">${email}</div>
            <button class="verify ${statusClass} font-semibold">${statusSymbol} ${status}</button>
        <button onclick="remove('${email}')" id=${email + 'rmv'} class="remove-btn text-red-500 hover:text-red-700">
                Remove
            </button>
        </div>
        `;
    }

}



function remove(email){
    if (confirm('This action is NOT reversible, click OK to confirm the removal of this user')) {
        fetch('/admin/user-panel', {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message)
            if (data.message === 'all good'){
                window.location.reload();
            } else {
                alert('unable to remove, server error.')
            }
        })
    }
}

function verify(email){
    if (confirm('This will give this user access to ECSpeRT, proceed with caution.')) {
        fetch('/admin/user-verify',
            {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ email: email })
            }
        )
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            if (data.message === 'all good'){
                window.location.reload();
            } else {
                alert('Verification Failed');
            }
        })
    }
}
