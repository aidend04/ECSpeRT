
let userAssigned = {
    "Monday": {
        "8-11": [],
        "11-14": [],
        "14-18": [],
        "18-22": []
    },
    "Tuesday": {
        "8-11": [],
        "11-14": [],
        "14-18": [],
        "18-22": []
    },
    "Wednesday": {
        "8-11": [],
        "11-14": [],
        "14-18": [],
        "18-22": []
    },
    "Thursday": {
        "8-11": [],
        "11-14": [],
        "14-18": [],
        "18-22": []
    },
    "Friday": {
        "8-11": [],
        "11-14": [],
        "14-18": [],
        "18-22": []
    }
};

function showMiniChart(time, day) {
    const userList = document.getElementById('user-list');
    const slotTitle = document.getElementById('slot-title');
    const filteredDiv = document.getElementById('filtered');
    const allDiv = document.querySelector('#edit-section .rounded.border.p-2');

    // Update the slot info header
    slotTitle.textContent = `Selected Slot: ${day} ${time}`;

    userList.innerHTML = ''; // Clear previous list
    filteredDiv.innerHTML = ''; // Clear filtered section
    allDiv.innerHTML = ''; // Clear all section
        
    switch (time) {
        case '08:00-11:00':
            time = '8-11';
            break;
        case '11:00-14:00':
            time = '11-14';
            break;
        case '14:00-18:00':
            time = '14-18';
            break;
        case '18:00-22:00':
            time = '18-22';
            break;
    }

    userAssigned[day][time].forEach(element => {
        filteredDiv.appendChild(element)
    });

    let filteredDivr = document.getElementById('filtered');
    let allDivr = document.getElementById('allDiv');

    let filteredDivs = Array.from(filteredDivr.getElementsByTagName('div'));

    let allDivs = Array.from(allDivr.getElementsByTagName('div'))

    filteredDivs = filteredDivs.filter(elm => !elm.id.includes('tooltip') && elm.id !== 'freeSlots');

    allDivs = allDivs.filter(elm => !elm.id.includes('tooltip') && elm.id !== 'freeSlots');

    console.log(allDivs);

    filteredDivs.forEach(elm => {
        elm.style.backgroundColor = '#F3F4F6';
    })

    allDivs.forEach(elm => {
        elm.style.backgroundColor = '#F3F4F6';
    })


    addClicks(time);

    let usersInSlot = document.getElementById(`${day.substring(0, 3).toLowerCase()}:${time}`);

    let arrOfUsers = Array.from(usersInSlot.querySelectorAll('li'));

    arrOfUsers.forEach(elm => {
        let name = elm.textContent.substring(0, elm.textContent.indexOf('('));

        let div = document.createElement('div');

        time = document.getElementById('selected-slot-info').textContent;

        time = time.substring(time.length - 17);
        
        div.innerHTML = `
                    <div id="${name.trim() + 'add'}" class="added flex items-center space-x-2 p-2 bg-gray-100 rounded-md">
                        <span class="text-gray-800 text-sm font-medium" id="user-name">${name.trim()}</span>
                        <input 
                            type="text" 
                            value="${time}" 
                            class="border border-gray-300 rounded-md p-1 text-sm w-24 focus:ring-2 focus:ring-blue-500" 
                            id="time-slot"
                        />
                        <button onclick="removeDiv('${name.trim() + 'add'}')"
                            class="bg-red-500 text-white text-sm rounded-md px-3 py-1 hover:bg-red-600 transition"
                            id="remove-button"
                        >
                            Remove
                        </button>
                    </div>
                `;

        userList.appendChild(div);

        let findFiltered = document.getElementById(`${name.trim()} copied`);

        if (findFiltered) {
            findFiltered.style.backgroundColor = '#505050';
        }

        let findAll = document.getElementById(name.trim());

        findAll.style.backgroundColor = '#505050';

    })

    console.log(time)
}

