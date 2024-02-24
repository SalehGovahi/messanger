const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    receiver: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    info: {
        viewed: { type: Boolean, default: false},
        text: { type: String},
        sentAt: { type: Date , default: Date.now}
    }
});

messageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Message', messageSchema);
