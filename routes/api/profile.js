const express = require("express");
const router = express.Router();
const request = require('request')
const config = require('config')

const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

const { check, validationResult } = require("express-validator");

//@route GET api/profile/me
//@desc Get current user's profile
//@access Private
router.get("/me", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate("user", ["name", "avatar"]);
        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route POST api/profile/me
//@desc make a profile
//@access Private
router.post(
    "/", [
        auth, [
            check("status", "Status is required")
            .not()
            .isEmpty(),
            check("skills", "Skills is required")
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        //build skills array
        if (skills) {
            if (typeof skills === 'string') {
                profileFields.skills = skills.split(' ,').map(skill => skill.trim());
            } else {
                profileFields.skills = skills.map(skill => skill.trim())
            }
        }

        //Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                //Update profile
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

                return res.json(profile);
            }

            //Create Profile
            profile = new Profile(profileFields);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

//@route GET api/profile/me
//@desc Get All profiles
//@access Public
router.get("/", async(req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        console.log(profiles)
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route GET api/profile/user/:user_id
//@desc Get a profile by id
//@access Public
router.get("/user/:user_id", async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate("user", ["name", "avatar"]);
        if (!profile) {
            return res.status(400).json({ msg: 'Profile does not exist' })
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (error.kind == 'ObjectId') {
            res.status(400).json({ msg: 'Profile does not exist' })
        }
        res.status(500).send("Server Error");
    }
});

//@route DELETE api/profile
//@desc Delete a profile, user, and posts
//@access Private
router.delete("/", auth, async(req, res) => {
    try {
        //remove posts
        await Post.deleteMany({ user: req.user.id })
        await Profile.findOneAndRemove({
                user: req.user.id
            })
            //remove user
        await User.findOneAndRemove({
            _id: req.user.id
        })
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route PUT api/profile
//@desc Add experience to profile
//@access Private
router.put(
    "/experience", [
        auth, [
            check("title", "Title is required")
            .not()
            .isEmpty(),
            check("company", "Company is required")
            .not()
            .isEmpty(),
            check("from", "From date is required")
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.experience.unshift(newExp)
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

//@route DELETE api/profile/experience/:exp_id
//@desc Delete an experience from a profile
//@access Private
router.delete("/experience/:exp_id", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        //get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route PUT api/profile
//@desc Add education to profile
//@access Private
router.put(
    "/education", [
        auth, [
            check("school", "School is required")
            .not()
            .isEmpty(),
            check("degree", "Degree is required")
            .not()
            .isEmpty(),
            check("from", "From date is required")
            .not()
            .isEmpty(),
            check("fieldofstudy", "From date is required")
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.education.unshift(newEdu)
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

//@route DELETE api/profile/education/:edu_id
//@desc Delete an experience from a profile
//@access Private
router.delete("/education/:edu_id", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        //get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route GET api/profile/github/:username
//@desc Get user repos from Github
//@access Public
router.get('/github/:username', (req, res) => {
    const clientId = config.get('githubClient');
    const clientSec = config.get("githubSecret");
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&}`,
            method: 'GET',
            headers: {
                "user-agent": "node.js",
                "client_id": clientId,
                "client_secret": clientSec
            }
        }

        request(options, (error, response, body) => {
            if (error) console.error(err)

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No profile found' })
            }

            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})



module.exports = router;