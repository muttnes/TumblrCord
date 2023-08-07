const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
const { createRandomTagEmbed } = require('../../embed-template');

dotenv.config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random-tag')
    .setDescription('Obtiene una publicación aleatoria de un tag de Tumblr.')
    .addStringOption(option => option.setName('tag').setDescription('Tag a buscar en Tumblr').setRequired(true)),
  async execute(interaction) {
    const tag = interaction.options.getString('tag');
    const url = `http://localhost:${process.env.PORT}/api/get-post/${tag}`;

    try {
      const response = await axios.get(url);
      const post = response.data;
      const randomIndex = Math.floor(Math.random() * post.length);
      const selectedPost = post[randomIndex];

      const tagEmbed = createRandomTagEmbed(`Post para el tag ${tag}`, selectedPost.content, selectedPost.media_url)
      

      if (post.error) {
        await interaction.reply(post.error);
      } else {
        await interaction.reply({ embeds: [tagEmbed]})
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Error al obtener el post de la base de datos');
    }
  }
}