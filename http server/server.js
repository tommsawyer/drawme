'use strict';

const express    = require('express'),
      Router     = require('./routers'),
      BodyParser = require('body-parser'),
      auth       = require('../lib/auth_config'),
      JSONError  = require('../lib/json_error');

const PATH_TO_STATIC_CONTENT = __dirname + '/../public';

class Server {
    /**
     * HTTP-сервер на основе Express
     * @param port - порт, на котором будет запущен сервер
     */
    constructor(port) {
        this.port = port;
        this.app  = express();
    }

    /**
     * Инициализирует Express-сервер
     */
    initializeExpress() {
        this.app.use(express.static(PATH_TO_STATIC_CONTENT));
        this.app.use(BodyParser.json());
//        this.app.use(auth.initialize);

        this.app.use(this._initRequestMiddleware.bind(this));

        this.app.use(Router);

        this.app.use(this._notFoundMiddleware.bind(this));
        this.app.use(this._errorHandlerMiddleware.bind(this));

        DrawMe.logger.log('info', 'Подключил контроллеры, настроил роуты');
    }

    /**
     * Стартует сервер и слушает переданный в конструктор порт
     *
     * @returns {Promise} - промис, который резолвится если сервер успешно стартанул,
     * и реджектится с ошибкой в обратном случае
     */
    run() {
        var self = this;

        self.initializeExpress();

        return new Promise(function(resolve, reject) {
            self.app.listen(self.port, function(err) {
                if (err) reject(err);
                resolve(self);
            });
        });
    }

    /**
     * Получает используемую процессом память в мегабайтах
     * @returns {number} Размер используемой памяти в мегабайтах
     */
    getUsedMemoryInMB() {
        return process.memoryUsage().heapUsed / 1024 / 1024;
    }

    /**
     * Миддлвеар, отвечающий за ненайденный ресурс на сервере
     * @param req - объект запроса
     * @param res - объект ответа
     * @param next - функция передачи управления следующему миддлвеару
     * @private
     */
    _notFoundMiddleware(req, res, next) {
        // передаем управление обработчику ошибок
        var jsonError = new JSONError('Неизвестный тип и/или путь запроса', req.method + ' ' + req.url, 404);
        next(jsonError);
    }

    /**
     * Миддлвеар, отвечающий за обработку ошибок
     * @param err - произошедшая ошибка
     * @param req - объект запроса
     * @param res - объект ответа
     * @param next - функция передачи управления следующему миддлвеару
     * @private
     */
    _errorHandlerMiddleware(err, req, res, next) {
        DrawMe.logger.log('error', err);

        if (err instanceof JSONError) {
            var errorMessage = err.toClient();

            DrawMe.logger.log('info', 'Отправляю клиенту JSON с ошибкой: ' + errorMessage);
            res
                .status(err.code)
                .end(errorMessage);
            return;
        }

        res.status(500).end('Internal server error');
    }

    /**
     * Миддлвеар, инициализирующий запрос. Логирует информацию о запросе, устанавливает заголовки,
     * добавляет функцию JSONAnswer
     * @param req - объект запроса
     * @param res - объект ответа
     * @param next - функция передачи управления следующему миддлвеару
     * @private
     */
    _initRequestMiddleware(req, res, next) {
        this._logRequestInfo(req);
        this._setHeaders(res);

        res.JSONAnswer = this._generateJSONAnswerFunctionForRequest(req, res);

        next();
    }

    /**
     * Устанавливает предварительные заголовки для ответа
     * @param response - объект ответа клиенту
     * @private
     */
    _setHeaders(response) {
        // Позволяет слать запросы с любого URL
        response.header('Access-Control-Allow-Origin', '*');
        // Тип ответа - JSON
        response.set({'content-type': 'application/json; charset=utf-8' })
    }

    /**
     * Записывает метод, урл и параметры запроса в логи
     * @param request - объект запроса
     * @private
     */
    _logRequestInfo(request) {
        DrawMe.logger.log('info', `${request.method} ${request.url}`);

        if (request.method === 'POST') {
            DrawMe.logger.log('info', 'Тело запроса: ' + JSON.stringify(request.body));
        }
    }

    /**
     * Генерирует функцию JSONAnswer для этого запроса
     * @param req - объект запроса
     * @param res - объект ответа
     * @returns {Function} - функция JSONAnswer для этого запроса
     * @private
     */
    _generateJSONAnswerFunctionForRequest(req, res) {
        return function(type, data, code) {
            var answer = JSON.stringify({
                'type': type,
                'data': data
            });

            DrawMe.logger.log('info', 'Отправляю JSON клиенту: ' + answer);
            res.status(code || 200).end(answer);
        };
    }
}

module.exports = Server;
