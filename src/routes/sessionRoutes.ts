import express from "express";
import ExpressAdapter from '../adapters/ExpressAdapter';
import SessionController from '../controllers/SessionController';

let router = express.Router();

const sessionController = new SessionController();
router.get('/token', ExpressAdapter.handle(sessionController.restoreSession.bind(sessionController)))
router.delete('/:user', ExpressAdapter.handle(sessionController.removeSession.bind(sessionController)))



module.exports = router;
