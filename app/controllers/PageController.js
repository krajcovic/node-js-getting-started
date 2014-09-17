var Page = require(process.cwd() + '/app/models/Page')
  , filters = {};
  
filters.url = require(process.cwd() + '/lib/filters/url');
var error = require(process.cwd() + '/lib/error');
var util = require(process.cwd() + '/lib/util');


/**
 * Nahraje stranku podle URL.
 * 
 * Automaticky pred zpracovanim akce controlleru nahraje
 * konkretni stranku z kolekce. Dokument pak bude dostupny
 * pres req.page. Pokud stranka v databazi neexistuje, 
 * preda chybu 404 k dalsimu zpracovani.
 * 
 * @param {ServerRequest} req
 * @param {String} url
 * @param {Function} cb
 */

exports.load = function(req, url, cb) {
  Page.findOneByUrl(url, cb);
};


/**
 * GET /pages
 */
exports.index = function(req, res, next){
    if (!Page.inSchema(req.zdrojak.fields)) {
        return next(400);
    }
    
    Page.find({}, req.zdrojak.fields, function(err, docs) {
        if (err) return next(err);
        res.json(docs);
    });
};

/**
 * GET /pages/:page
 */
exports.show = function(req, res, next){
    res.send(req.page);
};

/**
 * POST /pages
 * 
 * @todo
 */
exports.create = function(req, res, next){
    var page = new Page();
    page.title = req.body.title;
    page.url = filters.url(req.body.title);
    page.content = req.body.content;
    page.save(function(err, doc) {
        if (err) return next(err);
        var location = util.fullUrl('/' + req.path + '/' + doc.url, req);
        res.setHeader('location', location);
        res.send(201);
    });
};

/**
 * PUT /pages/:page
 * 
 */
exports.update = function(req, res, next){
    req.page.title = req.body.title;
    req.page.content = req.body.content;
    req.page.save(function(err, doc) {
        if (err) return next(err);
        res.json(doc);
    });
};

/**
 * DELETE /pages/:page
 * 
 */
exports.destroy = function(req, res, next){
    req.page.remove(function(err, doc) {
        if (err) return next(err);
        // res.json(doc);
        res.send(204);
    });
};