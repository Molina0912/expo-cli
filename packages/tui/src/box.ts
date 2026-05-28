import { stripAnsi } from './colors.js';

export interface DrawBoxOptions {
  title?: string;
  content: string[][];
  width?: number;
  columnWidths?: number[];
}

export function drawBox(options: DrawBoxOptions): string {
  const width = options.width ?? (process.stdout.columns || 80);
  const innerWidth = width - 2; // subtract left and right borders

  // Top border
  let top: string;
  if (options.title) {
    const titleStr = ` ${options.title} `;
    const remainingWidth = innerWidth - 3 - titleStr.length;
    const rightPad = Math.max(0, remainingWidth);
    top = `\u256d\u2500\u2500\u2500${titleStr}${'─'.repeat(rightPad)}\u256e`;
  } else {
    top = `\u256d${'─'.repeat(innerWidth)}\u256e`;
  }

  // Content rows
  const rows: string[] = [];
  for (const row of options.content) {
    if (options.columnWidths && row.length > 1) {
      let line = '';
      for (let i = 0; i < row.length; i++) {
        const colWidth = options.columnWidths[i] ?? Math.floor(innerWidth / row.length);
        const cell = row[i] ?? '';
        const visibleLength = stripAnsi(cell).length;
        const padding = Math.max(0, colWidth - visibleLength);
        line += cell + ' '.repeat(padding);
        if (i < row.length - 1) {
          line += '\u2502';
        }
      }
      const visibleLineLength = stripAnsi(line).length;
      const rightPad = Math.max(0, innerWidth - visibleLineLength);
      rows.push(`\u2502${line}${' '.repeat(rightPad)}\u2502`);
    } else {
      const cell = row[0] ?? '';
      const visibleLength = stripAnsi(cell).length;
      const padding = Math.max(0, innerWidth - visibleLength);
      rows.push(`\u2502${cell}${' '.repeat(padding)}\u2502`);
    }
  }

  // Bottom border
  const bottom = `\u2570${'─'.repeat(innerWidth)}\u256f`;

  return [top, ...rows, bottom].join('\n');
}
