import { Router } from 'express'
import User from '../models/User'
import verifyToken from './verifyToken';

const router = Router();

router.post('/v1/newpassword', verifyToken, async (req, res, next) => {

    const { email, password1, password2 } = req.body
    console.log(req.body)

    if (email.match(/<script>/gi) || password1.match(/<script>/gi) || password2.match(/<script>/gi)) {
        res.send({ 'response': false, 'message': "Error al solicitar el recurso", 'type': "email" });
    } else if (email.search(/^[a-zA-Z0-9_.+-\ñ]+@[a-zA-Z]+\.[a-zA-Z.]+$/)) {
        res.send({ 'response': false, 'message': "Es necesario que su correo contenda un '@' y no cuente con caracteres especiales", 'type': "email" });
    } else if (password1.search(/^.{8,12}$/)) {
        res.send({ 'response': false, 'message': "La contraseña debe tener minimo 8 caracteres y maximo 12", 'type': "password1" });
    } else if (password1 !== password2) {
        res.send({ 'response': false, 'message': "Sus contraseñas no coinciden", 'type': "password2" });
    } else {

        const user = await User.findOne({ email })

        if (!user) {
            res.send({ 'response': false, 'message': "Su correo es incorrecto", 'type': "email" });
        } else {  
            try {
                if (user._id == req.userId){
                    const updatePassword = User({ password: password1 })
                    const password = await updatePassword.encrytPassword(password1)
                    await User.findByIdAndUpdate(user._id, { password })
        
                    res.send({ 'response': true, 'message': "Contraseña cambiada"});
                } else {
                    res.send({ 'response': false, 'message': "El correo electrónico no coincide", 'type': "email" });
                }
            } catch (error) {
                res.send({ 'response': false, 'message': "Hay un error en la solicitud", 'type': "email" });
            }  
        }
    }

});

export default router;