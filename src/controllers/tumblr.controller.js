// Los controllers son archivos que simplemente manejan las acciones/respuestas que se deben ejecutar al acceder a un endpoint/ruta
// Acá se ** HACEN ** las peticiones a la API de tumblr
const tumblr = require('tumblr.js');
const dotenv = require('dotenv');

dotenv.config();

const client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    token: process.env.TUMBLR_TOKEN_KEY
});

async function getTumblrPostsByTag(req, res) {
    const tag = req.params.tag;
    const options = {
        before: '2023-09-01',
        after: '2022-01-01'
    };

    try {
        const data = await new Promise((resolve, reject) => {
            client.taggedPosts(tag, options, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        // Filtrado para recibir posts que contengan fotos
        const filteredPosts = data.filter(post => post.type === 'photo');

        res.json(filteredPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los posts de tumblr' });
    }
}

module.exports = {
    getTumblrPostsByTag,
};

