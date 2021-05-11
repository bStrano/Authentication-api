import express from "express";
import AuthenticationController from '../controllers/AuthenticationController';
import ExpressAdapter from '../adapters/ExpressAdapter';


let router = express.Router();

router.post('/token')
let authenticationController = new AuthenticationController();
router.post('/register', ExpressAdapter.handle(authenticationController.register.bind(authenticationController)));
router.get('/login', ExpressAdapter.handle(authenticationController.login.bind(authenticationController)));



module.exports = router;
