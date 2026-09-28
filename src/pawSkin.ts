export type PawSkin = {
  ball: HTMLCanvasElement;
  winner: HTMLCanvasElement;
};

export type ImageBounds = { left: number; top: number; right: number; bottom: number };
export type SquareCrop = { x: number; y: number; size: number };

// Transparent padding is part of the source PNG, not part of the visible marble.
export function findOpaqueBounds(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = 8
): ImageBounds | null {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] <= alphaThreshold) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  return right < 0 ? null : { left, top, right, bottom };
}

export function squareCrop(bounds: ImageBounds, width: number, height: number, padding = 0.04): SquareCrop {
  const contentWidth = bounds.right - bounds.left + 1;
  const contentHeight = bounds.bottom - bounds.top + 1;
  const size = Math.min(Math.max(contentWidth, contentHeight) * (1 + padding * 2), width, height);
  const centerX = (bounds.left + bounds.right + 1) / 2;
  const centerY = (bounds.top + bounds.bottom + 1) / 2;
  return {
    x: Math.max(0, Math.min(width - size, centerX - size / 2)),
    y: Math.max(0, Math.min(height - size, centerY - size / 2)),
    size,
  };
}

function renderCrop(image: HTMLImageElement, crop: SquareCrop, size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('공 이미지 캔버스를 만들 수 없습니다.');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, crop.x, crop.y, crop.size, crop.size, 0, 0, size, size);
  return canvas;
}

export function preparePawSkin(image: HTMLImageElement): PawSkin {
  const source = document.createElement('canvas');
  source.width = image.naturalWidth;
  source.height = image.naturalHeight;
  const context = source.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('공 이미지의 투명 영역을 읽을 수 없습니다.');
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, source.width, source.height).data;
  const bounds = findOpaqueBounds(pixels, source.width, source.height);
  const crop = bounds
    ? squareCrop(bounds, source.width, source.height)
    : { x: 0, y: 0, size: Math.min(source.width, source.height) };

  // 4x and 12x the 36px marble keep it crisp without resampling 1254px every frame.
  return { ball: renderCrop(image, crop, 144), winner: renderCrop(image, crop, 432) };
}
