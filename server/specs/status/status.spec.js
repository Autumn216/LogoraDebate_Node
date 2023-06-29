const expect  = require("chai").expect;
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

let url = "http://localhost:3000";

// By adding an argument (usually named done) to it() to a test callback, Mocha will know that it should wait for this function to be called to complete the test

describe("GET /, status endpoint", function() {
    it("returns status 200", function(done) {
        chai.request(url)
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
        });
    });

	it("returns the correct values in body response", function(done) {
        chai.request(url)
            .get('/')
            .end(function(err, res) {
                expect(res.body.success).to.equal(true);
                expect(res.body.data.name).to.equal('Logora Render API');
			    expect(res.body.data.status).to.equal('everything is alright');
                done();
        });
    });
});
