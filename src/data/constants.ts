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
    background: '#000000',
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
    minimapBackground: '#000000',
    minimapViewport: PAW_BORDER,
    winnerBackground: 'rgba(0, 0, 0, 0.72)',
    winnerOutline: '',
    winnerText: 'white',
  },
};
