import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import AdminUser from '../models/AdminUser';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { email, password } = req.body;

        const adminUser = await AdminUser.findOne({ where: { email } });

        if (!adminUser) {
            return res.status(401).json({ error: 'Admin user not found.' });
        }

        if (!(await adminUser.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match.' });
        }

        const { id, name } = adminUser;

        return res.json({
            adminUser: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
