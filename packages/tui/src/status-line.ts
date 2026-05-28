import type { Theme, StatusLineData } from './types.js';
import { ansi, color, stripAnsi } from './colors.js';

function truncate(text: string, maxLen: number): string {
  if (maxLen <= 3) {
    return '...'.slice(0, maxLen);
  }
  if (text.length <= maxLen) {
    return text;
  }
  return text.slice(0, maxLen - 3) + '...';
}

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
    let right = data.session
      ? color('cwd: ', ansi.dim) + data.session
      : '';

    // Calculate visible lengths
    const leftLen = stripAnsi(left).length;
    const centerLen = stripAnsi(center).length;
    let rightLen = stripAnsi(right).length;

    const totalContent = leftLen + centerLen + rightLen;
    const minPadding = 2; // at least 1 space on each side of center

    if (totalContent + minPadding > width) {
      // Overflow: truncate the right segment (cwd) since it's typically longest
      const availableBudget = width - leftLen - centerLen - minPadding;
      if (availableBudget > 'cwd: '.length + 3 && data.session) {
        const sessionBudget = availableBudget - 'cwd: '.length;
        right = color('cwd: ', ansi.dim) + truncate(data.session, sessionBudget);
      } else if (availableBudget > 3 && data.session) {
        right = color('cwd: ', ansi.dim) + '...';
      } else {
        right = '';
      }
      rightLen = stripAnsi(right).length;

      // If still overflowing, just use minimal padding
      const finalTotal = leftLen + centerLen + rightLen;
      const availableSpace = Math.max(minPadding, width - finalTotal);
      const leftPad = Math.max(1, Math.floor(availableSpace / 2));
      const rightPad = Math.max(1, availableSpace - leftPad);

      return `${left}${' '.repeat(leftPad)}${center}${' '.repeat(rightPad)}${right}`;
    }

    // Normal case: content fits
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
