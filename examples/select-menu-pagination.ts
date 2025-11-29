import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Paginator, DiscordJSAdapter, PaginationType } from 'discord-dynamic-pagination';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
        // Create help pages
        const pages = [
            new EmbedBuilder()
                .setTitle('📖 Help - Basic Commands')
                .setColor('#3498DB')
                .setDescription(
                    '**!ping** - Check bot latency\n' +
                    '**!help** - Show this help menu\n' +
                    '**!info** - Bot information'
                ),

            new EmbedBuilder()
                .setTitle('📖 Help - Moderation Commands')
                .setColor('#E74C3C')
                .setDescription(
                    '**!ban** - Ban a user\n' +
                    '**!kick** - Kick a user\n' +
                    '**!mute** - Mute a user\n' +
                    '**!warn** - Warn a user'
                ),

            new EmbedBuilder()
                .setTitle('📖 Help - Fun Commands')
                .setColor('#F39C12')
                .setDescription(
                    '**!meme** - Random meme\n' +
                    '**!joke** - Random joke\n' +
                    '**!8ball** - Ask the magic 8-ball'
                ),

            new EmbedBuilder()
                .setTitle('📖 Help - Music Commands')
                .setColor('#9B59B6')
                .setDescription(
                    '**!play** - Play a song\n' +
                    '**!pause** - Pause current song\n' +
                    '**!skip** - Skip to next song\n' +
                    '**!queue** - Show music queue'
                ),

            new EmbedBuilder()
                .setTitle('📖 Help - Utility Commands')
                .setColor('#1ABC9C')
                .setDescription(
                    '**!avatar** - Get user avatar\n' +
                    '**!serverinfo** - Server information\n' +
                    '**!userinfo** - User information'
                ),
        ];

        const adapter = new DiscordJSAdapter(client);

        // Use select menu for quick navigation through help categories
        const paginator = new Paginator(adapter, {
            pages: pages,
            type: PaginationType.SELECT_MENU,
            timeout: 300000,
            pageDisplay: {
                showInFooter: false,
            },
        });

        await paginator.send(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);
