import express from 'express';
import {login, signup} from "../controllers/user.controller.js";
import verifyFirebaseToken from '../middlewares/auth.js';
const router = express.Router();

router.get('/login',verifyFirebaseToken,login);
router.post('/signup',verifyFirebaseToken,signup);

export default router;
