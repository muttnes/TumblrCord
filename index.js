//Se utilizan const ya que son variables que no cambiarán (Lógica de discord.js también)
const express = require('express');
const app = express();
const discordRoutes = require('./routes/routes');
const tumblrController = require('./controllers/tumblrController');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const { error } = require('node:console');

dotenv.config();

const PORT = process.env.PORT;

app.use('/api', discordRoutes);
app.use('/api/tumblr/posts/:tag', tumblrController.getTumblrPostsByTag);
app.listen(PORT, () => {
    console.log(`Servidor express funcionando en el puerto ${PORT}`)
})

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] El comando en ${filePath} le falta la propiedad 'data' o 'execute'`);
        }
    }
}

client.once(Events.ClientReady, c => {
    console.log(`Listo! Sesión iniciada como ${c.user.tag}`);

    const request = require('request')

    const URL = 'http://localhost:3000/bot-is-ready'

    request.get(URL, (error, response, body) => {
        if (error) {
            console.error('Error al enviar solicitud a Express: ', error)
        } else {
            console.log('Solicitud enviada a Express: ', body)
        }
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No existe ningún comando con el nombre: ${interaction.commandName}`)
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Ocurrió un error al ejecutar este comando', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Ocurrió un error al ejecutar este comando', ephemeral: true })
        }
    }
});

module.exports = PORT;
client.login(process.env.BOT_TOKEN)
