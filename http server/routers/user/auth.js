const express = require('express'),
      router  = express.Router();

const Controllers = require('../../controllers');

router.post('/register', Controllers.Common.fieldsMustPresent(['login', 'email']),
                         Controllers.User.Auth.Register);

module.exports = router;

