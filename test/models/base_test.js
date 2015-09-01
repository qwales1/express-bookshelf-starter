var should = require('should');
var _ = require('lodash');
describe('Base Model', function(){
  var model;
  beforeEach(function(done){
    var BaseModel = require('../../models/base');
    var Model = BaseModel.extend({
      entityType : 'testEntity'
    });
    model = new Model();
    done();
  });
  describe('should emit events', function(){
    it('when an entity is saving', function(done){
      model.on('testEntity:saving', function(entity){
        entity.type.should.be.exactly('testEntity');
        done();
      })
      model.trigger('saving');
    });
    it('when an entity is saved', function(done){
      model.on('testEntity:saved', function(entity){
        entity.type.should.be.exactly('testEntity');
        done();
      })
      model.trigger('saved');
    });
    it('when an entity is creating', function(done){
      model.on('testEntity:creating', function(entity){
        entity.type.should.be.exactly('testEntity');
        done();
      })
      model.trigger('creating');
    });
    it('when an entity is created', function(done){
      model.on('testEntity:created', function(entity){
        entity.type.should.be.exactly('testEntity');
        done();
      });
      model.trigger('created');
    });
    it('when an entity is updating', function(done){
      model.on('testEntity:updating', function(entity){
        entity.type.should.be.exactly('testEntity');
        done();
      });
      model.trigger('updating');
    });
    it('when an entity is updated', function(done){
      model.on('testEntity:updated', function(entity){
        entity.type.should.be.exactly('testEntity');
        done();
      });
      model.trigger('updated');
    });
    it('when an entity is destroying', function(done){
      model.on('testEntity:destroying', function(entity){
        entity.type.should.be.exactly('testEntity');
        done();
      });
      model.trigger('destroying');
    });
    it('when an entity is destroyed', function(done){
      model.on('testEntity:destroyed', function(entity){
        entity.type.should.be.exactly('testEntity');
        done();
      });
      model.trigger('destroyed');
    });
  });
  describe('buildQuery() method', function(){
    it('should append limit query to query when limit param is present', function(done){
      model.buildQuery({limit: 5}).then(function(alteredModel){
          alteredModel.query(function(qb){
            qb._single.limit.should.be.exactly(5)
            done();
          });
      }, function(err){
        done(err);
      });
    });
    it('should append offset query to query when offset param is present', function(done){
      model.buildQuery({offset: 0}).then(function(alteredModel){
        alteredModel.query(function(qb){
          qb._single.offset.should.be.exactly(0)
          done();
        });
      }, function(err){
        done(err);
      });
    });
    it('should append where query to query for a single additional param', function(done){
      model.buildQuery({field1: 'value'}).then(function(alteredModel){
        alteredModel.query(function(qb){
          var query = _.find(qb._statements, {column : 'field1'});
          query.should.not.be.empty;
          query.value.should.be.exactly('value');
          done();
        });
      }, function(err){
        done(err);
      });
    });
    it('should append orderByAsc query to query when orderByAsc param is present ', function(done){
      model.buildQuery({orderByAsc: 'field1'}).then(function(alteredModel){
        alteredModel.query(function(qb){
          var query = _.find(qb._statements, {grouping : 'order'});
          query.value.should.be.exactly('field1');
          query.direction.should.be.exactly('asc');
          done();
        });
      }, function(err){
        done(err);
      });
    });
    it('should should apply fuzzy search to query when fuzzy param is present ', function(done){
      model.buildQuery({field1: 'value'}).then(function(alteredModel){
        alteredModel.query(function(qb){
          var query = _.find(qb._statements, {grouping : 'order'});
          var query1 = _.find(qb._statements, {column : 'field1'});
          query1.value.should.be.exactly('value');
          done();
        });
      }, function(err){
        done(err);
      });
    });
    it('should append orderByDesc query to query when orderByDesc param is present ', function(done){
      model.buildQuery({orderByDesc: 'field1'}).then(function(alteredModel){
        alteredModel.query(function(qb){
          var query = _.find(qb._statements, {grouping : 'order'});
          query.value.should.be.exactly('field1');
          query.direction.should.be.exactly('desc');
          done();
        });
      }, function(err){
        done(err);
      });
    });
    it('should append where query to query for multiple additional params', function(done){
      model.buildQuery({field1: 'value1', field2: 'value2', fuzzy: true}).then(function(alteredModel){
        alteredModel.query(function(qb){
          var query1 = _.find(qb._statements, {column : 'field1'});
          query1.should.not.be.empty;
          query1.value.should.be.exactly('%value1%');
          var query2 = _.find(qb._statements, {column : 'field2'});
          query2.should.not.be.empty;
          query2.value.should.be.exactly('%value2%');
          done();
        });
      }, function(err){
        done(err);
      });
    });
    it('should append where query when all default params are present', function(done){
      model.buildQuery({orderByDesc : 'field1', field1: 'value1', field2: 'value2', limit : 5, offset : 10, fuzzy: true}).then(function(alteredModel){
        alteredModel.query(function(qb){
          qb._single.offset.should.be.exactly(10)
          qb._single.limit.should.be.exactly(5)
          var query1 = _.find(qb._statements, {column : 'field1'});
          query1.should.not.be.empty;
          query1.value.should.be.exactly('%value1%');
          var query2 = _.find(qb._statements, {column : 'field2'});
          query2.should.not.be.empty;
          query2.value.should.be.exactly('%value2%');
          var query3 = _.find(qb._statements, {grouping: 'order'});
          query3.value.should.be.exactly('field1');
          query3.direction.should.be.exactly('desc');
          done();
        });
      }, function(err){
        done(err);
      });
    });
  });
});
