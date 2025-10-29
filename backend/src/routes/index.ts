import { Router } from 'express';
import validation from './validation.js';
import users from './users.js';

const api = Router();
api.use('/validation', validation);
api.use('/users', users);

export default api;
