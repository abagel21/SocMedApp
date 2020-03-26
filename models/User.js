const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String
    },
    chats: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        name: {
            type: String
        },
        messages: [{
            text: {
                type: String
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            name: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema);