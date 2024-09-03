const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
    Availability: {
        "Monday": {
            "8-11": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "11-14": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "14-18": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "18-22": [{ type: Schema.Types.ObjectId, ref: 'User' }]
        },
        "Tuesday": {
            "8-11": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "11-14": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "14-18": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "18-22": [{ type: Schema.Types.ObjectId, ref: 'User' }]
        },
        "Wednesday": {
            "8-11": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "11-14": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "14-18": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "18-22": [{ type: Schema.Types.ObjectId, ref: 'User' }]
        },
        "Thursday": {
            "8-11": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "11-14": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "14-18": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "18-22": [{ type: Schema.Types.ObjectId, ref: 'User' }]
        },
        "Friday": {
            "8-11": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "11-14": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "14-18": [{ type: Schema.Types.ObjectId, ref: 'User' }],
            "18-22": [{ type: Schema.Types.ObjectId, ref: 'User' }]
        }
    },

    Saved: {type: String},
    Emails: [],
    OvernightCal: {type: String},
    OvernightForm: {type: String},
    OvernightAvail: {}

});

const Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = Calendar;
