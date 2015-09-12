var express = require('express');
var _ = require('lodash');
var bodyParser = require('body-parser');

var BaseRouter = function(controller, opts){
  'use strict';
  var opts = opts || {};
  var router = express.Router();
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({extended: true}));
  if(opts.preRoutes && _.isFunction(opts.preRoutes)){
    router.use('/', opts.preRoutes);
  }
  router.get('/', function(req,res){
    var params = req.query;
    controller.getCollection(params)
    .then(function(collection){
      res.json(collection.toJSON());
    }).catch(function(){
      res.status(404);
      res.json([]);
    });
  });
  router.get('/:id', function(req,res){
      controller.getModel(req.params, req.query)
      .then(function(model){
        res.json(model.toJSON());
      }).catch(function(){
        res.status(404);
        res.json({});
      });
  });
  router.post('/', function(req,res){
      controller.saveModel(req.body)
      .then(function(model){
        res.status(201);
        res.json(model.toJSON());
      }).catch(function(err){
        res.status(400);
        res.json(JSON.stringify(err));
      });
  });
  router.post('/:id/delete', function(req,res){
      controller.deleteModel(req.params.id)
      .then(function(model){
        res.json(model.toJSON());
      }).catch(function(err){
        res.status(400);
        res.json(JSON.stringify(err));
      });
  });
  router.post('/:id/update', function(req,res){
    var idAttr = new controller.model().idAttribute;
    if(_.isUndefined(req.body[idAttr])){
      req.body[idAttr] = req.params.id;
    }
    controller.saveModel(req.body)
    .then(function(model){
      res.json(model.toJSON());
    }).catch(function(err){
      res.status(400);
      res.json(JSON.stringify(err));
    });
  });
  router.put('/:id', function(req,res){
    var idAttr = new controller.model().idAttribute;
    if(_.isUndefined(req.body[idAttr])){
      req.body[idAttr] = req.params.id;
    }
    controller.saveModel(req.body)
      .then(function(model){
        res.json(model.toJSON());
    }).catch(function(err){
      res.status(400);
      res.json(JSON.stringify(err));
    });
  });
  router.delete('/:id', function(req,res){
      controller.deleteModel(req.params.id)
      .then(function(model){
        res.json(model.toJSON());
      }).catch(function(err){
        res.status(400);
        res.json(JSON.stringify(err));
      });
  });
  if(opts.postRoutes && _.isFunction(opts.postRoutes)){
    router.use('/', opts.postRoutes)
  }
  return router;
};

module.exports = BaseRouter;
