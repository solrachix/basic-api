import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Router } from 'express';
import { z } from 'zod';

import { AuthenticationSchema, UserCreateSchema, UserDeleteSchema, UserSchema } from '../models/userModel';
import { createApiResponse } from '../api-docs/openAPIResponseBuilders';
import { validateRequest } from '../utils/httpHandlers';
import UserController from '../controllers/user.controller'

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();
  const userController = new UserController();

  const path = (swagger = false) => swagger  ? "/api/users" : "/users";

  userRegistry.registerPath({
    method: 'get',
    path: path(true),
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.get(path(), userController.getAll.bind(userController));

  userRegistry.registerPath({
    method: 'post',
    path: path(true) + '/create',
    tags: ['User'],
    request: { 
      body: {
        description: "create user",
        content: {
          'application/json': {
            schema:  UserCreateSchema.shape.body
          },
        },
      }  
    },
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.post(
    path() + '/create', 
    validateRequest(UserCreateSchema),
    userController.create.bind(userController)
  );

  userRegistry.registerPath({
    method: 'post',
    path: '/api/auth',
    tags: ['User'],
    request: { 
      body: {
        description: "create user",
        content: {
          'application/json': {
            schema:  AuthenticationSchema.shape.body
          },
        },
      }  
    },
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.post('/auth', validateRequest(AuthenticationSchema), userController.authenticate.bind(userController));


  userRegistry.registerPath({
    method: 'delete',
    path: path(true) + '/delete',
    tags: ['User'],
    request: { 
      body: {
        description: "create user",
        content: {
          'application/json': {
            schema:  UserDeleteSchema.shape.body
          },
        },
      }  
    },
    responses: createApiResponse(z.array(UserDeleteSchema), 'Success'),
  });

  router.delete(path() + '/delete', validateRequest(UserDeleteSchema), userController.delete.bind(userController));

  return router;
})();
