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
  const pathName = "/users"

  userRegistry.registerPath({
    method: 'get',
    path: pathName,
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.get(pathName, userController.getAll.bind(userController));

  userRegistry.registerPath({
    method: 'post',
    path: pathName + '/create',
    tags: ['User'],
    request: { body: UserCreateSchema.shape.body as any },
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.post(
    pathName + '/create', 
    validateRequest(UserCreateSchema),
    userController.create.bind(userController)
  );

  userRegistry.registerPath({
    method: 'post',
    path: '/auth',
    tags: ['User'],
    request: { body: AuthenticationSchema.shape.body as any },
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.post('/auth', validateRequest(AuthenticationSchema), userController.authenticate.bind(userController));


  userRegistry.registerPath({
    method: 'delete',
    path: pathName + '/delete',
    tags: ['User'],
    request: { body: UserDeleteSchema.shape.body as any },
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.delete(pathName + '/delete', validateRequest(UserDeleteSchema), userController.delete.bind(userController));

  return router;
})();
