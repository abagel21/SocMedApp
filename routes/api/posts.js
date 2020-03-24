const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//@route GET api/posts
//@desc Test route
//@access Public
router.post(
    "/", [
        auth, [
            check("text", "Text is required")
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select("-password");
            const newPost = await new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            await newPost.save();
            res.send(newPost);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

//@route GET api/posts
//@desc Get all posts
//@access Private
router.get("/", auth, async(req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route GET api/posts/:id
//@desc Get post by id
//@access Private
router.get("/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ msg: "Post doesn't exist" });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).json({ msg: "Post doesn't exist" });
        }
        res.status(500).send("Server error");
    }
});

//@route GET api/posts/user/:user_id
//@desc Get one users posts
//@access Private
router.get("/user/:user_id", auth, async(req, res) => {
    try {
        const posts = await Post.find({ user: req.params.user_id });
        if (!posts) {
            res.status(404).json({ msg: "User has no posts" });
        }
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).json({ msg: "User doesn't exist" });
        }
        res.status(500).send("Server error");
    }
});

//@route DELETE api/posts/:id
//@desc Delete post by id
//@access Private
router.delete("/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        await post.remove();
        res.json({ msg: "Post removed" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send("Server error");
    }
});

//@route GET api/posts/like/Lid
//@desc Get likes for a post
//@access Private
router.get("/like/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ msg: "Post not found" });
        }
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send("Server error");
    }
});

//@route PUT api/posts/like/:id
//@desc Like a post
//@access Private
router.put("/like/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ msg: "Post doesn't exist" });
        }
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' })
        }
        post.likes.unshift({ user: req.user.id })
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).json({ msg: "Post doesn't exist" });
        }
        res.status(500).send("Server error");
    }
});

//@route PUT api/posts/unlike/:id
//@desc Unlike a post
//@access Private
router.delete("/unlike/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ msg: "Post doesn't exist" });
        }
        if (post.likes.filter(like => like.user.toString() === req.user.id).length == 0) {
            return res.status(400).json({ msg: 'Post not liked' })
        }
        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route Post api/posts/comment/:id
//@desc Comment on a post
//@access Private
router.post(
    "/comment/:id", [
        auth, [
            check("text", "Text is required")
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        //@todo ADD LIKES TO COMMENTS
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select("-password");
            const post = await Post.findById(req.params.id)
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment)
            await post.save()
            res.send(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

//@route GET api/posts/like/Lid
//@desc Get likes for a post
//@access Private
router.get("/comment/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ msg: "Post not found" });
        }
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send("Server error");
    }
});

//@route PUT api/posts/unlike/:id/:comment_id
//@desc Delete a comment
//@access Private
router.delete("/comment/:id/:comment_id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ msg: "Post doesn't exist" });
        }
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        if (!comment) {
            return res.status(404).json({ msg: "Comment does not exist" })
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" })
        }
        const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id)

        post.comments.splice(removeIndex, 1)

        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).json({ msg: "Post doesn't exist" });
        }
        res.status(500).send("Server error");
    }
});

module.exports = router;