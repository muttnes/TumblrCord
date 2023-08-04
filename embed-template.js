const { EmbedBuilder } = require('discord.js')

const embedColors = [
    "#FF5733", // Red
    "#33FF57", // Green
    "#5733FF", // Blue
    "#FF33E6", // Pink
    "#FFC933", // Yellow
    "#33FFC9", // Aqua
    "#B433FF", // Purple
    "#33FF99", // Mint
    "#FF3333", // Crimson
    "#FF33A6", // Fuchsia
    "#33B5FF", // Sky Blue
    "#33FF40", // Lime Green
    "#FF5733", // Orange
    "#33FF33", // Neon Green
    "#A633FF", // Lavender
    "#33FF66", // Spring Green
    "#FF336F", // Salmon
    "#FF33C3", // Magenta
    "#3391FF", // Electric Blue
  ];

  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * embedColors.length);
    return embedColors[randomIndex]
  }

  const randomEmbedColor = getRandomColor();

  function createRandomTagEmbed(title, description, img) {
    const randomTagEmbed = new EmbedBuilder()
      .setColor(randomEmbedColor)
      .setTitle(title)
      .setDescription(description)
      .setImage(img)

    return randomTagEmbed
  }
  
  module.exports = { createRandomTagEmbed };
  
  
  
  