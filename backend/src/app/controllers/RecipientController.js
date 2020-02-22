import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            cep: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.string().required(),
            address_complement: Yup.string().required(),
            city: Yup.string().required(),
            state: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const recipientExists = await Recipient.findOne({
            where: { email: req.body.email },
        });

        if (recipientExists) {
            return res.status(400).json({ error: 'Recipient already exists.' });
        }

        try {
            const createdRecipient = await Recipient.create(req.body);
            return res.json(createdRecipient);
        } catch (err) {
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            cep: Yup.string(),
            street: Yup.string(),
            number: Yup.string(),
            address_complement: Yup.string(),
            city: Yup.string(),
            state: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const recipient = await Recipient.findByPk(req.params.id);

        if (!recipient) {
            return res.status(400).json({ error: 'Recipient was not found.' });
        }

        const emailRegistered = await Recipient.findOne({
            where: { email: req.body.email },
        });

        if (req.body.email && emailRegistered) {
            return res.status(400).json({
                error:
                    "It was not possible to update the email because it's already registered.",
            });
        }

        try {
            const updatedRecipient = await recipient.update(req.body);
            return res.json(updatedRecipient);
        } catch (err) {
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    }
}

export default new RecipientController();
