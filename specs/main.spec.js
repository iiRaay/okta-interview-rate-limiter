const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../main');

chai.use(chaiHttp);

const { request, expect } = chai;

describe('GET /', () => {
 
  it('responds with hello world', async () => {
    const response = await request(app).get('/');

    expect(response.status).to.equal(200);
    expect(response.text).to.equal('Hello World!');
  });
  
});

describe('POST /take', () => {
    it('should return 400 for missing endpoint query param', async () => {
        const response = await chai.request(app).post('/take').send();

        expect(response).to.have.status(400);
        expect(response.body).to.deep.equal({ error: 'Bad request - endpoint query param required' });
    });

    it('should return rate limit response', async () => {
        // Replace with your specific test case for rate limiting behavior
        const response = await chai.request(app).post('/take').query({ endpoint: 'GET /user/123' });

        expect(response).to.have.status(200); // or 401 depending on rate limit state
        expect(response.body).to.have.property('message').that.includes('Request Accepted');
        expect(response.body).to.have.property('remainingTokens').that.is.a('number');
    });
});