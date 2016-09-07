const passport    = require("passport"),
      passportJWT = require("passport-jwt"),
      ExtractJwt  = passportJWT.ExtractJwt,
      Strategy    = passportJWT.Strategy,
      params = {
          secretOrKey: DrawMe.config.webserver.jwtSecret,
          jwtFromRequest: ExtractJwt.fromAuthHeader()
      };

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
        var user = null;

        if (user) {
            return done(null, {id: user.id});
        } else {
            return done(new Error("User not found"), null);
        }
    });

    passport.use(strategy);

    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", {session: false});
        }
    };
};
