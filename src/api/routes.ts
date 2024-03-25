import express from 'express';

import { userRouter } from './userRouters';

const router = express.Router();

router.use('/', userRouter);

export default router