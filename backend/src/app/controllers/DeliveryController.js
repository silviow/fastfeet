import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import File from '../models/File';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import NewDeliveryMail from '../jobs/NewDeliveryMail';

class DeliveryController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const deliveries = await Delivery.findAll({
            order: ['id'],
            limit: 20,
            offset: (page - 1) * 20,
            attributes: [
                'id',
                'product',
                'start_date',
                'end_date',
                'status',
                'canceled_at',
            ],
            include: [
                {
                    model: File,
                    as: 'signature',
                    attributes: ['name', 'path', 'url'],
                },
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
                        'id',
                        'name',
                        'email',
                        'state',
                        'city',
                        'street',
                        'number',
                        'cep',
                        'address_complement',
                    ],
                },
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        return res.json(deliveries);
    }

    async show(req, res) {
        const { id } = req.params;

        const delivery = await Delivery.findByPk(id, {
            include: [
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: ['id', 'name'],
                },
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!delivery) {
            return res.status(400).json({ error: "Delivery doesn't exists." });
        }

        return res.json(delivery);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            product: Yup.string().required(),
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { product, recipient_id, deliveryman_id } = req.body;

        const recipientExists = await Recipient.findByPk(recipient_id);

        if (!recipientExists) {
            return res.status(400).json({ error: "Recipient doesn't exists." });
        }

        const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

        if (!deliverymanExists) {
            return res
                .status(400)
                .json({ error: "Deliveryman doesn't exists." });
        }

        const { id, start_date, end_date, canceled_at } = await Delivery.create(
            {
                product,
                recipient_id,
                deliveryman_id,
                status: 'Pending',
            }
        );

        await Queue.add(NewDeliveryMail.key, {
            deliveryman: deliverymanExists,
            recipient: recipientExists,
            product,
        });

        return res.json({
            id,
            product,
            recipient_id,
            deliveryman_id,
            start_date,
            end_date,
            canceled_at,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            product: Yup.string(),
            recipient_id: Yup.number(),
            deliveryman_id: Yup.number(),
            signature_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const {
            product,
            recipient_id,
            deliveryman_id,
            signature_id,
        } = req.body;

        const delivery = await Delivery.findByPk(req.params.id);

        if (!delivery) {
            return res.status(400).json({ error: "Delivery doesn't exists." });
        }

        let signature = {};

        if (signature_id) {
            signature = await File.findByPk(signature_id);
        }

        const { id } = await delivery.update({
            product,
            recipient_id,
            deliveryman_id,
            signature_id,
        });

        return res.json({
            id,
            product,
            recipient_id,
            deliveryman_id,
            signature_url: signature.url,
        });
    }

    async delete(req, res) {
        const delivery = await Delivery.findByPk(req.params.id);

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found.' });
        }

        if (delivery.start_date) {
            return res
                .status(400)
                .json({ error: 'This delivery has already been shipped.' });
        }

        await delivery.destroy();

        return res.json({
            message: `Delivery #${delivery.id} for the product "${delivery.product}" has been successfully removed.`,
        });
    }
}

export default new DeliveryController();
