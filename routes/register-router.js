const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user-model')
const Calendar = require('../models/calendar-model')

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

router.post('/', async (req, res) => {

    console.log(req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: 'All fields not found'})
    }

    const userExists = await User.findOne({ Email: email });

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

    if (userExists) {
        return res.status(400).json({message: 'user exists'})
    }

    const newUser = new User({
        Email: email,
        FullName: name,
        Password: password,
        Rank: 'observer'
    })

    try {
        await newUser.save();
        req.session.loggedIn = true;
        req.session.userId = email;
        req.session.type = 'user'
        req.session.status = 'unverified';
        res.status(200).json({message: 'user registered'})
    } catch (err) {
        res.status(400).json( {message: err.message})
    }
})

module.exports = router;