const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test-services')
    .setDescription('Obtiene post por ID, comando solo con el fin de testear los servicios')
    .addStringOption(option => option.setName('id').setDescription('Id del post a buscar').setRequired(true)),
  async execute(interaction) {
    const postId = interaction.options.getString('id');

    const url = `http://localhost:${process.env.PORT}/api/get-post/${postId}`;

    try {
      const response = await axios.get(url);
      const post = response.data;

      if (post.error) {
        await interaction.reply(post.error);
      } else {
        await interaction.reply(`Post encontrado: \n${JSON.stringify(post)}`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Error al obtener el post de la base de datos');
    }
  }
};
