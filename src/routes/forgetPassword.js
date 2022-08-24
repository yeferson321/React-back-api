import { Router } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
require('dotenv').config();

const router = Router();

router.post('/v1/forgetPassword', async (req, res) => {

    const { email } = req.body

    if (email.match(/<script>/gi)) {
        res.send({ 'response': false, 'message': "Error al solicitar el recurso", 'type': "email" });
    } else if (email.search(/^[a-zA-Z0-9_.+-\ñ]+@[a-zA-Z]+\.[a-zA-Z.]+$/)) {
        res.send({ 'response': false, 'message': "Es necesario que su correo contenda un '@' y no cuente con caracteres especiales", 'type': "email" });
    } else {

        const user = await User.findOne({ email })

        if (!user ){
            res.send({ 'response': false, 'message': "Su correo es incorrecto", 'type': "email" });
        } else {
            try {
                const token = jwt.sign({ id: user._id, email: user.email }, process.env.KEY_TOKEN_AUTH, { expiresIn: '1h' })
                const button = `https://venssel.netlify.app/new-password/${token}`
        
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAILMAILER, // generated ethereal user
                        pass: process.env.PASSWORDMAILER, // generated ethereal password
                    },
                });
    
                const info = await transporter.sendMail({
                    from: '"Scale Ai " <helloworldmanage@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Cambio de contraseña", // Subject line
                    text: "Cambio de contraseña", // plain text body
                    html:
                        `<div style='text-align: center; padding: 0% 14%;'>
                            <h3 style='margin-bottom: 3%; color: gray;' >Restablecer su contraseña</h3><br> 
                            <h4 style='margin-bottom: 3%; color: gray;' >Utilice este botón para restablecer su contraseña. Tenga en cuenta que esto expirará en 1 hora, pero siempre puede generar uno nuevo si eso sucede.</h4><br> 
                            <a href="${button}"><button style='background-color: #6366f1; color: #fff;  border-color: #ffffff00; padding: 12px 35px; font-size: 15px; border-radius: 10px;' type="submit">Restablecer contraseña</button></a>
                        <div/>`,
                });
    
                res.send({ 'response': true, 'message': "Se envio un enlace a su correo para restablecer la contraseña" });
            } catch (error) {
                //res.send({ 'response': false, 'message': { error } });
                res.send({ 'response': false, 'message': "Intentelo mas tarde", 'type': "email"  });
            }
        }
    } 
    
});

export default router;