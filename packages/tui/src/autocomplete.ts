import { ansi, color } from './colors.js';

export interface AutocompleteItem {
  name: string;
  description: string;
}

export class Autocomplete {
  private commands: AutocompleteItem[];
  private selectedIndex: number;
  private filtered: AutocompleteItem[];

  constructor(commands: AutocompleteItem[]) {
    this.commands = commands;
    this.selectedIndex = 0;
    this.filtered = [];
  }

  render(input: string): string {
    const slashIdx = input.lastIndexOf('/');
    const prefix = slashIdx >= 0 ? input.slice(slashIdx + 1) : '';

    this.filtered = this.commands.filter((cmd) =>
      cmd.name.startsWith(prefix),
    );

    if (this.filtered.length === 0) {
      return '';
    }

    if (this.selectedIndex >= this.filtered.length) {
      this.selectedIndex = 0;
    }

    const lines: string[] = [];
    for (let i = 0; i < this.filtered.length; i++) {
      const item = this.filtered[i];
      const label = `  /${item.name}`;
      const desc = `    ${item.description}`;

      if (i === this.selectedIndex) {
        lines.push(color(`${label}${desc}`, ansi.cyan));
      } else {
        lines.push(`${label}${color(desc, ansi.dim)}`);
      }
    }

    return lines.join('\n');
  }

  next(): void {
    if (this.filtered.length > 0) {
      this.selectedIndex = (this.selectedIndex + 1) % this.filtered.length;
    }
  }

  prev(): void {
    if (this.filtered.length > 0) {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.filtered.length) % this.filtered.length;
    }
  }

  getSelected(): string | null {
    if (this.filtered.length === 0) {
      return null;
    }
    return this.filtered[this.selectedIndex]?.name ?? null;
  }

  reset(): void {
    this.selectedIndex = 0;
    this.filtered = [];
  }
}
