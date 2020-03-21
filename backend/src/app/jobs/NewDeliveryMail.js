import Mail from '../../lib/Mail';

class NewDeliveryMail {
    get key() {
        return 'NewDeliveryMail';
    }

    async handle({ data }) {
        const { product, deliveryman, recipient } = data;

        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: 'You have a new delivery to do',
            template: 'newdelivery',
            context: {
                product,
                deliveryman: deliveryman.name,
                recipient: recipient.name,
                city: recipient.city,
                state: recipient.state,
                street: recipient.street,
                number: recipient.number,
                cep: recipient.cep,
            },
        });
    }
}

export default new NewDeliveryMail();
