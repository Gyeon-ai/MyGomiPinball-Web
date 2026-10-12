import type { ColorTheme } from '../types/ColorTheme';

export const initialZoom = 30;
export const canvasWidth = 1600;
export const canvasHeight = 900;
export const zoomThreshold = 5;
export const STUCK_DELAY = 5000;
export const winnerAreaHeight = 168;
export const PAW_BORDER = '#ffb3c5';
export const PAW_NEON_CORAL = '#ff8cab';
export const PAW_NEON_CREAM = '#ffe6c9';
export const PAW_BORDER_COLORS = [
  'rgba(255, 179, 197, .96)',
  'rgba(255, 140, 171, .94)',
  'rgba(255, 192, 174, .94)',
  'rgba(255, 219, 157, .96)',
] as const;
export const UI_FONT_FAMILY = `'Pretendard Variable', Pretendard, 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', system-ui, sans-serif`;
// 오락실 도트 테마의 캔버스용 색과 글꼴(패널 쪽 값은 assets/style.scss의 :root)
export const DOT_LINE = '#9a7058';
export const DOT_INK = '#150d0b';
export const DOT_TEXT_SOFT = '#d2ad94';
export const DOT_ACCENT = '#ffb3c7';
export const DOT_RED = '#c22f45';
export const NAME_FONT_FAMILY = `'Noto Sans KR', sans-serif`;
export const DOT_FONT_FAMILY = `'Galmuri11', 'Noto Sans KR', sans-serif`;
export const NUMBER_FONT_FAMILY = `'Press Start 2P', 'Galmuri11', monospace`;
export const WINNER_NAME_FONT_FAMILY = `'Do Hyeon', 'Noto Sans KR', sans-serif`;

export enum Skills {
  None,
  Impact,
}

export const DefaultEntityColor = {
  box: PAW_NEON_CORAL,
  circle: 'yellow',
  polyline: 'white',
} as const;

export const DefaultBloomColor = {
  box: PAW_NEON_CORAL,
  circle: 'yellow',
  polyline: PAW_NEON_CORAL,
};

export const Themes: Record<string, ColorTheme> = {
  light: {
    background: '#eee',
    marbleLightness: 50,
    marbleWinningBorder: 'black',
    skillColor: '#69c',
    coolTimeIndicator: '#999',
    entity: {
      box: {
        fill: '#226f92',
        outline: 'black',
        bloom: PAW_NEON_CORAL,
        bloomRadius: 0,
      },
      circle: {
        fill: 'yellow',
        outline: '#ed7e11',
        bloom: 'yellow',
        bloomRadius: 0,
      },
      polyline: {
        fill: 'white',
        outline: 'black',
        bloom: PAW_NEON_CORAL,
        bloomRadius: 0,
      },
    },
    rankStroke: 'black',
    minimapBackground: '#fefefe',
    minimapViewport: '#6699cc',

    winnerBackground: 'rgba(255, 255, 255, 0.5)',
    winnerOutline: 'black',
    winnerText: '#cccccc',
  },
  dark: {
    background: '#150d0b',
    marbleLightness: 75,
    marbleWinningBorder: 'white',
    skillColor: 'white',
    coolTimeIndicator: 'red',
    entity: {
      box: {
        fill: PAW_NEON_CORAL,
        outline: PAW_NEON_CORAL,
        bloom: PAW_NEON_CORAL,
        bloomRadius: 12,
      },
      circle: {
        fill: 'yellow',
        outline: 'yellow',
        bloom: 'yellow',
        bloomRadius: 15,
      },
      polyline: {
        fill: PAW_NEON_CREAM,
        outline: PAW_NEON_CREAM,
        bloom: PAW_NEON_CORAL,
        bloomRadius: 12,
      },
    },
    rankStroke: '',
    minimapBackground: '#2a1c18',
    minimapViewport: PAW_BORDER,
    winnerBackground: 'rgba(21, 13, 11, 0.9)',
    winnerOutline: '',
    winnerText: 'white',
  },
};
