const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { createTokenBucket } = require('../tokenBucket');
const { isAllowed } = require('../rateLimiter');

chai.use(chaiHttp);

describe('Rate limiter', () => {
    // test cases come from config file - can
    it('should allow req if tokens avail', () => {
        const endpoint = 'GET /test';
        const { accepted, remainingTokens } = isAllowed(endpoint);
        expect(accepted).to.equal(true);
        expect(remainingTokens).to.be.a('number');
        expect(remainingTokens).to.be.at.least(0);
    })
    
    it('should deny request with no tokens', () => {
        const endpoint = 'GET /test';
        
        // use all tokens
        for (let i = 0; i < 11; i++) {
            isAllowed(endpoint);
        }

        const { accepted, remainingTokens } = isAllowed(endpoint);
        expect(accepted).to.equal(false);
        expect(remainingTokens).to.equal(0);
    
    })
    
    it('should wait for token to replenish and pass', done => {
        const endpoint = 'GET /test';
        // token replish rate 10/min = 1 every 6 -> 2 extra in 12s
        // use all tokens
        for (let i = 0; i < 11; i++) {
            isAllowed(endpoint);
        }
        
        //delay for 12s before running again
        setTimeout(() => {
          const { accepted, remainingTokens } = isAllowed(endpoint);
          expect(accepted).to.equal(true);
          expect(remainingTokens).to.equal(1); // should have gotten 2 from the wait and use 1
          done();
        }, 12500);
    }).timeout(15000) // override default 2000ms so token can replninish 1
});