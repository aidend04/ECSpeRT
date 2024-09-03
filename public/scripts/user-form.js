document.addEventListener('DOMContentLoaded', () => {

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timeSlots = ['8-11', '11-14', '14-18', '18-22'];
        const data = {};

        daysOfWeek.forEach(day => {
            data[day] = [];
            timeSlots.forEach(slot => {
                const cell = document.getElementById(`${day.substring(0, 3).toLowerCase()}:${slot}`);
                if (cell) {
                    const checkbox = cell.querySelector('input[type="checkbox"]');
                    if (checkbox && checkbox.checked) {
                        data[day].push(slot);
                    }
                }
            });
        });

        let note = document.getElementById('clip-note').value;

        // Example POST request to server
        fetch('/data/user-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userAvailability: data, clipNote: note}),
        })
            .then(response => response.json())
            .then(data => {
                alert('Successfully sent your availability, if you need to make any changes just resubmit this form :)');
                window.location.reload();
                return;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});
