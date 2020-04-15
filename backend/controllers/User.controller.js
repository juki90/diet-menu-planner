require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');

const user = {
  register: async (req, res) => {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const { email, password, state } = req.body;

    if (!email || !password) {
      return res.json({ error: 'One or both fields are not filled up' });
    }
    if (!emailRegex.test(email)) {
      return res.json({ error: 'Wrong e-mail format' });
    }
    if (password.length < 8) {
      return res.json({ error: 'Password should consist of at least 8 characters' });
    }

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.json({ error: 'User already exists' });
      }

      user = new User({
        email,
        password,
        state,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: { id: user.id },
      };

      jwt.sign(
        payload,
        process.env.SECRET,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) {
            console.log(err);
            throw err;
          }
          res.json({ token, email });
        },
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.json({ error: 'Invalid email or password' });
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.json({ error: 'Invalid email or password' });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token, state: user.state });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server Error' });
    }
  },
  save: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const { state } = req.body;
      user.state = state;
      await user.save();
      res.json({ ok: 'Success' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
};

module.exports = user;
