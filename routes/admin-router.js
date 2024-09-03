const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user-model');
const Calendar = require('../models/calendar-model')
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ecspertmailer@gmail.com',
        pass: 'bxzl bpbu mudu fskx'
    }
});

const upload = multer({ dest: 'uploads/' });

router.post('/send-pdf', upload.single('pdf'), async (req, res) => {
    try {
        let cal = await Calendar.findOne({});
        let emails = cal.Emails;

        // The uploaded file path
        const pdfPath = req.file.path;

        // Loop through each email and send the PDF as an attachment
        for (let email of emails) {
            let mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Your Weekly Schedule (ECSpeRT)',
                text: 'Please find the schedule attached. This inbox is NOT monitored, direct questions to your Admin',
                attachments: [
                    {
                        filename: 'calendar.pdf',
                        path: pdfPath,
                        contentType: 'application/pdf'
                    }
                ]
            };

            await transporter.sendMail(mailOptions);
        }

        // Delete the file after sending emails
        fs.unlinkSync(pdfPath);

        console.log('done')

        res.status(200).send('Emails sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email.');
    }
});

router.post('/send-night-pdf', upload.single('pdf'), async (req, res) => {
    try {
        let cal = await Calendar.findOne({});
        let emails = cal.Emails;

        // The uploaded file path
        const pdfPath = req.file.path;

        // Loop through each email and send the PDF as an attachment
        for (let email of emails) {
            let mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Your Monthly Overnight Schedule (ECSpeRT)',
                text: 'Please find the schedule attached. This inbox is NOT monitored, direct questions to your Admin',
                attachments: [
                    {
                        filename: 'calendar.pdf',
                        path: pdfPath,
                        contentType: 'application/pdf'
                    }
                ]
            };

            await transporter.sendMail(mailOptions);
        }

        // Delete the file after sending emails
        fs.unlinkSync(pdfPath);

        console.log('done')

        res.status(200).send('Emails sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email.');
    }
});


router.get('/', async (req, res) => {
    let cal = await Calendar.findOne({});

    if (!cal){
        cal = new Calendar;
        await cal.save();
    }
    let save = cal.Saved;

    if (save) {
        res.send(save);
    } else {
        res.sendFile(path.join(__dirname, '../public', 'admin-home.html'))
    }
})

router.get('/user-panel', async (req, res) => {

    res.sendFile(path.join(__dirname, '../public', 'user-panel.html'))

})

router.get('/overnight', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin-overnight.html'));
})

router.post('/user-panel', async (req, res) => {
    let data = await User.find({});
    let sendData = []
    for (let user of data) {
        let curr = [];
        curr.push(user.Email);
        curr.push(user.FullName);
        curr.push(user.Status);
        curr.push(user.Rank);
        sendData.push(curr);

    }

    res.status(200).send(sendData);

})

router.post('/rank-change', async (req, res) => {
    let user = await User.findOne({Email: req.body.email});

    user.Rank = req.body.rankSet;

    await user.save();

    res.status(200).send({rank: user.Rank});

})

router.post('/user-verify', async (req, res) => {
    
    console.log(req.body.email, req.body.rank);
    let user = await User.findOne({ Email: req.body.email });

    user.Status = 'verified';

    req.session.status = 'verified'

    await user.save();

    let cal = await Calendar.findOne({});
    let emails = cal.Emails;

    emails.push(User.Email);

    cal.markModified('Emails');
    await cal.save();

    res.status(200).send({message: 'all good'});
})

router.post('/rank-set', async (req, res) => {
    let user = await User.findOne({Email: req.body.email});

    user.Rank = req.body.rank;

    await user.save();

    res.status(200).send({message: 'good'});
})

router.post('/save', async (req, res) => {
    try {
        let cal = await Calendar.findOne({});
        cal.Saved = req.body.html;
        console.log(req.body.html);
        cal.markModified('Saved');
        cal.save();
        res.status(200).send({message: 'good'});
    } catch (error) {
        res.status(400).send({message: 'error saving'});
    }
});

router.delete('/user-panel', async (req, res) => {
    try {
        console.log(req.body.email);
        let cal = await Calendar.findOne({});
        let emails = cal.Emails;


        let user = await User.findOne({Email: req.body.email});

        let userId = user.id.toString();

        for (let day in cal.Availability) {
            
            for (let slot in cal.Availability[day]){
                console.log(slot)
                console.log(cal.Availability[day][slot])
                cal.Availability[day][slot] =
                cal.Availability[day][slot].filter(user => user.toString() !== userId);
                console.log(cal.Availability[day][slot])

                if (slot === '18-22'){
                    break;
                }
            }
            
            if (day === 'Friday'){
                break;
            }
        }

        for (let day in cal.OvernightAvail){
            console.log(day);
            cal.OvernightAvail[day] = cal.OvernightAvail[day].filter(user => user[1].toString() !== userId);

        }

        cal.markModified('Availability');
        cal.markModified('OvernightAvail');
        await cal.save();


        const result = await User.deleteOne({ Email: req.body.email });

        let ind = emails.findIndex(req.body.email);

        if (ind !== -1){
            emails.splice(ind, 1);

            cal.markModified('Emails');

            cal.save();
        }

        if (result.deletedCount === 0){
            return res.status(404).send({message: 'User not found'});
        }

        res.status(200).send({ message: 'all good'});
    } catch (error) {
        res.status(500).send({ message: 'Error deleting user', error })
    }
})



module.exports = router;