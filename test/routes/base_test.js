var request = require('supertest');
var should = require('should');
var sinon = require('sinon');
var express = require('express');
var _ = require('lodash');
function loadFixture(name){
  var path = require('path');
  return JSON.parse(require('fs')
  .readFileSync(path.join(__dirname, '..', '/fixtures/'+ name)));
}
describe('Base Routes', function(){
  var BaseController = require('../../controllers/base');
  var controller;
  var BaseModel = require('../../models/base');
  var model = _.extend(BaseModel,{idAttribute : 'id'});

  beforeEach(function(done){
    controller = new BaseController(model);
    done();
  });
  it('GET / calls Controller.getCollection once', function(done){
    sinon.spy(controller, "getCollection");
    var route = require('../../routes/base')(controller);
    var app = express();
    app.use('/', route);
    var agent = request.agent(app);
    agent
    .get('/')
    .end(function(err,res){
      if(err) done(err);
      controller.getCollection.calledOnce.should.be.exactly(true);
      done();
    });
  });
  it('POST / calls Controller.saveModel once', function(done){
    sinon.spy(controller, "saveModel");
    var route = require('../../routes/base')(controller);

    var app = express();
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/', route);
    var agent = request.agent(app);
    var testObj = {"id" : 5};
    agent
    .post('/')
    .type('application/json')
    .send(testObj)
    .end(function(err,res){
      if(err) done(err);
      controller.saveModel.calledOnce.should.be.exactly(true);
      done();
    });
  });
  it('GET /:id calls Controller.getModel once', function(done){
    sinon.spy(controller, "getModel");
    var route = require('../../routes/base')(controller);
    var app = express();
    app.use('/', route);
    var agent = request.agent(app);
    agent
    .get('/12121')
    .end(function(err,res){
      if(err) done(err);
      controller.getModel.calledOnce.should.be.exactly(true);
      done();
    });
  });
  it('PUT /:id calls Controller.saveModel once', function(done){
    sinon.spy(controller, "saveModel");
    var route = require('../../routes/base')(controller);
    var bodyParser = require('body-parser');
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/', route);
    var agent = request.agent(app);
    var testObj = {"id" : 5};
    agent
    .put('/121')
    .type('application/json')
    .send(testObj)
    .end(function(err,res){
      if(err) done(err);
      controller.saveModel.calledOnce.should.be.exactly(true);
      done();
    });
  });
  it('DELETE /:id calls Controller.deleteModel once', function(done){
    sinon.spy(controller, "deleteModel");
    var route = require('../../routes/base')(controller);
    var bodyParser = require('body-parser');
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/', route);
    var agent = request.agent(app);
    var testObj = {"name" : "chris"};
    agent
    .delete('/121')
    .type('application/json')
    .send(testObj)
    .end(function(err,res){
      if(err) done(err);
      controller.deleteModel.calledOnce.should.be.exactly(true);
      done();
    });
  });
  it('POST /:id/update calls Controller.saveModel once', function(done){
    sinon.spy(controller, "saveModel");
    var route = require('../../routes/base')(controller);
    var bodyParser = require('body-parser');
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/', route);
    var agent = request.agent(app);
    var testObj = {"id" : 5};
    agent
    .post('/')
    .type('application/json')
    .send(testObj)
    .end(function(err,res){
      if(err) done(err);
      controller.saveModel.calledOnce.should.be.exactly(true);
      done();
    });
  });
  it('POST /:id/delete calls Controller.deleteModel once', function(done){
    sinon.spy(controller, "deleteModel");
    var route = require('../../routes/base')(controller);
    var bodyParser = require('body-parser');
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/', route);
    var agent = request.agent(app);
    var testObj = {"id" : 5};
    agent
    .post('/121/delete')
    .type('application/json')
    .send(testObj)
    .end(function(err,res){
      if(err) done(err);
      controller.deleteModel.calledOnce.should.be.exactly(true);
      done();
    });
  });
  it('Pre Routes should be used at the top of the stack', function(done){
      sinon.spy(controller, "getCollection");
      //set up route to test
      var preRoutes = express.Router();
      preRoutes.get('/', function(req,res){
          res.json({'status': 'ok'});
      });
      var routeOpts = {preRoutes: preRoutes}
      var route = require('../../routes/base')(controller, routeOpts);
      var app = express();
      app.use('/', route);
      var agent = request.agent(app);
      agent
      .get('/')
      .expect(200)
      .end(function(err,res){
        if(err) done(err);
        controller.getCollection.calledOnce.should.be.exactly(false);
        res.body.should.have.property('status');
        done();
      });
  });
  it('Post Routes should be used at the bottom of the stack', function(done){
      sinon.spy(controller, "getCollection");
      //set up route to test
      var postRoutes = express.Router();
      postRoutes.get('/', function(req,res){
          res.json({'status': 'ok'});
      });
      var routeOpts = {postRoutes: postRoutes}
      var route = require('../../routes/base')(controller, routeOpts);
      var app = express();
      app.use('/', route);
      var agent = request.agent(app);
      agent
      .get('/')
      .end(function(err,res){
        if(err) done(err);
        controller.getCollection.calledOnce.should.be.exactly(true);
        done();
      });
  });
  
  
});
