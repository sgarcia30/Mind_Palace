const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe ('server', function() {

  before(function() {
   	return runServer();
  });

  after(function() {
    return closeServer();
  });

	it('should return a 200 status code and HTML on GET', function () {
	  return chai.request(app)
	  .get('/')
	  .then(function(res) {
	    res.should.have.status(200);
	  });
	});
});