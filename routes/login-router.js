const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt')
const User = require('../models/user-model')

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});


router.post('/adm', async (req, res) => {
    
    let comp = 'abc123';
    const { email, password } = req.body;

    console.log(comp);

    if (comp === password){

        req.session.loggedIn = true;
        req.session.userId = email;
        req.session.type = 'admin';
        
        return res.status(200).json({ message: 'user found' })

    } else {
        res.status(400).json({ message: 'user not found' })
    }

});


router.post('/', async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'All fields not found'});
    }

    const userExists = await User.findOne({ Email: email });

    if (userExists) {

        const validPass = await bcrypt.compare(password, userExists.Password)

        if (!validPass){
            return res.status(400).send({message: 'wrong pass'})
        }

        req.session.loggedIn = true;
        req.session.userId = email;
        req.session.type = 'user';

        if (userExists.Status === 'await'){
            req.session.status = 'unverified';
        } 
        
        return res.status(200).json({ message: 'user found' })
        
        
    } else {
        res.status(400).json({ message: 'user not found' })
    }
})

module.exports = router;