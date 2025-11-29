import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Paginator, DiscordJSAdapter, PaginationType, ButtonStyle } from 'discord-dynamic-pagination';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'inventory') {
        // Create inventory pages
        const pages = Array.from({ length: 10 }, (_, i) => {
            return new EmbedBuilder()
                .setTitle(`🎒 Inventory - Page ${i + 1}`)
                .setColor('#E67E22')
                .setDescription(
                    `**Items ${i * 5 + 1}-${(i + 1) * 5}:**\n\n` +
                    `🗡️ **Sword** x${Math.floor(Math.random() * 10)}\n` +
                    `🛡️ **Shield** x${Math.floor(Math.random() * 10)}\n` +
                    `⚗️ **Potion** x${Math.floor(Math.random() * 20)}\n` +
                    `💎 **Diamond** x${Math.floor(Math.random() * 5)}\n` +
                    `🪙 **Gold Coins** x${Math.floor(Math.random() * 100)}`
                )
                .setThumbnail('https://cdn.discordapp.com/emojis/123456789.png'); // Replace with actual emoji/image
        });

        const adapter = new DiscordJSAdapter(client);

        // Hybrid mode: buttons for navigation + select menu for quick jumping
        const paginator = new Paginator(adapter, {
            pages: pages,
            type: PaginationType.HYBRID,
            timeout: 600000, // 10 minutes
            customButtons: {
                first: {
                    emoji: '⏮️',
                    style: ButtonStyle.SECONDARY,
                },
                previous: {
                    emoji: '◀️',
                    style: ButtonStyle.PRIMARY,
                },
                next: {
                    emoji: '▶️',
                    style: ButtonStyle.PRIMARY,
                },
                last: {
                    emoji: '⏭️',
                    style: ButtonStyle.SECONDARY,
                },
            },
            pageDisplay: {
                format: 'Page {current}/{total} 📄',
                showAsButton: true,
            },
            singleUserMode: true, // Only the command user can interact
            onPageChange: (oldPage, newPage, context) => {
                console.log(`User ${context.userId} navigated from page ${oldPage + 1} to ${newPage + 1}`);
            },
        });

        // Listen to events
        paginator.on('timeout', () => {
            console.log('Inventory pagination timed out');
        });

        await paginator.send(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);
