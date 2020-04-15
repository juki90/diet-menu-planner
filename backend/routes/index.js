const router = require('express').Router();
const axios = require('axios');
const encodeurl = require('encodeurl');
const auth = require('../middleware/auth');
const { user } = require('../controllers');

router.post('/register', user.register);
router.post('/login', user.login);
router.post('/', auth, user.save);

router.post('/search', (req, res) => {
  const { search, ua } = req.body;
  const searchEncoded = encodeurl(search);

  axios({
    url: `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchEncoded}&search_simple=1&action=process&json=1`,
    method: 'get',
    headers: {
      'User-Agent': `DietMenuPlanner - ${ua} - Version 1.0`,
    },
  })
    .then(data => {
      res.json(data.data);
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send('Server Error');
    });
});

module.exports = router;
