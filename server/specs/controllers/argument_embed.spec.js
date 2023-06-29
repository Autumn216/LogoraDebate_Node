const expect  = require("chai").expect;
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

let url = "http://localhost:3000";

describe("POST /embed/argument", function() {
    let urlParams = '?shortname=logora-demo&id=1'

    describe("All parameters are valid", function() {
        it('should return a 200', function(done) { 
            chai.request(url)
                .post(`/embed/argument${urlParams}`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(true)
                    done();
                });
        });

        it('should return a valid response object', function(done) { 
            chai.request(url)
                .post(`/embed/argument${urlParams}`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success');
                    expect(res.body).to.have.property('resource');
                    expect(res.body).to.have.property('html');
                    expect(res.body.html.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe("Parameter \"id\" is missing", function() {
        it('should return a 404', function(done) { 
            chai.request(url)
                .post(`/embed/argument?shortname=logora-demo`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body.error).to.equal("ID parameter is missing.");
                    done();
                });
        });
    });

    describe("Data fetching error", function() {
        it('should return a 500', function(done) { 
            chai.request(url)
                .post(`/embed/argument?shortname=logora-demo&id=500`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });
});