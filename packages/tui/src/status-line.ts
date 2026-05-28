import type { Theme, StatusLineData } from './types.js';
import { ansi, color } from './colors.js';

export class StatusLine {
  private theme: Theme;
  private data: StatusLineData;

  constructor(theme: Theme) {
    this.theme = theme;
    this.data = { model: '' };
  }

  render(data: StatusLineData): string {
    this.data = { ...data };
    const width = process.stdout.columns || 80;

    // Left: model name
    const left = data.model
      ? color('model: ', ansi.dim) + data.model
      : '';

    // Center: tokens + cost
    const centerParts: string[] = [];
    if (data.tokens !== undefined) {
      centerParts.push(color('tokens: ', ansi.dim) + String(data.tokens));
    }
    if (data.cost) {
      centerParts.push(color('cost: ', ansi.dim) + data.cost);
    }
    const center = centerParts.join('  ');

    // Right: cwd or session
    const right = data.session
      ? color('cwd: ', ansi.dim) + data.session
      : '';

    // Calculate padding
    const leftLen = left.replace(/\x1b\[[0-9;]*m/g, '').length;
    const centerLen = center.replace(/\x1b\[[0-9;]*m/g, '').length;
    const rightLen = right.replace(/\x1b\[[0-9;]*m/g, '').length;

    const totalContent = leftLen + centerLen + rightLen;
    const availableSpace = width - totalContent;
    const leftPad = Math.max(1, Math.floor(availableSpace / 2));
    const rightPad = Math.max(1, availableSpace - leftPad);

    return `${left}${' '.repeat(leftPad)}${center}${' '.repeat(rightPad)}${right}`;
  }

  update(data: Partial<StatusLineData>): string {
    this.data = { ...this.data, ...data };
    return this.render(this.data);
  }

  getData(): StatusLineData {
    return { ...this.data };
  }
}
