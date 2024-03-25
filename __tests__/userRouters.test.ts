import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { User } from '../src/models/userModel';
import { ServiceResponse } from '../src/models/serviceResponse';
import { app } from '../src/server';

describe('User API Endpoints', () => {
  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/api/users');
      const responseBody: ServiceResponse<User[]> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Users found');
      expect(responseBody.data.length).toBeGreaterThanOrEqual(0);

      responseBody.data.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(typeof user.id).toBe('number');
        
        expect(user).toHaveProperty('name');
        expect(typeof user.name).toBe('string');
        
        expect(user).toHaveProperty('email');
        expect(typeof user.email).toBe('string');
      });
    });
  });

  describe('POST /api/users/create', () => {
    it('should create the test user', async () => {
      const registerDetails = {
        "name": "test",
        "email": "test@test.com",
        "password": "test123"
      };
      const response = await request(app)
        .post('/api/users/create')
        .send(registerDetails);
      const responseBody: ServiceResponse<User> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('User created');

      expect(responseBody.data).toHaveProperty('id');
      expect(typeof responseBody.data.id).toBe('number');
      
      expect(responseBody.data).toHaveProperty('name');
      expect(typeof responseBody.data.name).toBe('string');
      
      expect(responseBody.data).toHaveProperty('email');
      expect(typeof responseBody.data.email).toBe('string');
    });
  });

  describe('POST /api/auth', () => {
    it('should return the authenticated user', async () => {
      const loginDetails = {
        "email": "test@test.com",
        "password": "test123"
      };
  
      const response = await request(app)
        .post('/api/auth')
        .send(loginDetails);

      const responseBody: ServiceResponse<{ token: string; user: User }> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('User found');

      expect(responseBody.data).toHaveProperty('token');
      expect(typeof responseBody.data.token).toBe('string');

      expect(responseBody.data.user).toHaveProperty('id');
      expect(typeof responseBody.data.user.id).toBe('number');
      
      expect(responseBody.data.user).toHaveProperty('name');
      expect(typeof responseBody.data.user.name).toBe('string');
      
      expect(responseBody.data.user).toHaveProperty('email');
      expect(typeof responseBody.data.user.email).toBe('string');
    });

    it('should return 403, unauthorized user', async () => {
      const loginDetails = {
        "email": "test@test.com",
        "password": "testeSenhaErrada123456"
      };
  
      const response = await request(app)
        .post('/api/auth')
        .send(loginDetails);

      const responseBody: ServiceResponse<{ token: string; user: User }> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.FORBIDDEN);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Email or password incorrect');
      expect(responseBody.data).toBeNull();
    });

    it('should return 400, user not found', async () => {
      const loginDetails = {
        "email": "usuarioNaoEncontrado@test.com",
        "password": "123"
      };
  
      const response = await request(app)
        .post('/api/auth')
        .send(loginDetails);

      const responseBody: ServiceResponse<{ token: string; user: User }> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('User not found');
      expect(responseBody.data).toBeNull();
    });
  });

  describe('POST /api/users/delete', () => {
    it('should deleted the test user', async () => {
      const userList = await request(app).get('/api/users');
      const userListBody: ServiceResponse<User[]> = userList.body;

      const registerDetails = {
        id: userListBody.data[userListBody.data.length - 1].id
      };
      
      const response = await request(app)
        .delete('/api/users/delete')
        .send(registerDetails);
      const responseBody: ServiceResponse<User> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('User deleted');
      expect(responseBody.data).toBeNull();
    });
  });
});
