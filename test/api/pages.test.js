var request = require('supertest')
  , async = require('async')
  , app = require(process.cwd() + '/app')
  , Page = require(process.cwd() + '/app/models/Page');
  
//testovaci data
var data = [
    {title: 'Stranka 1', url: 'stranka-1', content: 'lorem ipsum'},
    {title: 'Stranka 2', url: 'stranka-2', content: 'lorem ipsum 2'}
];

//vlozeni jednoho radku do databaze
function save(doc) {
    return function(cb) {
        var page = new Page();
        for (var field in doc) {
            page[field] = doc[field];
        }
        page.save(cb);         
    }        
}
  
describe('API pages', function(){
    
    beforeEach(function(done) {
        Page.remove({}, function(err){
            if (err) return done(err);
            async.parallel([
                save(data[0]), save(data[1])
            ], done);
        }); 
    });
    
    describe('GET /v1/api/pages', function(){
        it('vrati seznam vsech polozek v databazi', function(done){
            request(app)
                .get('/v1/api/pages')
                .expect(200)
                .end(function(err, res) {
                    res.body.length.should.eql(2);
                    res.body[0].should.include(data[0]);
                    done();
                });
        });
        it('vrati jen urcene sloupce', function(done){
            request(app)
                .get('/v1/api/pages?fields=url')
                .expect(200)
                .end(function(err, res) {
                    res.body.length.should.eql(2);
                    res.body[0].should.not.include({
                        title: 'Stranka 1', content: 'lorem ipsum'
                    });
                    done();
                });
        });
        it('vrati kod 400 pri zadani pole, ktere neexistuje v databazi', function(done){
            request(app)
                .get('/v1/api/pages?fields=abc')
                .expect(400, done);
        })
    })  
    
    describe('GET /v1/api/pages/:page', function(){
        it('vrati detail jedne stranky', function(done){
            request(app)
                .get('/v1/api/pages/stranka-1')
                .expect(200)
                .end(function(err, res) {
                    res.body.should.include(data[0]);
                    done();
                });
        });
        it('vrati 404, pokud stranka neexistuje', function(done){
            request(app)
                .get('/v1/api/pages/neexistuje')
                .expect(404, done);
        });
    });
    
    describe('POST /v1/api/pages', function(){
        it('vlozi novou stranku do databaze', function(done){
            request(app)
                .post('/v1/api/pages')
                .send({title: 'titulek ABC', content: 'lorem ipsum set dolorem'})
                .expect(200)
                .end(function(err, res){
                    Page.findOne({title: 'titulek ABC'}, function(err, doc) {
                        doc.title.should.equal('titulek ABC');
                        doc.content.should.equal('lorem ipsum set dolorem');
                        done();
                    });
                });
        });
        it('vrati 400, pokud chybi titulek nebo obsah', function(done){
            request(app).post('/v1/api/pages')
                .expect(400, done);
        });
    });
    
    describe('PUT /v1/api/pages/:page', function(){
        it('upravi obsah stranky', function(done){
            request(app)
                .put('/v1/api/pages/stranka-1')
                .send({title: 'titulek ABC', content: 'lorem ipsum set dolorem'})
                .expect(200)
                .end(function(err, res){
                    Page.findOne({title: 'titulek ABC'}, function(err, doc) {
                        doc.title.should.equal('titulek ABC');
                        doc.content.should.equal('lorem ipsum set dolorem');
                        done();
                    });
                });
        });
        it('vrati 400, pokud chybi titulek nebo obsah', function(done){
            request(app)
                .put('/v1/api/pages/stranka-1')
                .expect(400, done);
        });
        it('vrati 404, pokud stranka neexistuje', function(done){
            request(app)
                .put('/v1/api/pages/neexistuje')
                .expect(404, done);
        });
    });
    
    describe('DELETE /v1/api/pages/:page', function(){
        it('smaze stranku z databaze', function(done){
            request(app)
                .del('/v1/api/pages/stranka-1')
                .expect(200)
                .end(function(err, res){
                    Page.count({url: 'stranka-1'}, function(err, count) {
                        count.should.eql(0);
                        done();
                    });
                });
        });
        it('vrati 404, pokud stranka neexistuje', function(done){
            request(app)
                .del('/v1/api/pages/neexistuje')
                .expect(404, done);
        });
    });
    
});