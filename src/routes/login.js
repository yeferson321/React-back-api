import { Router } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/v1/signin', async (req, res) => {

    const { email, password } = req.body

    console.log(email)

    if (email.match(/<script>/gi) || password.match(/<script>/gi)) {
        res.send({ 'response': false, 'message': "Error al solicitar el recurso", 'type': "email" });
    } else if (email.search(/^[a-zA-Z0-9_.+-\ñ]+@[a-zA-Z]+\.[a-zA-Z.]+$/)) {
        console.log(email)
        res.send({ 'response': false, 'message': "Es necesario que su correo contenda un '@' y no cuente con caracteres especiales", 'type': "email" });
    } else {

        const user = await User.findOne({ email })

        if (!user) {
            res.send({ 'response': false, 'message': "Su correo es incorrecto", 'type': "email" });
        } else {
            try {
                const match = await user.matchPassword(password);
                if (match) {
                    const token = jwt.sign({ id: user._id }, process.env.KEY_TOKEN_AUTH, { expiresIn: '30m' })
                    res.send({ 'response': true, 'message': "Inicio exitoso", "token": token });
                } else {
                    res.send({ 'response': false, 'message': "Puede que su contraseña sea incorrecta", 'type': "password" });
                }
            } catch (error) {
                res.send({ 'response': false, 'message': { error }, 'type': "email"  });
            }
        }
    }

});

export default router;