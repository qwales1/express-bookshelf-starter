var _ = require('lodash');
var Promise = require('bluebird');
var BaseController = function(model){

  ///////////////////////////////
  //
  // make sure model has a forge method
  // to initialize model
  //
  ///////////////////////////////

  if(model && _.isFunction(model.forge)){
    this.model = model;
  } else {
    throw new Error('Controller needs a valid model');
  }

  ///////////////////////////////
  //
  // getCollection()
  // @returns a Promise of
  // a collection of objects
  //
  ///////////////////////////////

  this.getCollection = function(params){
       var model = this.model.forge();
       //initiate prefetch operations
       var preFetch = [model.buildQuery(params), this._expandRelationships(params)];
       return Promise.all(preFetch).spread(function(model, related){
          var opts = {require: true};
          //add relations if present
          if(!_.isEmpty(related)){
            opts = _.extend(opts, related);
          }
          return model.fetchAll(opts);
       });
   }.bind(this);

  /////////////////////////////
  //
  // getModel()
  // @returns a Promise of a
  // single object
  //
  /////////////////////////////

  this.getModel = function(params, query){
      var model = this.model.forge();
      var idQuery = {};
      idQuery[model.idAttribute] = params.id;
      var preFetch = [model.buildQuery(idQuery), this._expandRelationships(query)];
      return Promise.all(preFetch).spread(function(model,related){
          var opts = {require: true};
          //add relations if present
          if(!_.isEmpty(related)){
            opts = _.extend(opts, related);
          }
          return model.fetch(opts);
        });
  }.bind(this);

  ///////////////////////////////
  //
  // saveModel()
  // creates or updates a new object
  // @return a Promise of a single object
  //
  ///////////////////////////////

  this.saveModel = function(object){
    var model = this.model.forge();
    if(object.hasOwnProperty(model.idAttribute)){
      return this.getModel({id: object[model.idAttribute]})
          .then(function(model){
            model.set(object);
            return model.save();
          });
    } else {
      return model.save(object);
    }
  };

  ///////////////////////////////
  //
  // saveModels()
  // creates or updates a batch of new objects
  // @return a Promise of a collection
  // of objects
  //
  ///////////////////////////////

  this.saveModels = function(collection){
      var batch = [];
      collection.forEach(function(object){
        var model = this.model.forge();
        batch.push(model.save(object));
      }, this);
      return Promise.all(batch);
  };

  ///////////////////////////////
  //
  // deleteModel()
  // deletes the object by its ID
  // @return Promise of deleted object
  //
  ///////////////////////////////

  this.deleteModel = function(id){
    var query = {id : id};
    return this.getModel(query)
      .then(function(model){
        return model.destroy();
      });
  };

  ///////////////////////////////
  //
  // _expandRelationships
  // returns an object with the desired relationship
  // built from supplied parameters
  //
  ///////////////////////////////

  this._expandRelationships = function(relations){
    return new Promise(function(resolve, reject){
      var result = {};
      if(!_.isUndefined(relations) && relations.hasOwnProperty('expand')){
        result['withRelated'] = relations.expand.split(',');
      }
      resolve(result);
    }.bind(this));
  };
};


module.exports = BaseController;
