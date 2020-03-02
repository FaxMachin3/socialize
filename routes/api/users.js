const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");

const User = require("../../models/User");

// @route  POST api/users
// @desc   Register user
// @access Public

router.post(
    "/",
    [
        check("name", "Name is required")
            .not()
            .isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 })
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            // check if email already exists
            if (user) {
                return res.status(400).json({
                    error: [
                        {
                            msg: "User alreadly exists"
                        }
                    ]
                });
            }

            // get user's gravatar
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm"
            });

            user = new User({
                name,
                email,
                password,
                avatar
            });

            // encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // return jwt
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                {
                    expiresIn: 360000
                },
                (error, token) => {
                    if (error) {
                        throw error;
                    }
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
