const express = require('express');
const router = express.Router();
const Calendar = require('../models/calendar-model');
const User = require('../models/user-model');

router.post('/user-form', async (req, res) => {
    try {
        const user = await User.findOne({ Email: req.session.userId });
        if (!user) {
            return res.status(404).send({ message: 'user not found' });
        }
        const userId = user._id;
        const newAvailability = req.body.userAvailability;

        console.log('New Availability:', newAvailability);

        // Step 1: Find or create a calendar document
        let calendar = await Calendar.findOne({});

        if (!calendar) {
            calendar = new Calendar({
                Availability: {
                    "Monday": { "8-11": [], "11-14": [], "14-18": [], "18-22": [] },
                    "Tuesday": { "8-11": [], "11-14": [], "14-18": [], "18-22": [] },
                    "Wednesday": { "8-11": [], "11-14": [], "14-18": [], "18-22": [] },
                    "Thursday": { "8-11": [], "11-14": [], "14-18": [], "18-22": [] },
                    "Friday": { "8-11": [], "11-14": [], "14-18": [], "18-22": [] }
                },
                Saved: "",
                Emails: []
            });
            await calendar.save();
        }

        user.ClipANote = req.body.clipNote;

        await user.save();

        console.log('Calendar before update:', calendar);

        // Step 2: Remove the user from all time slots
        const unsetFields = {};
        for (const day in calendar.Availability) {
            for (const slot in calendar.Availability[day]) {
                const slotUsers = calendar.Availability[day][slot];
                if (Array.isArray(slotUsers)) {
                    const index = slotUsers.indexOf(userId);
                    if (index !== -1) {
                        slotUsers.splice(index, 1); // Remove userId from the array
                        unsetFields[`Availability.${day}.${slot}`] = slotUsers;
                    }
                }
            }
        }

        if (Object.keys(unsetFields).length > 0) {
            await Calendar.updateOne(
                { _id: calendar._id },
                { $set: unsetFields }
            );
        }

        // Step 3: Re-add the user to the specified time slots
        const updateFields = {};
        for (const day in newAvailability) {
            newAvailability[day].forEach(slot => {
                if (!calendar.Availability[day][slot].includes(userId)) {
                    calendar.Availability[day][slot].push(userId); // Add userId to the array
                }
                updateFields[`Availability.${day}.${slot}`] = calendar.Availability[day][slot];
            });
        }

        if (Object.keys(updateFields).length > 0) {
            await Calendar.updateOne(
                { _id: calendar._id },
                { $set: updateFields }
            );
        }

        res.status(200).send({message: 'User availability updated successfully'});
    } catch (error) {
        console.error('Error updating user availability:', error);
        res.status(500).send({ message: 'failed' });
    }
});

router.post('/get-data', async (req, res) => {
    let cal = await Calendar.findOne({});

    let availability = cal.toObject().Availability;

    console.log(availability)

    for (day in availability){
        console.log(day);
        for (slot in availability[day]){
            for (let i = 0; i < availability[day][slot].length; i++) {
                let user = await User.findById(availability[day][slot][i]);

                let pushObj = [user.FullName, user.Rank, user.ClipANote];

                availability[day][slot][i] = pushObj;
            }
        }

    }

    res.status(200).send({data: availability})

});

const nodemailer = require('nodemailer');
const fs = require('fs');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ecspertmailer@gmail.com',
        pass: 'bxzl bpbu mudu fskx'
    }
});

router.post('/overnightForm', async (req, res) => {

    let calendar = await Calendar.findOne({});

    calendar.OvernightForm = req.body.html;

    calendar.markModified('OvernightForm');

    await calendar.save();

    let avail = calendar.OvernightAvail;

    console.log(avail)

    if (!avail || avail){
        calendar.OvernightAvail = {};
    }

    calendar.markModified('OvernightAvail');

    await calendar.save();

    let days = req.body.days;

    console.log(days);

    days.forEach(day => {
        calendar.OvernightAvail[day] = [];
    });

    calendar.markModified('OvernightAvail');

    await calendar.save();

    res.status(200).send({message: 'done'});
})

router.post('/emailAvail', async (req, res) => {

    try {
        let calendar = await Calendar.findOne({});

        let emails = calendar.Emails;

        for (let email of emails) {
            let mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'New Overnight Schedule',
                text: 'Your admin has created a new overnight schedule, please visit http://localhost:3000/user-overnight to add your availability.',

            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).send({ message: 'all good' });
    } catch (error) {

        console.log(error);

        res.status(400).send({message: 'not good'})
    }
    
});

router.post('/saveCal', async (req, res) => {

    let cal = await Calendar.findOne({});

    cal.OvernightCal = req.body.html;

    cal.markModified('OvernightCal');

    await cal.save();



    res.status(200).send({message: 'Good to go'});

});

router.post('/get-form', async (req, res) => {
    let cal = await Calendar.findOne({});
    let form = cal.OvernightForm;

    if (form){
        res.status(200).send({form: form})
    } else {
        res.status(200).send({form: 'no form'});
    }
});


router.post('/overnightCal', async (req, res) => {
    let cal = await Calendar.findOne({});

    let calHtml = cal.OvernightCal;

    if (calHtml){
        res.status(200).send({cal: calHtml})
    } else {
        res.status(200).send({cal: "no saved cal"});
    }


});


router.post('/is-saved', async (req, res) => {
    let cal = await Calendar.findOne({});
    let save = cal.Saved;

    if (save){
        res.status(200).send({data: save, message: 'save found'});
    } else {
        res.status(200).send({message: 'save not found'});
    }
})

router.post('/sendAvail', async (req, res) => {

    let avail = req.body.avail;

    let calendar = await Calendar.findOne({});

    let user = await User.findOne({Email: req.session.userId});

    let overnight = calendar.OvernightAvail;

    console.log(overnight.length, 'here')

    let keys = Object.keys(overnight)

    for (let i = 0; i < keys.length; i++) {
        console.log(avail[i]);
        let index = -1;
        for (let j = 0; j < overnight[keys[i]].length; j++) {
            let item = overnight[keys[i]][j];
            if (item[0] === user.FullName && item[1] === user.id && item[2] === user.Rank) {
                index = j;
                break;
            }
        }
        if (index !== -1) {
            console.log('hi')
            overnight[keys[i]].splice(index, 1);
        }

        if (avail[i] === 'available') {
            overnight[keys[i]].push([user.FullName, user.id, user.Rank]);
        }
    }

    calendar.markModified('OvernightAvail');

    await calendar.save();

    res.status(200).send({message: 'good'});
})

router.post('/getAvail', async (req, res) => {
    
    let calendar = await Calendar.findOne({});

    let users = await User.find({}, 'FullName');

    let usernames = users.map(user => [user.FullName, user.id]);

    if (calendar){
        res.status(200).send({avail: calendar.OvernightAvail, allUsers: usernames});
    } else {
        res.status(400).send('error finding calendar');
    }

})

module.exports = router;
