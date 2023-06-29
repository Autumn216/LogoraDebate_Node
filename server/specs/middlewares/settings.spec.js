const expect  = require("chai").expect;
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

let url = "http://localhost:3000";

// TODO : find a way to check if settings are correctly called and set

describe("Use settings middleware", function() {
    let urlParams = '?shortname=logora-demo&uid=test'

    describe("When requiring synthesis", function() {
        it('Should use settings middleware', function(done) { 
            chai.request(url)
                .post(`/synthesis${urlParams}`)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                    expect(res.body.success).to.equal(true)
                    done();
                });
        });
    });
});
