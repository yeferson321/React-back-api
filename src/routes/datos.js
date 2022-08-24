import { Router } from 'express'
import User from '../models/User'

const router = Router();

router.get('/v1/datos', async (req, res) => {

    const user = await User.find()

    console.log(user)

    res.send({'message': { user } });

});

export default router;