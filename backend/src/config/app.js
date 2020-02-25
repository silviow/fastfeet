const port = 3333;
const domain = 'localhost';
const environment = 'development';

export default {
    port,
    domain,
    environment,
    base_url: `http://${domain}:${port}`,
};
