import type { Camera } from './camera';
import {
  canvasHeight,
  canvasWidth,
  DOT_ACCENT,
  DOT_FONT_FAMILY,
  DOT_INK,
  DOT_RED,
  initialZoom,
  NAME_FONT_FAMILY,
  NUMBER_FONT_FAMILY,
  Themes,
  UI_FONT_FAMILY,
  WINNER_NAME_FONT_FAMILY,
} from './data/constants';
import type { StageDef } from './data/maps';
import type { GameObject } from './gameObject';
import type { Marble } from './marble';
import type { ParticleManager } from './particleManager';
import { type PawSkin, preparePawSkin } from './pawSkin';
import type { ColorTheme } from './types/ColorTheme';
import type { MapEntityState } from './types/MapEntity.type';
import type { VectorLike } from './types/VectorLike';
import type { UIObject } from './UIObject';

export type RenderParameters = {
  camera: Camera;
  stage: StageDef;
  entities: MapEntityState[];
  marbles: Marble[];
  winners: Marble[];
  particleManager: ParticleManager;
  effects: GameObject[];
  winnerRank: number;
  winner: Marble | null;
  size: VectorLike;
  theme: ColorTheme;
  interpolation: number;
};

const MAX_DISPLAY_WIDTH = 1920;
// 타이머 상자와 당첨 상자 사이를 더 띄우는 거리(CSS px)
const WINNER_PANEL_DROP = 16;
const PAW_SKIN_URLS = [
  new URL('../assets/paw-skins/paw-00.png', import.meta.url),
  new URL('../assets/paw-skins/paw-01.png', import.meta.url),
  new URL('../assets/paw-skins/paw-02.png', import.meta.url),
  new URL('../assets/paw-skins/paw-03.png', import.meta.url),
  new URL('../assets/paw-skins/paw-05.png', import.meta.url),
  new URL('../assets/paw-skins/paw-06.png', import.meta.url),
  new URL('../assets/paw-skins/paw-07.png', import.meta.url),
  new URL('../assets/paw-skins/paw-12.png', import.meta.url),
  new URL('../assets/paw-skins/paw-14.png', import.meta.url),
  new URL('../assets/paw-skins/paw-15.png', import.meta.url),
  new URL('../assets/paw-skins/paw-18.png', import.meta.url),
  new URL('../assets/paw-skins/paw-cookie.png', import.meta.url),
];

export class RouletteRenderer {
  protected _canvas!: HTMLCanvasElement;
  protected _sceneCanvas!: HTMLCanvasElement;
  protected ctx!: CanvasRenderingContext2D;
  private _displayCtx!: CanvasRenderingContext2D;
  public sizeFactor = 1;

  protected _pawSkins: PawSkin[] = [];
  private _pawSkinByName = new Map<string, PawSkin>();
  protected _theme: ColorTheme = Themes.dark;
  get width() {
    return this._sceneCanvas.width;
  }

  get height() {
    return this._sceneCanvas.height;
  }

  get canvas() {
    return this._canvas;
  }

  set theme(value: ColorTheme) {
    this._theme = value;
  }

  async init() {
    await this._load();

    this._canvas = document.createElement('canvas');
    this._canvas.width = canvasWidth;
    this._canvas.height = canvasHeight;
    this._displayCtx = this._canvas.getContext('2d', {
      alpha: false,
    }) as CanvasRenderingContext2D;

    this._sceneCanvas = document.createElement('canvas');
    this._sceneCanvas.width = canvasWidth;
    this._sceneCanvas.height = canvasHeight;
    this.ctx = this._sceneCanvas.getContext('2d', {
      alpha: false,
    }) as CanvasRenderingContext2D;

    document.body.appendChild(this._canvas);

    const resizing = (entries?: ResizeObserverEntry[]) => {
      const realSize = entries ? entries[0].contentRect : this._canvas.getBoundingClientRect();
      if (realSize.width <= 0 || realSize.height <= 0) return;

      const width = Math.max(realSize.width / 2, 640);
      const height = (width / realSize.width) * realSize.height;
      this._sceneCanvas.width = width;
      this._sceneCanvas.height = height;
      this.sizeFactor = width / realSize.width;

      const displayWidth = Math.min(realSize.width, MAX_DISPLAY_WIDTH);
      this._canvas.width = displayWidth;
      this._canvas.height = (displayWidth / realSize.width) * realSize.height;
    };

    const resizeObserver = new ResizeObserver(resizing);

    resizeObserver.observe(this._canvas);
    resizing();
  }

