const db = require('../models/db');

// Acá van las consultas la base de datos
// Controlador para obtener una fila por tag
async function getPostByTag(req, res) {
  const tag_name = req.params.tag_name;

  try {
    // Realizar la consulta a la base de datos para obtener la fila por ID
    const post = await db.manyOrNone(
      `SELECT p.id AS post_id, p.tumblr_post_id, p.content, p.note_count,
       t.tag_name AS tag_name,
       pm.media_type AS media_type, pm.media_url AS media_url
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN post_media pm ON p.id = pm.post_id
      WHERE t.tag_name = $1`, tag_name
    );

    if (post) {
      res.json(post);
      console.log(post)
    } else {
      res.status(404).json({ error: 'No se encontró el post con el ID especificado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la fila del post' });
  }
}

module.exports = {
  getPostByTag,
};