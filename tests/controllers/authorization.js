global.DrawMe = require('../../lib/draw_me.js');

DrawMe.logger.remove(DrawMe.logger.transports.Console);

const request = require('supertest'),
      Server  = require('../../http server/server'),
      server  = new Server(3000);

server.initializeExpress();

const app = server.app;

const testData = {
    login   : 'somelogin',
    email   : 'email@domain.com',
    name    : 'some field',
    surname : 'some field',
    token   : 'some field'
}

describe('Регистрация', function() {
    before(function(done) {
        DrawMe.models.User.destroy({where: {}}).then(function() {
            done();
        });
    });

    it('Должен требовать поля login и email при регистрации', function(done) {
        request(app)
            .post('/user/register')
            .set('Accept', 'application/json')
            .type('json')
            .expect(400)
            .expect({
                'type': 'error',
                'data': 'В запросе не хватает полей: login, email'
            })
            .end(done);
    });

    it('Не пускает с некорректным логином', function(done) {
        request(app)
            .post('/user/register')
            .set('Accept', 'application/json')
            .type('json')
            .send(JSON.stringify({login: 'afd', email: 'email@domain.com'}))
            .expect(400)
            .expect(/Некорректный логин/)
            .end(done);
    });

    it('Не пускает с некорректным email', function(done) {
        request(app)
            .post('/user/register')
            .set('Accept', 'application/json')
            .type('json')
            .send(JSON.stringify({login: 'normallogin', email: 'asdkfjalksdjf'}))
            .expect(400)
            .expect(/Некорректный email/)
            .end(done);
    });

    it('Должен регистрировать нового пользователя', function(done) {
        request(app)
            .post('/user/register')
            .set('Accept', 'application/json')
            .type('json')
            .send(JSON.stringify(testData))
            .end(function(err, res) {
                if (err) return done(err);
                
                DrawMe.models.User.count().then(function(count) {
                    if (count !== 1) {
                        return done(new Error('Новый юзер не был создан!'));
                    }

                    done();
                })
            });
    });
});
