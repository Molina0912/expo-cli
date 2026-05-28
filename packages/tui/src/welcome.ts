import { drawBox } from './box.js';
import { ansi, color } from './colors.js';

export interface WelcomeBannerOptions {
  version: string;
  model?: string;
  cwd?: string;
  width?: number;
}

export function renderWelcomeBanner(options: WelcomeBannerOptions): string {
  const width = options.width ?? (process.stdout.columns || 80);
  const title = `Expo CLI v${options.version}`;

  const logo = [
    '\u2590\u259b\u2588\u2588\u2588\u259c\u2590',
    '\u259d\u259c\u2588\u2588\u2588\u2588\u2588\u259b\u2598',
    '\u2598\u2598 \u259d\u259d',
  ];

  const welcomeText = color('Welcome back!', ansi.bold);
  const modelInfo = options.model
    ? color(`Model: ${options.model}`, ansi.dim)
    : '';
  const cwdInfo = options.cwd ? color(`cwd: ${options.cwd}`, ansi.dim) : '';

  if (width < 60) {
    // Single-column layout
    const content: string[][] = [
      [welcomeText],
      [''],
      ...logo.map((line) => [color(line, ansi.cyan)]),
      [''],
    ];

    if (modelInfo) content.push([modelInfo]);
    if (cwdInfo) content.push([cwdInfo]);

    content.push(['']);
    content.push([color('Tips for getting started', ansi.bold)]);
    content.push(['  Run /init to create an EXPO.md file']);
    content.push(['  Run /help to see all commands']);
    content.push(['  ' + '-'.repeat(Math.max(0, width - 8))]);
    content.push([color("What's new", ansi.bold)]);
    content.push(['  Check the changelog for updates']);

    return drawBox({ title, content, width });
  }

  // Two-column layout
  const leftWidth = Math.floor(width * 0.4) - 2;
  const rightWidth = width - leftWidth - 4;

  const leftLines: string[] = [
    welcomeText,
    '',
    ...logo.map((line) => color(line, ansi.cyan)),
    '',
  ];
  if (modelInfo) leftLines.push(modelInfo);
  if (cwdInfo) leftLines.push(cwdInfo);

  const rightLines: string[] = [
    color('Tips for getting started', ansi.bold),
    '  Run /init to create an EXPO.md file',
    '  Run /help to see all commands',
    '  ' + '-'.repeat(Math.max(0, rightWidth - 4)),
    color("What's new", ansi.bold),
    '  Check the changelog for updates',
  ];

  const maxRows = Math.max(leftLines.length, rightLines.length);
  const content: string[][] = [];
  for (let i = 0; i < maxRows; i++) {
    content.push([leftLines[i] ?? '', rightLines[i] ?? '']);
  }

  return drawBox({
    title,
    content,
    width,
    columnWidths: [leftWidth, rightWidth],
  });
}
