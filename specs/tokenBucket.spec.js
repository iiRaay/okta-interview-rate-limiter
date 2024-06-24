const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { createTokenBucket } = require('../tokenBucket');
const { isAllowed } = require('../rateLimiter');

chai.use(chaiHttp);

describe('Token Bucket', () => {
    let tokenBucket;

    beforeEach(() => {
        // Initialize a token bucket with burst of 10 and sustained rate of 20/min
        tokenBucket = createTokenBucket(10, 20);
    });

    it('should initially have tokens equal to burst', () => {
        const { remainingTokens } = tokenBucket(); // inits 10, calling this eats one token
        expect(remainingTokens).to.equal(9);
    });

    it('should refill tokens over time according to sustained rate', (done) => {
        tokenBucket(); // Consume one token -> 10 - 1 = 9
        setTimeout(() => {
            const { remainingTokens } = tokenBucket();
            expect(remainingTokens).to.equal(9); // Tokens refilled and consume another -> 9 + 1 - 1 = 9
            done();
        }, 3000); // Wait 3 s for refill 1 token
    }).timeout(5000); 

    it('should not exceed burst limit when refilling', (done) => {
        // Consume all tokens
        for (let i = 0; i < 10; i++) {
            tokenBucket();
        }
        setTimeout(() => {
            const { remainingTokens } = tokenBucket();
            expect(remainingTokens).to.equal(2); // Should not exceed burst limit
            done();
        }, 10000); // Wait 10 seconds for sustained rate to refill 3 tokens
    }).timeout(12000);
});