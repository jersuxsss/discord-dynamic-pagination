import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Paginator, DiscordJSAdapter, PaginationType } from 'discord-dynamic-pagination';

// Simulated database
interface User {
    id: string;
    name: string;
    score: number;
    rank: number;
}

class Database {
    private users: User[] = [];

    constructor() {
        // Generate 100 fake users
        for (let i = 0; i < 100; i++) {
            this.users.push({
                id: `user_${i}`,
                name: `Player${i + 1}`,
                score: Math.floor(Math.random() * 10000),
                rank: i + 1,
            });
        }

        // Sort by score descending
        this.users.sort((a, b) => b.score - a.score);

        // Update ranks
        this.users.forEach((user, index) => {
            user.rank = index + 1;
        });
    }

    // Fetch users with pagination
    async getUsers(offset: number, limit: number): Promise<User[]> {
        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return this.users.slice(offset, offset + limit);
    }

    async getTotalUsers(): Promise<number> {
        return this.users.length;
    }
}

const db = new Database();
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'rankings') {
        const adapter = new DiscordJSAdapter(client);
        const usersPerPage = 10;
        const totalUsers = await db.getTotalUsers();

        // Use PageBuilder function for lazy loading
        const paginator = new Paginator(adapter, {
            pages: async (pageIndex, context) => {
                // Calculate if this page exists
                const totalPages = Math.ceil(totalUsers / usersPerPage);
                if (pageIndex >= totalPages) {
                    return null; // No more pages
                }

                // Fetch users for this page from database
                const offset = pageIndex * usersPerPage;
                const users = await db.getUsers(offset, usersPerPage);

                // Build embed
                const embed = new EmbedBuilder()
                    .setTitle('🏆 Global Rankings')
                    .setColor('#FFD700')
                    .setDescription(
                        users.map(user => {
                            const medal = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : '📍';
                            return `${medal} **#${user.rank}** - ${user.name} - ${user.score.toLocaleString()} pts`;
                        }).join('\n')
                    )
                    .setFooter({ text: `Total Players: ${totalUsers}` })
                    .setTimestamp();

                return embed;
            },
            type: PaginationType.HYBRID,
            timeout: 300000,
            pageDisplay: {
                format: 'Page {current}/{total}',
                showAsButton: true,
            },
            onPageChange: async (oldPage, newPage, context) => {
                console.log(`Page changed: ${oldPage} -> ${newPage}`);
                // Could log analytics, track engagement, etc.
            },
        });

        // Event listeners
        paginator.on('ready', (context) => {
            console.log(`Rankings pagination started with ${context.totalPages} pages`);
        });

        paginator.on('timeout', () => {
            console.log('Rankings pagination timed out');
        });

        await paginator.send(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);
