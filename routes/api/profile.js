const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route  GET api/profile/me
// @desc   Get current user's profile
// @access Private

router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res
                .status(400)
                .json({ msg: "There is no profile for this user" });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route  GET api/profile
// @desc   Creaate/Update a user profile
// @access Private

router.post(
    "/",
    [
        auth,
        [
            check("status", "Status is required")
                .not()
                .isEmpty(),
            check("skills", "Skills is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
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

        // build profile object
        const profileFields = {};

        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) profileFields.skills = skills;
        if (youtube) profileFields.youtube = youtube;
        if (facebook) profileFields.facebook = facebook;
        if (twitter) profileFields.twitter = twitter;
        if (instagram) profileFields.instagram = instagram;
        if (linkedin) profileFields.linkedin = linkedin;

        if (skills) {
            profileFields.skills = skills.split(",").map(skill => skill.trim());
        }

        // build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                // update profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            }

            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);

// @route  GET api/profile
// @desc   Get all profiles
// @access Public

router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", [
            "name",
            "avatar"
        ]);
        res.send(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public

router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate("user", ["name", "avatar"]);

        if (!profile) {
            res.status(400).json({ msg: "Profile not found" });
        }
        res.send(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({ msg: "Profile not found" });
        }
        res.status(500).send("Server error");
    }
});

// @route  DELETE api/profile
// @desc   Delete profile, user & posts
// @access Private

router.delete("/", auth, async (req, res) => {
    try {
        // remove users posts
        await Post.deleteMany({ user: req.user.id });
        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: "User removed" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private

router.put(
    "/experience",
    [
        auth,
        [
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
    async (req, res) => {
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
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   DELETE experience from profile
// @access Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        // get remove index
        const removeIndex = profile.experience
            .map(item => item.id.toString())
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({ msg: "Experience not found" });
        }
        res.status(500).send("Server.error");
    }
});

// @route  PUT api/profile/education
// @desc   Add profile education
// @access Private

router.put(
    "/education",
    [
        auth,
        [
            check("school", "School is required")
                .not()
                .isEmpty(),
            check("degree", "Degree is required")
                .not()
                .isEmpty(),
            check("fieldofstudy", "Field is required is required")
                .not()
                .isEmpty(),
            check("from", "From date is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
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
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);

// @route  DELETE api/profile/education/:exp_id
// @desc   DELETE education from profile
// @access Private

router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        // get remove index
        const removeIndex = profile.education
            .map(item => item._id)
            .indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({ msg: "Education not found" });
        }
        res.status(500).send("Server error");
    }
});

// @route  GET api/profile/github/:username
// @desc   GET user repos from GITHUB
// @access Public

router.get("/github/:username", (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                "githubClientID"
            )}&client_secret=${config.get("githubSecret")}`,
            method: `GET`,
            headers: { "user-agent": "node.js" }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: "No github profile found" });
            }

            res.json(JSON.parse(body));
        });
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({ msg: "No github profile found" });
        }
        res.status(500).send("Server.error");
    }
});

module.exports = router;
