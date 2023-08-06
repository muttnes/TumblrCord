const tumblr = require('tumblr.js');
const dotenv = require('dotenv');

dotenv.config()

const client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    token: process.env.TUMBLR_TOKEN_KEY
})

async function getTumblrPostsByTag(req, res) {
    const tag = req.params.tag;
    const options = {
        before: '2023-08-01',
        after: '2023-01-01'
    };

    try {
        client.taggedPosts(tag, options, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al obtener los posts de tumblr' });
            } else {
                res.json(data);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los posts de tumblr' })
    }
}

module.exports = {
    getTumblrPostsByTag,
};
