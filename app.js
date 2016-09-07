global.DrawMe = require('./lib/draw_me.js');

const Server = require('./http server/server');
const server = new Server(DrawMe.config.webserver.port);

server.run().then(function() {
    DrawMe.logger.log('info', 'Сервер успешно запущен на порту ' + DrawMe.config.webserver.port);
});
