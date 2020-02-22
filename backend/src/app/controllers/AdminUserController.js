import * as Yup from 'yup';
import AdminUser from '../models/AdminUser';

class AdminUserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const adminUserExists = await AdminUser.findOne({
            where: { email: req.body.email },
        });

        if (adminUserExists) {
            return res
                .status(400)
                .json({ error: 'Admin user already exists.' });
        }

        const { id, name, email } = await AdminUser.create(req.body);

        return res.json({ id, name, email });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) => {
                    return oldPassword ? field.required() : field;
                }),
            passwordConfirmation: Yup.string().when(
                'password',
                (password, field) => {
                    return password
                        ? field.required().oneOf([Yup.ref('password')])
                        : field;
                }
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { email, oldPassword } = req.body;

        const adminUser = await AdminUser.findByPk(req.adminUserId);

        if (email && email !== adminUser.email) {
            const adminUserExists = await AdminUser.findOne({
                where: { email },
            });

            if (adminUserExists) {
                return res
                    .status(400)
                    .json({ error: 'Admin user already exists.' });
            }
        }

        if (oldPassword && !(await AdminUser.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match.' });
        }

        const { id, name } = await adminUser.update(req.body);

        return res.json({ id, name, email });
    }
}

export default new AdminUserController();
