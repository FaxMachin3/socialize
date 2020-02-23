const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");

const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route  GET api/auth
// @desc   Test route
// @access Public

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public

router.post(
    "/",
    [
        check("email", "please include a valid email").isEmail(),
        check("password", "Password is required").exists()
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            // check if email already exists
            if (!user) {
                return res.status(400).json({
                    error: [
                        {
                            msg: "Invalid credentials"
                        }
                    ]
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    error: [
                        {
                            msg: "Invalid credentials"
                        }
                    ]
                });
            }

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