window.onload = function () {
    
    fetch('/data/get-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const userAssignmentsByTimeAndDay = data.data;
            console.log(userAssignmentsByTimeAndDay);

            const allUser = document.getElementById('allDiv');

            for (let day in userAssignmentsByTimeAndDay) {
                for (let slot in userAssignmentsByTimeAndDay[day]) {
                    for (let info of userAssignmentsByTimeAndDay[day][slot]) {
                        // Find existing user widget by ID
                        let findUser = document.getElementById(info[0]);

                        if (findUser) {
                            // Find the existing tooltip
                            let tooltip = document.getElementById(info[0] + ' tooltip');

                            // Check if the day already exists in the tooltip
                            let dayElement = tooltip.querySelector(`#day-${day}`);
                            if (dayElement) {
                                // Add the slot to the existing day line
                                let slotsElement = dayElement.querySelector('.slots');
                                slotsElement.textContent += `, ${slot}`;
                            } else {
                                // Create a new line for the new day and slot under "Free Slots"
                                let freeSlotsSection = tooltip.querySelector('#freeSlots');
                                let newDayLine = document.createElement('p');
                                newDayLine.id = `day-${day}`;
                                newDayLine.innerHTML = `${day}: <span class='slots'>${slot}</span>`;
                                freeSlotsSection.appendChild(newDayLine);
                            }

                            // Add the existing user widget to the userAssigned structure
                            let nodeCopy = findUser.cloneNode(true);
                            nodeCopy.id = findUser.id + ' copied'
                            userAssigned[day][slot].push(nodeCopy);

                        } else {
                            // Create user widget
                            let userWidget = document.createElement('div');
                            userWidget.id = info[0];
                            userWidget.className = 'user-widget';
                            userWidget.textContent = info[0];

                            // Create tooltip element
                            let tooltip = document.createElement('div');
                            tooltip.id = info[0] + ' tooltip';
                            tooltip.className = 'tooltip';
                            tooltip.innerHTML = `
                            <strong>Free Slots:</strong>
                            <div id='freeSlots'>
                                <p id='day-${day}'>\t${day}: <span class='slots'>${slot}</span></p>
                            </div>
                            <strong>Rank:</strong> ${info[1]}<br>
                            <strong>Message:</strong> ${info[2]}
                        `;

                            // Append tooltip to userWidget
                            userWidget.appendChild(tooltip);

                            // Append userWidget to container
                            allUser.appendChild(userWidget);

                            // Add the newly created user widget to the userAssigned structure
                            let nodeCopy = userWidget.cloneNode(true);
                            nodeCopy.id = userWidget.id + ' copied'
                            userAssigned[day][slot].push(nodeCopy);
                        }
                    }
                }
            }
        })
        .catch(error => console.error('Error:', error));

        
};


function addClicks(time) {
    let filteredDiv = document.getElementById('filtered');
    let allDiv = document.getElementById('allDiv');

    // Convert HTMLCollection to array
    let filteredDivs = Array.from(filteredDiv.getElementsByTagName('div'));
    let allDivs = Array.from(allDiv.getElementsByTagName('div'));

    // Add click event listeners to each div in filteredDiv
    filteredDivs.forEach(element => {
        element.addEventListener('click', function () {

            time = document.getElementById('selected-slot-info').textContent;

            time = time.substring(time.length - 17);

            let userList = document.getElementById('user-list');
            let addDiv = document.createElement('div');
            let start = element.id.length - 7;
            
            if (!document.getElementById(element.id.substring(0, start) + 'add') && !element.id.includes('tooltip') && element.id !== 'freeSlots'){

                addDiv.innerHTML = `
                    <div id="${element.id.substring(0, start) + 'add'}" class="added flex items-center space-x-2 p-2 bg-gray-100 rounded-md">
                        <span class="text-gray-800 text-sm font-medium" id="user-name">${element.id.substring(0, start)}</span>
                        <input 
                            type="text" 
                            value="${time}" 
                            class="border border-gray-300 rounded-md p-1 text-sm w-24 focus:ring-2 focus:ring-blue-500" 
                            id="time-slot"
                        />
                        <button onclick="removeDiv('${element.id.substring(0, start) + 'add'}')"
                            class="bg-red-500 text-white text-sm rounded-md px-3 py-1 hover:bg-red-600 transition"
                            id="remove-button"
                        >
                            Remove
                        </button>
                    </div>
                `;


                element.style.backgroundColor = '#505050';

                document.getElementById(`${element.id.substring(0, start)}`).style.backgroundColor = '#505050';
                userList.appendChild(addDiv);
            }
        });
    });

    // Add click event listeners to each div in allDiv (if needed)
    allDivs.forEach(element => {
        element.addEventListener('click', function () {

            time = document.getElementById('selected-slot-info').textContent;

            time = time.substring(time.length - 17);

            let userList = document.getElementById('user-list');
            let addDiv = document.createElement('div');

            if (!document.getElementById(element.id + 'add') && !element.id.includes('tooltip') && element.id !== 'freeSlots') {

                addDiv.innerHTML = `
                    <div id="${element.id + 'add'}" class="added flex items-center space-x-2 p-2 bg-gray-100 rounded-md">
                        <span class="text-gray-800 text-sm font-medium" id="user-name">${element.id}</span>
                        <input 
                            type="text" 
                            value="${time}" 
                            class="border border-gray-300 rounded-md p-1 text-sm w-24 focus:ring-2 focus:ring-blue-500" 
                            id="time-slot"
                        />
                         <button onclick="removeDiv('${element.id + 'add'}')"
                            class="bg-red-500 text-white text-sm rounded-md px-3 py-1 hover:bg-red-600 transition"
                            id="remove-button"
                        >
                            Remove
                        </button>
                    </div>
                `;


                element.style.backgroundColor = '#505050';

                if (document.getElementById(`${element.id + ' copied'}`)){
                    document.getElementById(`${element.id + ' copied'}`).style.backgroundColor = '#505050';
                }
                
                userList.appendChild(addDiv);
            }
        });
    });
}


