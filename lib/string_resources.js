const errors = {
    FIELDS_NOT_PRESENT : 'В запросе не хватает полей: ',
    UNCORRECT_LOGIN    : 'Некорректный логин. Разрешаются английские буквы и цифры, не меньше 5 и не больше 20',
    UNCORRECT_EMAIL    : 'Некорректный email'
};

const answers = {
    ERROR: 'error'
};

const errorCodes = {
    BAD_REQUEST : 400,
    OK          : 200,
};

module.exports = { errors, errorCodes, answers };
