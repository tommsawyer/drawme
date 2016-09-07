const JSONError = require('../../../lib/json_error'),
      StringResources = require('../../../lib/string_resources');

module.exports = {
    Register: function (req, res, next) {
        const loginRexExp = /[\d|\w]{5,20}/,
              emailRegExp = /.+@.+\..+/;

        if (!loginRexExp.test(req.body.login)) {
            var uncorrectLoginError = new JSONError(StringResources.answers.ERROR,
                    StringResources.errors.UNCORRECT_LOGIN,
                    StringResources.errorCodes.BAD_REQUEST);

            return next(uncorrectLoginError);
        };

        if (!emailRegExp.test(req.body.email)) {
            var uncorrectEmailError = new JSONError(StringResources.answers.ERROR,
                    StringResources.errors.UNCORRECT_EMAIL,
                    StringResources.errorCodes.BAD_REQUEST);

            return next(uncorrectEmailError);
        };

        const User = DrawMe.models.User;

        User.create(req.body).then(function(result) {
            res.end('{}');
        });
    },
};
