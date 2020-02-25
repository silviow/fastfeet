import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const deliverymen = await Deliveryman.findAll({
            order: ['id'],
            limit: 20,
            offset: (page - 1) * 20,
            attributes: ['id', 'name', 'email'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });

        return res.json(deliverymen);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const deliverymanExists = await Deliveryman.findOne({
            where: { email: req.body.email },
        });

        if (deliverymanExists) {
            return res
                .status(400)
                .json({ error: 'Deliveryman already exists.' });
        }

        const { avatar_id } = req.body;
        let avatar = {};

        if (avatar_id) {
            avatar = await File.findByPk(avatar_id);
        }

        const { id, name, email } = await Deliveryman.create(req.body);

        return res.json({ id, name, email, avatar_url: avatar.url });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { email, avatar_id } = req.body;

        const deliveryman = await Deliveryman.findByPk(req.params.id);

        if (email && email !== deliveryman.email) {
            const deliverymanExists = await Deliveryman.findOne({
                where: { email },
            });

            if (deliverymanExists) {
                return res
                    .status(400)
                    .json({ error: 'Deliveryman already exists.' });
            }
        }

        let avatar = {};

        if (avatar_id) {
            avatar = await File.findByPk(avatar_id);
        }

        const { id, name } = await deliveryman.update(req.body);

        return res.json({ id, name, email, avatar_url: avatar.url });
    }

    async delete(req, res) {
        const deliveryman = await Deliveryman.findByPk(req.params.id);

        if (!deliveryman) {
            return res.status(404).json({ error: 'Deliveryman not found.' });
        }

        await deliveryman.destroy();

        return res.json({
            message: `The deliveryman ${deliveryman.name} has been successfully removed.`,
        });
    }
}

export default new DeliverymanController();
