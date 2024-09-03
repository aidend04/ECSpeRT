const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    },

    FullName: {
        type: String
    },

    Password: {
        type: String,
        required: true
    },

    Rank: {
        type: String
    },

    Availibility: {
        "08:00-11:00": [{type: String}],
        "11:00-14:00": [{type: String}],
        "14:00-18:00": [{type: String}],
        "18:00-22:00": [{type: String}]
    },

    ClipANote: {
        type: String
    },

    Status: {
        type: String,
        default: 'await'
    }
})

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('Password')) {
        user.Password = await bcrypt.hash(user.Password, 8)
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;