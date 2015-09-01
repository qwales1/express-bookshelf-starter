var should = require('should');
describe('Base Controller', function(){
  it('should throw if not passed a model constructor when instantiated', function(done){
    (function(){
      var Controller = require('../../controllers/base');
      var controller = new Controller();
    }).should.throw('Controller needs a valid model');
    done();
  });
  it('should not throw when passed a model constructor when instantiated', function(done){
    var BaseModel = require('../../models/base');
    (function(){
      var Controller = require('../../controllers/base');
      var controller = new Controller(BaseModel);
    }).should.not.throw();
    done();
  });
  it('should have getCollection method', function(done){
    var BaseModel = require('../../models/base');
    var Controller = require('../../controllers/base');
    var controller = new Controller(BaseModel);
    controller.should.have.property('getCollection');
    done();
  });
  it('should have getModel method', function(done){
    var BaseModel = require('../../models/base');
    var Controller = require('../../controllers/base');
    var controller = new Controller(BaseModel);
    controller.should.have.property('getModel');
    done();
  });
  describe('#_expandRelationships() method', function(){
    it('should return return empty object if no relations are specified', function(done){
      var BaseModel = require('../../models/base');
      var Controller = require('../../controllers/base');
      var controller = new Controller(BaseModel);
      controller._expandRelationships().then(function(result){
        result.should.be.an.Object;
        var keys = Object.keys(result);
        keys.length.should.be.exactly(0);
        done();
      })
      .catch(function(err){
        done(err);
      })
    });
    it('should return return an object with the parsed relations', function(done){
      var BaseModel = require('../../models/base');
      var Controller = require('../../controllers/base');
      var controller = new Controller(BaseModel);
      controller._expandRelationships({expand:'attributes,products,access'}).then(function(result){
        result.should.be.an.Object;
        result['withRelated'].should.be.an.Array;
        result['withRelated'].indexOf('attributes').should.not.be.exactly(-1);
        result['withRelated'].indexOf('products').should.not.be.exactly(-1);
        result['withRelated'].indexOf('access').should.not.be.exactly(-1);
        done();
      })
      .catch(function(err){
        done(err);
      })
    });
  });
});
