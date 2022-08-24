import { Router } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/v1/signup/google', async (req, res) => {

    const { name, email, password } = req.body

    if (name.match(/<script>/gi) || email.match(/<script>/gi) || password.match(/<script>/gi)) {
        res.send({ 'response': false, 'message': "Error al solicitar el recurso", 'type': "name" });
    } else {

        const user = await User.findOne({ email })

        if (user) {

            const match = await user.matchPassword(password);
            if (match) {
                try {
                    const token = jwt.sign({ id: user._id }, process.env.KEY_TOKEN_AUTH, { expiresIn: '30m' })
                    res.send({ 'response': true, "token": token });
                } catch (error) {
                    res.send({ 'response': false, 'message': "Intentalo mas tarde", 'type': "name"  });
                }
            } else {
                const redirect = `/signin/email=${email}`
                res.send({ 'response': false, 'redirect': redirect });
            }

        } else {
            try {
                const newUser = new User({ name, email, password });
                newUser.password = await newUser.encrytPassword(password)
                await newUser.save()

                const token = jwt.sign({ id: newUser._id }, process.env.KEY_TOKEN_AUTH, { expiresIn: "30m" })
                res.send({ 'response': true, 'token': token });

            } catch (error) {

                res.send({ 'response': false, 'message': { error }, 'type': "name" });

            }
        }
    }

});


export default router;