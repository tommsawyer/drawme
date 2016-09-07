const express = require('express'),
      router  = express.Router();

const routers = {
    User: {
        Auth: require('./user/auth') 
    }
};

router.use('/user', routers.User.Auth);

module.exports = router;
