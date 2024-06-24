const { createTokenBucket } = require('./tokenBucket');
const config = require('./config.json');

const rateLimiters = {}; // can export and read fill list if we nee doutside of here?

// init endpionts with tokenbuckets
config.rateLimitsPerEndpoint.forEach(endpointConfig => {
    const { endpoint, burst, sustained } = endpointConfig;
    rateLimiters[endpoint] = createTokenBucket(burst, sustained);
})

// check if request is valid or denied within rates
const isAllowed = endpoint => {
    const tokenBucket = rateLimiters[endpoint]; //get endpoint for rate limtier
    if(tokenBucket) {
        const {accepted, remainingTokens } = tokenBucket(); // returns from 'take' and consume token
        return { accepted, remainingTokens };
    } else {
        return { accepted: false, remainingTokens: 0 }; //endpoint doesnt exist
    }
}

module.exports = { isAllowed };