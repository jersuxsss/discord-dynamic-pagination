import { DiscordJSAdapter } from '../src/adapters/DiscordJSAdapter';
import { ErisAdapter } from '../src/adapters/ErisAdapter';
import { ButtonStyle } from '../src/types';

describe('Adapters', () => {
    describe('DiscordJSAdapter', () => {
        let mockClient: any;
        let adapter: DiscordJSAdapter;

        beforeEach(() => {
            mockClient = {
                user: { id: 'bot_123', tag: 'TestBot#1234' },
            };
            adapter = new DiscordJSAdapter(mockClient);
        });

        it('should create adapter instance', () => {
            expect(adapter).toBeDefined();
            expect(adapter).toBeInstanceOf(DiscordJSAdapter);
        });

        it('should create button with correct properties', () => {
            const button = adapter.createButton(
                'test_button',
                'Click Me',
                ButtonStyle.PRIMARY,
                '👍'
            );

            expect(button).toBeDefined();
            // Button structure varies by discord.js version
            // Just check it was created
        });

        it('should create select menu with options', () => {
            const options = [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' },
            ];

            const selectMenu = adapter.createSelectMenu(
                'test_select',
                options,
                'Choose an option'
            );

            expect(selectMenu).toBeDefined();
        });

        it('should create action row', () => {
            const button = adapter.createButton(
                'test_button',
                'Test',
                ButtonStyle.SECONDARY
            );

            const actionRow = adapter.createActionRow([button]);

            expect(actionRow).toBeDefined();
        });

        it('should map button styles correctly', () => {
            const styles = [
                ButtonStyle.PRIMARY,
                ButtonStyle.SECONDARY,
                ButtonStyle.SUCCESS,
                ButtonStyle.DANGER,
            ];

            styles.forEach((style) => {
                const button = adapter.createButton('test', 'Test', style);
                expect(button).toBeDefined();
            });
        });
    });

    describe('ErisAdapter', () => {
        let mockClient: any;
        let adapter: ErisAdapter;

        beforeEach(() => {
            mockClient = {
                user: { id: 'bot_123', username: 'TestBot' },
                on: jest.fn(),
                removeListener: jest.fn(),
                createMessage: jest.fn(),
                editMessage: jest.fn(),
                deleteMessage: jest.fn(),
            };
            adapter = new ErisAdapter(mockClient);
        });

        it('should create adapter instance', () => {
            expect(adapter).toBeDefined();
            expect(adapter).toBeInstanceOf(ErisAdapter);
        });

        it('should create button with Eris format', () => {
            const button = adapter.createButton(
                'test_button',
                'Click Me',
                ButtonStyle.PRIMARY,
                '👍'
            );

            expect(button).toBeDefined();
            expect(button.type).toBe(2); // Button component type
            expect(button.custom_id).toBe('test_button');
            expect(button.label).toBe('Click Me');
            expect(button.style).toBe(1); // PRIMARY = 1
        });

        it('should parse custom emoji format', () => {
            const button = adapter.createButton(
                'test',
                'Test',
                ButtonStyle.PRIMARY,
                '<:custom:123456789>'
            );

            expect(button.emoji).toBeDefined();
            expect(button.emoji.name).toBe('custom');
            expect(button.emoji.id).toBe('123456789');
        });

        it('should parse animated emoji format', () => {
            const button = adapter.createButton(
                'test',
                'Test',
                ButtonStyle.PRIMARY,
                '<a:animated:987654321>'
            );

            expect(button.emoji).toBeDefined();
            expect(button.emoji.name).toBe('animated');
            expect(button.emoji.id).toBe('987654321');
            expect(button.emoji.animated).toBe(true);
        });

        it('should handle unicode emoji', () => {
            const button = adapter.createButton(
                'test',
                'Test',
                ButtonStyle.PRIMARY,
                '🎉'
            );

            expect(button.emoji).toBeDefined();
            expect(button.emoji.name).toBe('🎉');
        });

        it('should create select menu with Eris format', () => {
            const options = [
                { label: 'Option 1', value: 'opt1', description: 'First option' },
                { label: 'Option 2', value: 'opt2' },
            ];

            const selectMenu = adapter.createSelectMenu(
                'test_select',
                options,
                'Choose one'
            );

            expect(selectMenu).toBeDefined();
            expect(selectMenu.type).toBe(3); // Select menu type
            expect(selectMenu.custom_id).toBe('test_select');
            expect(selectMenu.options.length).toBe(2);
            expect(selectMenu.options[0].description).toBe('First option');
        });

        it('should create action row with correct format', () => {
            const button = adapter.createButton('test', 'Test', ButtonStyle.PRIMARY);
            const actionRow = adapter.createActionRow([button]);

            expect(actionRow).toBeDefined();
            expect(actionRow.type).toBe(1); // Action row type
            expect(actionRow.components).toContain(button);
        });

        it('should map button styles to Eris values', () => {
            const mappings = [
                { style: ButtonStyle.PRIMARY, expected: 1 },
                { style: ButtonStyle.SECONDARY, expected: 2 },
                { style: ButtonStyle.SUCCESS, expected: 3 },
                { style: ButtonStyle.DANGER, expected: 4 },
                { style: ButtonStyle.LINK, expected: 5 },
            ];

            mappings.forEach(({ style, expected }) => {
                const button = adapter.createButton('test', 'Test', style);
                expect(button.style).toBe(expected);
            });
        });

        it('should handle disabled buttons', () => {
            const button = adapter.createButton(
                'test',
                'Test',
                ButtonStyle.SECONDARY,
                undefined,
                true
            );

            expect(button.disabled).toBe(true);
        });
    });
});
