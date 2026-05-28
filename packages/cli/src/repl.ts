import { createInterface } from 'node:readline';
import type { CliFlags } from './flags.js';
import { Renderer, renderWelcomeBanner, ansi, color } from '@expo/tui';
import { CommandRegistry } from './commands/registry.js';
import { createHelpCommand } from './commands/help.js';
import { clearCommand } from './commands/clear.js';
import { compactCommand } from './commands/compact.js';
import { configCommand } from './commands/config.js';
import { modelCommand } from './commands/model.js';
import { sessionCommand } from './commands/session.js';
import { toolsCommand } from './commands/tools.js';
import { agentsCommand } from './commands/agents.js';
import { permissionsCommand } from './commands/permissions.js';
import type { CommandContext } from './commands/types.js';

export async function runRepl(_flags: CliFlags): Promise<void> {
  const renderer = new Renderer();
  const registry = new CommandRegistry();

  // Register all commands
  registry.register(createHelpCommand(registry));
  registry.register(clearCommand);
  registry.register(compactCommand);
  registry.register(configCommand);
  registry.register(modelCommand);
  registry.register(sessionCommand);
  registry.register(toolsCommand);
  registry.register(agentsCommand);
  registry.register(permissionsCommand);

  // Create command context
  const context: CommandContext = {
    config: {},
    tools: [],
    agents: [],
    permissions: {},
  };

  // Clear screen and show welcome banner
  process.stdout.write(renderer.clearScreen());
  const banner = renderWelcomeBanner({
    version: '0.1.0',
    model: _flags.model ?? 'default',
    cwd: process.cwd(),
  });
  process.stdout.write(banner + '\n\n');

  // Show separator
  process.stdout.write(color(renderer.renderSeparator(), ansi.dim) + '\n');

  // Setup readline
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${color('>', ansi.brightCyan)} `,
  });

  let ctrlCCount = 0;

  rl.on('SIGINT', () => {
    ctrlCCount++;
    if (ctrlCCount >= 2) {
      process.stdout.write('\n' + color('Goodbye!', ansi.dim) + '\n');
      rl.close();
      return;
    }
    process.stdout.write(
      '\n' + color('(Press Ctrl+C again to exit)', ansi.dim) + '\n',
    );
    rl.prompt();
  });

  rl.on('line', (line: string) => {
    ctrlCCount = 0;
    const input = line.trim();

    if (input.length === 0) {
      rl.prompt();
      return;
    }

    if (input.startsWith('/')) {
      void registry.execute(input, context).then((result) => {
        process.stdout.write(result.output + '\n');

        if (result.action === 'exit') {
          rl.close();
          return;
        }
        if (result.action === 'clear') {
          process.stdout.write(renderer.clearScreen());
          const b = renderWelcomeBanner({
            version: '0.1.0',
            model: _flags.model ?? 'default',
            cwd: process.cwd(),
          });
          process.stdout.write(b + '\n\n');
          process.stdout.write(
            color(renderer.renderSeparator(), ansi.dim) + '\n',
          );
        }

        rl.prompt();
      }).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        process.stdout.write(color(`Error: ${msg}`, ansi.red) + '\n');
        rl.prompt();
      });
      return;
    }

    // Stub: echo back for now
    process.stdout.write(renderer.renderToolCall('echo', input) + '\n');
    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });

  rl.prompt();
}
