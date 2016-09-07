const JSONError       = require('../../lib/json_error'),
      StringResources = require('../../lib/string_resources');

module.exports = {
    fieldsMustPresent: function (fields) {
        return function(req, res, next) {
            const query = req.method === 'POST' ? req.body : req.query;

            var missingFields = fields.filter(fieldName => !query[fieldName]);

            if (missingFields.length > 0) {
                var missingFieldsError = new JSONError(StringResources.answers.ERROR,
                        StringResources.errors.FIELDS_NOT_PRESENT + missingFields.join(', '),
                        StringResources.errorCodes.BAD_REQUEST);

                return next(missingFieldsError);
            }

            next();
        };
    }
};
