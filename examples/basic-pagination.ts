import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } from 'discord.js';
import { Paginator, DiscordJSAdapter, PaginationType } from 'discord-dynamic-pagination';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'leaderboard') {
        // Create sample pages
        const pages = [
            new EmbedBuilder()
                .setTitle('🏆 Leaderboard - Top 10')
                .setColor('#FFD700')
                .setDescription(
                    '1️⃣ **Player1** - 1,000 points\n' +
                    '2️⃣ **Player2** - 950 points\n' +
                    '3️⃣ **Player3** - 900 points\n' +
                    '4️⃣ **Player4** - 850 points\n' +
                    '5️⃣ **Player5** - 800 points'
                )
                .setFooter({ text: 'Top players this month' }),

            new EmbedBuilder()
                .setTitle('🏆 Leaderboard - 11-20')
                .setColor('#C0C0C0')
                .setDescription(
                    '1️⃣1️⃣ **Player11** - 500 points\n' +
                    '1️⃣2️⃣ **Player12** - 450 points\n' +
                    '1️⃣3️⃣ **Player13** - 400 points\n' +
                    '1️⃣4️⃣ **Player14** - 350 points\n' +
                    '1️⃣5️⃣ **Player15** - 300 points'
                ),

            new EmbedBuilder()
                .setTitle('🏆 Leaderboard - 21-30')
                .setColor('#CD7F32')
                .setDescription(
                    '2️⃣1️⃣ **Player21** - 250 points\n' +
                    '2️⃣2️⃣ **Player22** - 200 points\n' +
                    '2️⃣3️⃣ **Player23** - 150 points\n' +
                    '2️⃣4️⃣ **Player24** - 100 points\n' +
                    '2️⃣5️⃣ **Player25** - 50 points'
                ),
        ];

        // Create adapter
        const adapter = new DiscordJSAdapter(client);

        // Create paginator with button navigation
        const paginator = new Paginator(adapter, {
            pages: pages,
            type: PaginationType.BUTTONS,
            timeout: 300000, // 5 minutes
            showFirstLast: true,
        });

        // Send pagination
        await paginator.send(interaction);
    }
});

// Register slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the server leaderboard'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.login(process.env.DISCORD_TOKEN);
