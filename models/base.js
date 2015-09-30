var Checkit = require('checkit');
var conn = require('../config/db.js')()
var knex = require('knex')(conn)
var bookshelf = require('bookshelf')(knex);
var Promise = require('bluebird');
var _ = require('lodash');
Checkit.Validator.prototype.unique = function(val,table,id,column,label) {
  var uniqueQuery =  knex.raw('DESCRIBE ' + table)
  .then(function(resp){
    if(resp.length > 0){
      var primaryKey = _.find(resp[0], {Key : 'PRI'}).Field
      return knex(table).where(column, '=', val).andWhere(primaryKey, '!=', id).then(function(resp) {
        if(resp.length > 0) {
          throw new Checkit.ValidationError('The '+ label +' is already in use.');
        }
      });
    }
  })
  return uniqueQuery;
};
var BaseModel = bookshelf.Model.extend({

  ///////////////////////////////
  //
  // Constructor
  // set up default event listeners
  //
  ///////////////////////////////

  constructor: function() {

    bookshelf.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
    this.on('saving', this.notify.bind(this, 'saving'));
    this.on('saved', this.notify.bind(this, 'saved'));
    this.on('creating', this.notify.bind(this, 'creating'));
    this.on('created', this.notify.bind(this, 'created'));
    this.on('updating', this.notify.bind(this, 'updating'));
    this.on('updated', this.notify.bind(this, 'updated'));
    this.on('destroying', this.notify.bind(this, 'destroying'));
    this.on('destroyed', this.notify.bind(this, 'destroyed'));

  },

  ///////////////////////////////
  //
  // Runs Checkit validations on model
  //
  ///////////////////////////////

  validate: function(model) {
      if(model && _.isFunction(model.validations)){
        var checkit = new Checkit(model.validations());
        return checkit.run(model.toJSON());
      }
  }.bind(this),

  ///////////////////////////////
  //
  // Emits events with custom
  // pattern
  //
  ///////////////////////////////

  notify : function(event){
    var event = this.entityType+':'+event;
    this.trigger(event, {type:this.entityType, data: this.toJSON()});
  },

  ///////////////////////////////
  //
  // buildQuery()
  // returns a default chain
  // of queries based on supplied commands
  //
  ///////////////////////////////

  buildQuery : function(params){
    return new Promise(function(resolve,reject){
        //resolve if no params
        if(!params){
          resolve(this);
        }
        //apply ordeyBy
        if(typeof params.orderByDesc !== 'undefined'){
          this.query(function(qb){
            qb.orderBy(params.orderByDesc, 'desc');
          });
        }
        if(typeof params.orderByAsc !== 'undefined'){
          this.query(function(qb){
            qb.orderBy(params.orderByAsc, 'asc');
          });
        }
        for(var prop in params){
          if(this._includeProp(prop)){
            if(!_.isUndefined(params['fuzzy'])){
              this.query('where', prop, 'LIKE', '%'+params[prop]+'%');
            } else {
              this.query('where', prop, '=', params[prop]);
            }
          }
        }
        if(typeof params.limit !== 'undefined' && +params.limit > 0){
          this.query(function(qb){
            qb.limit(+params.limit);
          })
        }
        if(typeof params.offset !== 'undefined'){
          this.query(function(qb){
            qb.offset(+params.offset);
          });
        }
        resolve(this);
        }.bind(this));
  },
  ///////////////////////////////
  //
  // _includeProp
  //  checks if property should be applied to query
  // @return bool
  //
  ///////////////////////////////

  _includeProp : function(prop){
    var excludedProps = ['limit','offset', 'fuzzy', 'expand','orderByAsc', 'orderByDesc'];
    return excludedProps.indexOf(prop) !== -1 ? false : true;
  }


});

module.exports = BaseModel;
