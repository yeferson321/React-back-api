import { Router } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/v1/signup', async (req, res) => {

    const { name, email, password1, password2, checkbox } = req.body

    if (name.match(/<script>/gi) || email.match(/<script>/gi) || password1.match(/<script>/gi) || password2.match(/<script>/gi)) {
        res.send({ 'response': false, 'message': "Error al solicitar el recurso", 'type': "name" });
    } else if (name.search(/^[a-zA-Z\s]+$/)) {
        res.send({ 'response': false, 'message': "Solo se permiten letras (a-z)", 'type': "name" });
    } else if (email.search(/^[a-zA-Z0-9_.+-\ñ]+@[a-zA-Z]+\.[a-zA-Z.]+$/)) {
        res.send({ 'response': false, 'message': "Ingrese una dirección de correo electrónico válida, como: sunombre@email.com", 'type': "email"  });
    } else if (password1.search(/^.{8,50}$/)) {
        res.send({ 'response': false, 'message': "Su contraseña debe tener minimo 8 caracteres", 'type': "password1" });
    } else if (password1 !== password2) {
        res.send({ 'response': false, 'message': "Las contraseñas no coinciden", 'type': "password2" });
    } else if (checkbox !== true) {
        res.send({ 'response': false, 'message': "Acepta los terminos y condiciones", 'type': "checkbox" });
    } else {

        const emailUser = await User.findOne({ email: email })
        
        if (emailUser) {
            res.send({ 'response': false, 'message': "Ya hay una cuenta con esta dirección de correo electrónico.", 'type': "email" });
        } else {
            try {
                const newUser = new User({ name, email, password: password1, checkbox});
                newUser.password = await newUser.encrytPassword(password1)  
                await newUser.save()
    
                const token = jwt.sign({id: newUser._id}, process.env.KEY_TOKEN_AUTH, { expiresIn: "30m" })
    
                res.send({ 'response': true, 'message': "Datos correctos", 'token': token });
    
            } catch (error) {
    
                res.send({ 'response': false, 'message': {error}, 'type': "name" });
    
            }
        }
    }


});


export default router;