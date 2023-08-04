const tumblr = require('tumblr.js');
const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
const { createRandomTagEmbed } = require('../../embed-template');

dotenv.config();

const tumblrClient = tumblr.createClient({
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  token_key: process.env.TUMBLR_TOKEN_KEY
});

async function getTaggedPosts(tag, limit = 20) {
  return new Promise((resolve, reject) => {
    tumblrClient.taggedPosts(tag, { limit }, (err, data) => {
      if (err) {
        console.error(err);
        reject('Ocurrió un error al buscar el tag. Por favor, inténtalo de nuevo.');
      } else {
        const filteredPosts = data.filter(post => post.type === 'photo' && post.tags && post.tags.includes(tag));
        const sortedPosts = filteredPosts.sort((a, b) => (b.note_count || 0) - (a.note_count || 0));
        resolve(sortedPosts);
      }
    });
  });
}
           
const seedRandom = (seed) => {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('random-tag')
      .setDescription('Obtiene una publicación aleatoria de un tag de Tumblr.')
      .addStringOption(option => option.setName('tag').setDescription('Tag a buscar en Tumblr').setRequired(true)),
    async execute(interaction) {
      const tag = interaction.options.getString('tag');
  
      try {
        const sortedPosts = await getTaggedPosts(tag);
        if (sortedPosts.length === 0) {
          interaction.reply('No se encontraron publicaciones para el tag especificado.');
          return;
        }
  
        const currentTime = new Date().getTime();
        const randomSeed = currentTime + Math.random();
        const randomGenerator = seedRandom(randomSeed);
  
        const randomIndex = Math.floor(randomGenerator * sortedPosts.length);
        const selected_post = sortedPosts[randomIndex];
        console.log(selected_post);
  
        const image_url = selected_post.photos[0].original_size.url; // Obtiene la URL de la imagen
  
        const tagEmbed = createRandomTagEmbed('hola', selected_post.summary || 'No se encontró descripción', image_url);
  
        interaction.reply({ embeds: [tagEmbed] });
      } catch (error) {
        interaction.reply(error);
      }
    }
  };
  