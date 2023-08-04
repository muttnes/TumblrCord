//Se utilizan const ya que son variables que no cambiarán (Lógica de discord.js también)
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
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
});

app.get('/', (req, res) => {
    res.send('HOLA TOY USANDO EXPRESS')
})

app.listen(3000)
console.log(`Server on port ${3000}`)
client.login(process.env.BOT_TOKEN);

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

