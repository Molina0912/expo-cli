import type { Theme, OutputStyle } from './types.js';
import { DARK_THEME } from './themes.js';
import { formatMarkdown } from './output.js';
import { ansi, color } from './colors.js';

export interface RendererOptions {
  altScreen?: boolean;
  theme?: Theme;
}

export class Renderer {
  private theme: Theme;
  private altScreen: boolean;
  private active = false;

  constructor(options: RendererOptions = {}) {
    this.theme = options.theme ?? DARK_THEME;
    this.altScreen = options.altScreen ?? false;
  }

  render(content: string, style: OutputStyle = 'plain'): string {
    if (!this.active) {
      this.active = true;
    }
    switch (style) {
      case 'markdown':
        return formatMarkdown(content);
      case 'json':
        return content;
      case 'plain':
      default:
        return content;
    }
  }

  clear(): string {
    return this.clearScreen();
  }

  dispose(): void {
    this.active = false;
  }

  getTheme(): Theme {
    return this.theme;
  }

  isActive(): boolean {
    return this.active;
  }

  clearScreen(): string {
    return '\x1b[2J\x1b[H';
  }

  renderSeparator(width?: number): string {
    const w = width ?? this.getTerminalWidth();
    return '\u2500'.repeat(w);
  }

  renderToolCall(toolName: string, output: string): string {
    const prefix = '\u23bf';
    const header = `${prefix} ${color(toolName, ansi.cyan, ansi.bold)}`;
    const indentedOutput = output
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');
    return `${header}\n${indentedOutput}`;
  }

  renderResponse(text: string): string {
    const width = this.getTerminalWidth();
    const lines: string[] = [];
    for (const paragraph of text.split('\n')) {
      if (paragraph.length <= width) {
        lines.push(paragraph);
      } else {
        let remaining = paragraph;
        while (remaining.length > width) {
          let breakPoint = remaining.lastIndexOf(' ', width);
          if (breakPoint <= 0) {
            breakPoint = width;
          }
          lines.push(remaining.slice(0, breakPoint));
          remaining = remaining.slice(breakPoint).trimStart();
        }
        if (remaining.length > 0) {
          lines.push(remaining);
        }
      }
    }
    return lines.join('\n');
  }

  getTerminalWidth(): number {
    return process.stdout.columns || 80;
  }
}
