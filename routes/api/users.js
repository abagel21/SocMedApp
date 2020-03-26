const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('./../../models/User');
const auth = require('../../middleware/auth')

//@route GET api/users
//@desc Test route
//@access Public
router.post('/', [check('name', 'Name is required').not().isEmpty(), check('email', 'Not a valid email').isEmail(), check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    //Check if user exists
    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'That email is already in use' }] })
        }
        //Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
                name,
                email,
                avatar,
                password
            })
            //encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token })
        });


        //return jsonwebtoken
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }



});

//create chat
router.put('/chat/:userId', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const chat = user.chats.filter(chat => chat.user.toString() === req.params.userId)

        if (chat.length > 0) {
            return res.json(chat[0])
        }
        if (req.user.id.toString() === req.params.userId.toString()) {
            return res.status(400).json({ msg: 'You cannot create a chat with yourself' })
        }
        const receivingUser = await User.findById(req.params.userId)
        const prosChat = {
            user: req.params.userId,
            name: receivingUser.name,
            messages: []
        }

        const prosReChat = {
            user: req.user.id,
            name: user.name,
            messages: []
        }

        user.chats.unshift(prosChat)
        receivingUser.chats.unshift(prosReChat)
        await user.save()
        await receivingUser.save()
        const chat1 = user.chats;
        const chat2 = receivingUser.chats;
        res.json({ chat1 })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

//get chats
router.get('/chat', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const chats = user.chats;

        res.json(chats)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

//send chat
router.put('/chat/send/:chatId', auth, async(req, res) => {
    try {
        let sendingUser = await User.findById(req.user.id)
        let sendingChat = sendingUser.chats.filter(chat => chat._id.toString() === req.params.chatId)[0]
        if (!sendingChat) {
            res.status(404).json({ msg: 'Chat with that user not found' })
        }
        let receivingUser = await User.findById(sendingChat.user)
        let receivingChat = receivingUser.chats.filter(chat => chat.user.toString() === req.user.id)[0]
        const msg = {
            text: req.body.text,
            user: req.user.id,
            name: sendingUser.name
        }
        await receivingUser.chats.filter(chat => chat.user.toString() === req.user.id)[0].messages.unshift(msg);
        await sendingUser.chats.filter(chat => chat._id.toString() === req.params.chatId)[0].messages.unshift(msg);




        await sendingUser.save();
        await receivingUser.save();

        // Reimport users and chats
        sendingUser = await User.findById(req.user.id)
        sendingChat = sendingUser.chats.filter(chat => chat._id.toString() === req.params.chatId)[0]

        receivingUser = await User.findById(sendingChat.user)
        receivingChat = receivingUser.chats.filter(chat => chat.user.toString() === req.user.id)[0]

        //instantiate utility variables
        let rindex = receivingUser.chats.map(chat => chat._id).indexOf(receivingChat._id)
            // let placeholder = receivingUser.chats[0]

        // //swap receivingusers's front chat with the current chat
        // receivingUser.chats[0] = receivingUser.chats[index]
        // receivingUser.chats[index] = placeholder

        //set utility variables to sendingUser's values
        let sindex = sendingUser.chats.map(chat => chat._id).indexOf(sendingChat._id)
            // placeholder = sendingUser.chats[0]

        // //swap sendingUser's front chat with the current chat
        // sendingUser.chats[0] = sendingUser.chats[index]
        // sendingUser.chats[index] = placeholder
        // console.log(sendingUser.chats)

        await sendingUser.save();
        await receivingUser.save();

        res.json({ sendingChat })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;