function removeDiv(id){
    document.getElementById(id).parentNode.remove();
    let start = id.length - 3;
    if (document.getElementById(id.substring(0, start) + ' copied')){
        document.getElementById(id.substring(0, start) + ' copied').style.backgroundColor = '#F3F4F6';
    }
    
    document.getElementById(id.substring(0, start)).style.backgroundColor = '#F3F4F6';

    document.getElementById(id.substring(0, start) + ' calSec').remove();
}

function addIt(){
    let divs = document.getElementById('user-list')

    let checkDivs = Array.from(divs.getElementsByTagName('div'));

    if (checkDivs.length === 0 || checkDivs.length === 1){
        alert('add atleast one person please');
        return;
    }

    let time = document.getElementById('selected-slot-info').textContent;

    time = time.substring(24);

    time = time.trim();

    switch (time) {
        case 'Monday 08:00-11:00':
            time = 'mon:8-11';
            break;
        case 'Monday 11:00-14:00':
            time = 'mon:11-14';
            break;
        case 'Monday 14:00-18:00':
            time = 'mon:14-18';
            break;
        case 'Monday 18:00-22:00':
            time = 'mon:18-22';
            break;
        case 'Tuesday 08:00-11:00':
            time = 'tue:8-11';
            break;
        case 'Tuesday 11:00-14:00':
            time = 'tue:11-14';
            break;
        case 'Tuesday 14:00-18:00':
            time = 'tue:14-18';
            break;
        case 'Tuesday 18:00-22:00':
            time = 'tue:18-22';
            break;
        case 'Wednesday 08:00-11:00':
            time = 'wed:8-11';
            break;
        case 'Wednesday 11:00-14:00':
            time = 'wed:11-14';
            break;
        case 'Wednesday 14:00-18:00':
            time = 'wed:14-18';
            break;
        case 'Wednesday 18:00-22:00':
            time = 'wed:18-22';
            break;
        case 'Thursday 08:00-11:00':
            time = 'thu:8-11';
            break;
        case 'Thursday 11:00-14:00':
            time = 'thu:11-14';
            break;
        case 'Thursday 14:00-18:00':
            time = 'thu:14-18';
            break;
        case 'Thursday 18:00-22:00':
            time = 'thu:18-22';
            break;
        case 'Friday 08:00-11:00':
            time = 'fri:8-11';
            break;
        case 'Friday 11:00-14:00':
            time = 'fri:11-14';
            break;
        case 'Friday 14:00-18:00':
            time = 'fri:14-18';
            break;
        case 'Friday 18:00-22:00':
            time = 'fri:18-22';
            break;
    }

    let calSec = document.getElementById(time);
    calSec.textContent = '';

    let userList = document.getElementById('user-list');

    let userArr = Array.from(userList.getElementsByClassName('added'));


    userArr.forEach(element => {
        let elm = document.createElement('li');
        elm.id = `${ element.id.substring(0, element.id.length - 3) } calSec`;

        let input = element.querySelector('input').value;
        input = input.trim();
        input = `(${input})`

        elm.textContent = `${element.id.substring(0, element.id.length - 3)} ${input}`
        calSec.appendChild(elm)
    })
}

function saveAll() {
    fetch('/admin/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({html: document.documentElement.outerHTML})
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'good'){
            alert('saved');
        } else {
            alert('error saving');
        }
    });
}

function createPdf() {
    // Ask for the week
    let week = prompt('Please enter the week for this calendar:');
    if (!week) {
        alert('Week is required to generate the PDF.');
        return;
    }

    confirm('This will email a schedule to all provided emails.');
    alert('Creating PDF...');

    // Retrieve the table data
    let originalCalendar = document.getElementById('cal');
    if (!originalCalendar) {
        alert('No calendar found.');
        return;
    }

    // Extract the headers and the data for the days and time slots
    let headers = Array.from(originalCalendar.querySelectorAll('th')).slice(1, 6).map(th => th.innerText); // Only include Mon-Fri
    let timeslots = Array.from(originalCalendar.querySelectorAll('tr')).slice(1).map(tr => tr.querySelector('th').innerText);
    let data = Array.from(originalCalendar.querySelectorAll('tr')).slice(1).map(tr => {
        return Array.from(tr.querySelectorAll('td')).slice(0, 5).map(td => {
            // Format the time slots to be more readable
            let formattedText = td.innerText.split('\n').map(line => line.trim()).join('\n'); // Ensure all text is on the same line
            return formattedText;
        });
    });

    // Format timeslots with subslots on separate lines, with increased spacing
    let timeslot = [];

    timeslots.forEach(element => {
        let formattedSlot = ''; // Initialize an empty string to store the formatted time slot
        switch (element) {
            case '08:00-11:00':
                formattedSlot = `08:00-09:00\n\n09:00-10:00\n\n10:00-11:00`; // Added extra line spacing between slots
                break;
            case '11:00-14:00':
                formattedSlot = `11:00-12:00\n\n12:00-13:00\n\n13:00-14:00`;
                break;
            case '14:00-18:00':
                formattedSlot = `14:00-15:00\n\n15:00-16:00\n\n16:00-17:00\n\n17:00-18:00`;
                break;
            case '18:00-22:00':
                formattedSlot = `18:00-19:00\n\n19:00-20:00\n\n20:00-21:00\n\n21:00-22:00`;
                break;
            default:
                formattedSlot = element; // In case of an unexpected time slot, just use it as is
        }
        timeslot.push(formattedSlot);
    });

    timeslots = timeslot;

    // Convert logo image to Base64 function
    const convertImageToBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                const reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = reject;
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        });
    };

    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('landscape', 'mm', 'a4');

    // Convert logo image to Base64 and add to PDF
    const logoUrl = '../images/logo.jpg';
    convertImageToBase64(logoUrl).then(logoDataUrl => {
        // Add the logo to the PDF
        pdf.addImage(logoDataUrl, 'JPEG', 10, 10, 40, 20);

        // Add header text to the PDF
        pdf.setFontSize(22);
        pdf.setTextColor(33, 150, 243);
        pdf.setFont("helvetica", "bold");
        pdf.text('ECSpeRT On Call Schedule', 60, 20);

        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Week: ${week}`, 60, 30);

        // Calculate available space for the table
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const startY = 40;
        const tableHeight = pageHeight - startY - 20; // 20 for bottom margin
        const tableWidth = pageWidth - 20; // 10mm margin on each side

        // Adjust font size and cell height dynamically
        const fontSize = 10; // Smaller font size for fitting content
        const cellHeight = 15; // Adjusted cell height
        const tableOptions = {
            startY: startY,
            head: [['Time', ...headers]], // Days of the week in the header (Mon-Fri)
            body: timeslots.map((time, i) => [time, ...data[i]]), // Rows are time slots with corresponding data
            theme: 'grid',
            styles: {
                fontSize: fontSize,
                cellPadding: 2,
                overflow: 'linebreak',
                halign: 'center',
                valign: 'middle',
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                minCellHeight: cellHeight,
                cellWidth: 'wrap', // Ensures text wrapping
            },
            headStyles: {
                fillColor: [30, 30, 30],
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [242, 242, 242]
            },
            tableWidth: tableWidth,
            margin: { left: 10, right: 10 }, // Margin for entire table
            columnStyles: {
                0: { cellWidth: 30 }, // Time column width
                1: { cellWidth: (tableWidth - 30) / 5 },
                2: { cellWidth: (tableWidth - 30) / 5 },
                3: { cellWidth: (tableWidth - 30) / 5 },
                4: { cellWidth: (tableWidth - 30) / 5 },
                5: { cellWidth: (tableWidth - 30) / 5 },
            },
            didParseCell: function (data) {
                if (data.section === 'body' && data.cell.raw) {
                    data.cell.styles.fillColor = [255, 255, 255];
                    data.cell.styles.textColor = [0, 0, 0];
                    data.cell.styles.fontStyle = 'normal';
                }
            },
            didDrawCell: function (data) {
                if (data.cell.raw && data.cell.raw.toLowerCase().includes('name')) {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.textColor = [0, 0, 255];
                }
            }
        };

        // Draw the table
        pdf.autoTable(tableOptions);

        // Generate a blob URL and open in a new window
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');

        // Send PDF to server
        const formData = new FormData();
        formData.append('pdf', pdfBlob, 'calendar.pdf');

        fetch('/admin/send-pdf', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => console.log('PDF sent successfully:', data.message))
            .catch(error => console.error('Error sending PDF:', error));

    }).catch(error => {
        console.error('Error converting image to Base64:', error);
    });
}



























