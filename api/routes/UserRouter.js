import UserController from "../controllers/UserController";
import express from "express";


let router = express.Router();

router.post('/register', async (req, res, next) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        res.status(400).end();
        return;
    }

    try {
        let userId = await UserController.register(name, email, password);
        res.status(200).json(userId)
    } catch (e) {
        next(e);
    }

})

router.get('/login', async (req, res, next) => {
    try {
        const [, hash] = req.headers.authorization.split(' ');
        const [email, password] = Buffer.from(hash, 'base64')
            .toString()
            .split(':');

        const user = await UserController.login(email, password);

        if (!user) return res.status(401).end();
        res.status(200).json(user.personalInfo);
    } catch (e) {
        next(e);


    }

});

module.exports = router;