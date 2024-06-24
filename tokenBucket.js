const createTokenBucket = (burst, sustained) => {
    let tokens = burst;
    let lastChecked = Date.now();
    let refillInterval = 1000 / sustained; // used for adding token
    
    
    // calculate tokens left
    const refill = () => {
        const now = Date.now();
        const elapsed = (now - lastChecked) / 1000; // time elaspsed in secs
        lastChecked = now;
        
        // token calc
        const refillTokens = Math.floor(elapsed * (sustained / 60)); // rate per min
        console.log("refill tokens: " , refillTokens,  tokens + refillTokens);
        tokens = Math.min(burst, tokens + refillTokens); // tokens left + refill or init tokens
        // update refill interval
        refillInterval = tokens < burst ? 1000 / sustained : 1000;
    }

    // schedule refill
    //req 5: The refilling of tokens should happen as soon as possible,
    const scheduleRefill = () => {
        refill();
        setTimeout(scheduleRefill, refillInterval * 1000); // Convert refillInterval to milliseconds
    };
    
    scheduleRefill();
    
    
    const take = () => {
        refill(); // update tokens based on time called
        if(tokens >= 1) {
          // If the limit for the specified route is not exceeded, the endpoint should consume one 
          // token and return a response with the number of remaining tokens and confirmation the 
          // request should be accepted.
            tokens--;
            return { accepted: true, remainingTokens: tokens };
        } else {
            return { accepted: false, remainingTokens: tokens };
        }
    }
    
    return take; // this is returned when function called
}

module.exports = { createTokenBucket };
