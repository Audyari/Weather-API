const request = require('supertest');
const app = require('../../app');

describe('Rate Limiter Tests', () => {
  describe('General Rate Limiter', () => {
    it('should allow requests under the limit', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Weather API is running');
    });
  });

  describe('Weather Endpoint Rate Limiter', () => {
    it('should allow first request to weather endpoint', async () => {
      const response = await request(app)
        .get('/api/weather/city/Jakarta')
        .expect(200);
      
      expect(response.body.status).toBe('success');
    });

    it('should block requests exceeding weather rate limit', async () => {
      // Weather limit is 10 requests per minute
      // We'll send 11 requests quickly to trigger the rate limit
      const requests = [];
      for (let i = 0; i < 11; i++) {
        requests.push(request(app).get('/api/weather/city/Jakarta'));
      }
      
      const responses = await Promise.all(requests);
      
      // Count successful and rate limited responses
      const successResponses = responses.filter(res => res.status === 200);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      console.log(`Success responses: ${successResponses.length}`);
      console.log(`Rate limited responses: ${rateLimitedResponses.length}`);
      
      // We should have at least one rate limited response
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
      
      // Check the rate limited response structure
      if (rateLimitedResponses.length > 0) {
        const rateLimitedResponse = rateLimitedResponses[0];
        expect(rateLimitedResponse.body.status).toBe('error');
        expect(rateLimitedResponse.body.message).toContain('Terlalu banyak request');
      }
    });
  });

  describe('Health Check Rate Limiter', () => {
    it('should allow requests under the health rate limit', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('success');
    });

    it('should block requests exceeding health rate limit', async () => {
      // Health limit is 50 requests per 5 minutes
      // We'll send 51 requests to trigger the limit
      const requests = [];
      for (let i = 0; i < 51; i++) {
        requests.push(request(app).get('/api/health'));
      }
      
      const responses = await Promise.all(requests);
      
      // Count successful and rate limited responses
      const successResponses = responses.filter(res => res.status === 200);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      console.log(`Health check - Success responses: ${successResponses.length}`);
      console.log(`Health check - Rate limited responses: ${rateLimitedResponses.length}`);
      
      // We should have at least one rate limited response
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
      
      // Check the rate limited response structure
      if (rateLimitedResponses.length > 0) {
        const rateLimitedResponse = rateLimitedResponses[0];
        expect(rateLimitedResponse.body.status).toBe('error');
        expect(rateLimitedResponse.body.message).toContain('Terlalu banyak request');
      }
    });
  });
});