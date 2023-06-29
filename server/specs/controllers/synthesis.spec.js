const expect  = require("chai").expect;
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

let url = "http://localhost:3000";

describe("POST /synthesis", function() {
    let urlParams = '?shortname=logora-demo&uid=test'

    describe("All parameters are valid", function() {
        it('should return a 200', function(done) { 
            chai.request(url)
                .post(`/synthesis${urlParams}`)
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
                .post(`/synthesis${urlParams}`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success');
                    expect(res.body).to.have.property('debate');
                    expect(res.body).to.have.property('content');
                    expect(res.body.content.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe("Parameter \"shortname\" is missing", function() {
        it('should return a 400', function(done) { 
            chai.request(url)
                .post(`/synthesis?uid=test`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false)
                    done();
                });
        });

        it('should return an explanation as error message', function(done) { 
            chai.request(url)
                .post(`/synthesis?uid=test`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.error).to.equal("Missing application shortname.")
                    done();
                });
        });
    });

    describe("Parameter \"uid\" is missing", function() {
        it('should return a 400', function(done) { 
            chai.request(url)
                .post(`/synthesis?shortname=logora-demo`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false)
                    done();
                });
        });

        it('should return an explanation as error message', function(done) { 
            chai.request(url)
                .post(`/synthesis?shortname=logora-demo`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.error).to.equal("Missing page identifier.")
                    done();
                });
        });
    });

    describe("Get synthesis fails to return a 200", function() {
        describe("config.source is undefined", function() {
            it('should return a 404', function(done) {
                chai.request(url)
                    .post(`/synthesis?shortname=logora-demo&uid=404`)
                    .set('content-type', 'application/json')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body.error).to.equal("Resource (config.source) is not defined.")
                        done();
                    });
            });
        });

        // describe("config.modules.comments is true", function() {
        //     it('should return a 200', function(done) {
        //         chai.request(url)
        //             .post(`/synthesis?shortname=logora-demo&uid=404`)
        //             .set('content-type', 'application/json')
        //             .end(function(err, res) {
        //                 expect(res).to.have.status(200);
        //                 done();
        //             });
        //     });
        // });
    });
});