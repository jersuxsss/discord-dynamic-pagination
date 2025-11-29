import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { Paginator, DiscordJSAdapter, PaginationType, ButtonStyle } from 'discord-dynamic-pagination';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'custom-style') {
        const pages = [
            new EmbedBuilder()
                .setTitle('🎨 Custom Style Example - Page 1')
                .setColor('#FF6B6B')
                .setDescription('This pagination has custom button styling!'),

            new EmbedBuilder()
                .setTitle('✨ Custom Style Example - Page 2')
                .setColor('#4ECDC4')
                .setDescription('Notice the custom emojis and button colors.'),

            new EmbedBuilder()
                .setTitle('🚀 Custom Style Example - Page 3')
                .setColor('#45B7D1')
                .setDescription('You can customize everything about the pagination!'),
        ];

        const adapter = new DiscordJSAdapter(client);

        const paginator = new Paginator(adapter, {
            pages: pages,
            type: PaginationType.BUTTONS,
            customButtons: {
                first: {
                    label: 'First',
                    emoji: '⏮️',
                    style: ButtonStyle.SUCCESS,
                },
                previous: {
                    label: 'Back',
                    emoji: '⬅️',
                    style: ButtonStyle.PRIMARY,
                },
                next: {
                    label: 'Forward',
                    emoji: '➡️',
                    style: ButtonStyle.PRIMARY,
                },
                last: {
                    label: 'Last',
                    emoji: '⏭️',
                    style: ButtonStyle.SUCCESS,
                },
            },
            pageDisplay: {
                format: '📄 {current} of {total} pages',
                showAsButton: true,
                showInFooter: true,
            },
            showFirstLast: true,
            timeout: 300000,
        });

        await paginator.send(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);