  private async _loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img), { once: true });
      img.addEventListener('error', () => reject(new Error(`공 이미지를 불러오지 못했습니다: ${url}`)), { once: true });
      img.src = url;
    });
  }

  private async _load(): Promise<void> {
    // 캔버스에 쓰는 웹폰트를 미리 요청해 둔다. 기다리지는 않는다(늦게 오면 그때부터 그 글꼴로 그려진다).
    if (typeof document !== 'undefined' && document.fonts) {
      for (const font of [
        `400 12px ${NAME_FONT_FAMILY}`,
        `700 12px ${NAME_FONT_FAMILY}`,
        `700 12px ${DOT_FONT_FAMILY}`,
        `8px ${NUMBER_FONT_FAMILY}`,
        `48px ${WINNER_NAME_FONT_FAMILY}`,
      ]) {
        document.fonts.load(font, '당첨 0123#').catch(() => {});
      }
    }
    const images = await Promise.all(
      PAW_SKIN_URLS.map((url) =>
        this._loadImage(url.toString()).catch((error) => {
          console.error(error);
          return null;
        })
      )
    );
    this._pawSkins = images.filter((image): image is HTMLImageElement => image !== null).map(preparePawSkin);
  }

  private getMarbleImage(name: string): PawSkin | undefined {
    if (this._pawSkins.length === 0) {
      return undefined;
    }

    const cached = this._pawSkinByName.get(name);
    if (cached) return cached;

    let hash = 0;
    for (const character of name) {
      hash = (Math.imul(hash, 31) + (character.codePointAt(0) ?? 0)) >>> 0;
    }
    const image = this._pawSkins[hash % this._pawSkins.length];
    this._pawSkinByName.set(name, image);
    return image;
  }

  protected onBeforeEntities(): void {}
  protected onAfterScene(): void {}

  render(renderParameters: RenderParameters, uiObjects: UIObject[]) {
    this._theme = renderParameters.theme;
    this.ctx.fillStyle = this._theme.background;
    this.ctx.fillRect(0, 0, this._sceneCanvas.width, this._sceneCanvas.height);

    this.ctx.save();
    this.ctx.scale(initialZoom, initialZoom);
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.font = `400 0.4pt ${UI_FONT_FAMILY}`;
    this.ctx.lineWidth = 3 / (renderParameters.camera.zoom + initialZoom);
    let marbleTransform: DOMMatrix | null = null;
    renderParameters.camera.renderScene(this.ctx, () => {
      this.onBeforeEntities();
      this.renderEntities(renderParameters.entities);
      this.renderEffects(renderParameters);
      marbleTransform = this.ctx.getTransform();
    });
    this.ctx.restore();
    this.onAfterScene();

    // Keep the map at its cheaper scene resolution, but draw marbles directly
    // on the display canvas so small paw details are never rasterized at half size.
    this._displayCtx.drawImage(this._sceneCanvas, 0, 0, this._canvas.width, this._canvas.height);
    const displayScale = this._canvas.width / this._sceneCanvas.width;
    if (marbleTransform) {
      const transform: DOMMatrix = marbleTransform;
      this._displayCtx.save();
      this._displayCtx.setTransform(
        transform.a * displayScale,
        transform.b * displayScale,
        transform.c * displayScale,
        transform.d * displayScale,
        transform.e * displayScale,
        transform.f * displayScale
      );
      this.renderMarbles(renderParameters, this._displayCtx);
      this._displayCtx.restore();
    }

    // UI and particles retain their scene-sized coordinates and stay above
    // marbles in the same order as before the display-resolution pass.
    this._displayCtx.save();
    this._displayCtx.scale(displayScale, displayScale);
    uiObjects.forEach((obj) =>
      obj.render(this._displayCtx, renderParameters, this._sceneCanvas.width, this._sceneCanvas.height)
    );
    renderParameters.particleManager.render(this._displayCtx);
    this._displayCtx.restore();

    // 당첨 UI는 저해상도 장면 캔버스를 거쳐 두 번 확대하지 않고 출력 캔버스에 바로 그린다.
    this.renderWinner(renderParameters, this._displayCtx, this._canvas.width, this._canvas.height);
  }

  private renderEntities(entities: MapEntityState[]) {
    this.ctx.save();
    entities.forEach((entity) => {
      const transform = this.ctx.getTransform();
      this.ctx.translate(entity.x, entity.y);
      this.ctx.rotate(entity.angle);
      this.ctx.fillStyle = entity.shape.color ?? this._theme.entity[entity.shape.type].fill;
      this.ctx.strokeStyle = entity.shape.color ?? this._theme.entity[entity.shape.type].outline;
      this.ctx.shadowBlur = this._theme.entity[entity.shape.type].bloomRadius;
      this.ctx.shadowColor =
        entity.shape.bloomColor ?? entity.shape.color ?? this._theme.entity[entity.shape.type].bloom;
      const shape = entity.shape;
      switch (shape.type) {
        case 'polyline':
          if (shape.points.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.points[0][0], shape.points[0][1]);
            for (let i = 1; i < shape.points.length; i++) {
              this.ctx.lineTo(shape.points[i][0], shape.points[i][1]);
            }
            this.ctx.stroke();
          }
          break;
        case 'box': {
          const w = shape.width * 2;
          const h = shape.height * 2;
          this.ctx.rotate(shape.rotation);
          this.ctx.fillRect(-w / 2, -h / 2, w, h);
          this.ctx.strokeRect(-w / 2, -h / 2, w, h);
          break;
        }
        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(0, 0, shape.radius, 0, Math.PI * 2, false);
          this.ctx.stroke();
          break;
      }

      this.ctx.setTransform(transform);
    });
    this.ctx.restore();
  }

  private renderEffects({ effects, camera }: RenderParameters) {
    effects.forEach((effect) => effect.render(this.ctx, camera.zoom * initialZoom, this._theme));
  }

  private renderMarbles({ marbles, camera, winnerRank, winners, size, interpolation }: RenderParameters, ctx: CanvasRenderingContext2D) {
    const winnerIndex = winnerRank - winners.length;

    const viewPort = { x: camera.x, y: camera.y, w: size.x, h: size.y, zoom: camera.zoom * initialZoom };
    marbles.forEach((marble, i) => {
      marble.render(
        ctx,
        camera.zoom * initialZoom,
        i === winnerIndex,
        false,
        this.getMarbleImage(marble.name)?.ball,
        viewPort,
        this._theme,
        interpolation
      );
    });
  }

  private renderWinner(
    { winner, theme }: RenderParameters,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    if (!winner) return;
    const canvasRect = this._canvas.getBoundingClientRect();
    const timerRect = document.getElementById('resultTimerOverlay')?.getBoundingClientRect();
    if (!timerRect || canvasRect.width <= 0) return;

    const cssScale = width / canvasRect.width;
    const settingsRect = document.getElementById('settings')?.getBoundingClientRect();
    const settingsTop = settingsRect?.height ? settingsRect.top : canvasRect.bottom - 150;
    const roomBelowTimer = (settingsTop - timerRect.bottom - 30 - WINNER_PANEL_DROP) / 156;
    const winnerScale = Math.max(1, Math.min(2, canvasRect.width / 960, roomBelowTimer));
    const panelWidth = Math.min(timerRect.width * winnerScale * cssScale, width - 32 * cssScale);
    const panelX = (timerRect.left + timerRect.width / 2 - canvasRect.left) * cssScale - panelWidth / 2;
    const panelY = (timerRect.bottom - canvasRect.top + 14 + WINNER_PANEL_DROP) * cssScale;
    const panelHeight = Math.min(156 * winnerScale * cssScale, height - panelY - 16 * cssScale);
    if (panelHeight < 72 * cssScale) return;

    ctx.save();
    ctx.fillStyle = theme.winnerBackground;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    // 모서리가 한 칸 비는 십자 모양 도트 테두리
    const edge = Math.max(2, Math.round(3 * winnerScale * cssScale));
    ctx.fillStyle = DOT_ACCENT;
    ctx.fillRect(panelX, panelY - edge, panelWidth, edge);
    ctx.fillRect(panelX, panelY + panelHeight, panelWidth, edge);
    ctx.fillRect(panelX - edge, panelY, edge, panelHeight);
    ctx.fillRect(panelX + panelWidth, panelY, edge, panelHeight);

    const marbleImage = this.getMarbleImage(winner.name)?.winner;
    const marbleSize = Math.min(92 * winnerScale * cssScale, panelHeight * .54);
    const marbleCenterX = panelX + panelWidth - 18 * winnerScale * cssScale - marbleSize / 2;
    const nameCenterY = panelY + panelHeight * .7;
    const marbleCenterY = nameCenterY;

    if (marbleImage) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        marbleImage,
        marbleCenterX - marbleSize / 2,
        marbleCenterY - marbleSize / 2,
        marbleSize,
        marbleSize
      );
    } else {
      ctx.beginPath();
      ctx.arc(marbleCenterX, marbleCenterY, marbleSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${winner.hue} 100% ${theme.marbleLightness})`;
      ctx.fill();
    }

    const textWidth = panelWidth - marbleSize - 54 * winnerScale * cssScale;
    const textCenterX = panelX + 18 * winnerScale * cssScale + textWidth / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.min(36 * winnerScale * cssScale, panelHeight * .24)}px ${DOT_FONT_FAMILY}`;
    const labelShadow = Math.max(1, Math.round(3 * winnerScale * cssScale));
    const labelY = panelY + panelHeight * .28;
    ctx.fillStyle = DOT_RED;
    ctx.fillText('당 첨', textCenterX + labelShadow, labelY + labelShadow);
    ctx.fillStyle = DOT_ACCENT;
    ctx.fillText('당 첨', textCenterX, labelY);

    const characters = Array.from(winner.name);
    const maxNameSize = Math.min(58 * winnerScale * cssScale, panelHeight * .37);
    const nameBlockHeight = panelHeight * .46;
    let nameLines = [winner.name];
    let nameSize = 0;
    for (let lineCount = 1; lineCount <= Math.min(3, characters.length); lineCount++) {
      const lines = Array.from({ length: lineCount }, (_, index) =>
        characters.slice(Math.floor(index * characters.length / lineCount), Math.floor((index + 1) * characters.length / lineCount)).join('')
      );
      let candidateSize = Math.min(maxNameSize, nameBlockHeight / (lineCount * 1.08));
      ctx.font = `${candidateSize}px ${WINNER_NAME_FONT_FAMILY}`;
      const widestLine = Math.max(...lines.map((line) => ctx.measureText(line).width));
      candidateSize *= Math.min(1, textWidth / Math.max(1, widestLine));
      if (candidateSize > nameSize) {
        nameLines = lines;
        nameSize = candidateSize;
      }
    }
    ctx.font = `${nameSize}px ${WINNER_NAME_FONT_FAMILY}`;
    const nameColor = `hsl(${winner.hue} 100% ${theme.marbleLightness}%)`;
    const nameShadow = Math.max(1, Math.round(nameSize / 20));
    const lineHeight = nameSize * 1.08;
    nameLines.forEach((line, index) => {
      const lineY = nameCenterY + (index - (nameLines.length - 1) / 2) * lineHeight;
      ctx.fillStyle = DOT_INK;
      ctx.fillText(line, textCenterX + nameShadow, lineY + nameShadow);
      ctx.fillStyle = nameColor;
      ctx.fillText(line, textCenterX, lineY);
    });
    ctx.restore();
  }
}
