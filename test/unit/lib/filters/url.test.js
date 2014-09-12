var url = require(process.cwd() + '/lib/filters/url');
var removeDiacritics = require('diacritics').remove;

describe('url filter', function(){
    it('prevede mezery na pomlcky', function(){
        url('nejaky nazev stranky').should.eql('nejaky-nazev-stranky');
    })  
    
    //TODO 
    //pridat dalsi testy
    it('prevede diakrituku', function() {
    	url(removeDiacritics('Příliš žluťoučký kůň úpěl ďábelské ódy')).should.eql('Prilis-zlutoucky-kun-upel-dabelske-ody');
    })
});