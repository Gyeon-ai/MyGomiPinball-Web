import test from 'node:test';
import assert from 'node:assert/strict';
import { findOpaqueBounds, squareCrop } from '../src/pawSkin.ts';

test('transparent padding does not shrink the visible paw inside a 36px marble', () => {
  const pixels = new Uint8ClampedArray(10 * 10 * 4);
  for (let y = 2; y <= 7; y++) {
    for (let x = 3; x <= 6; x++) pixels[(y * 10 + x) * 4 + 3] = 255;
  }
  const bounds = findOpaqueBounds(pixels, 10, 10);
  assert.deepEqual(bounds, { left: 3, top: 2, right: 6, bottom: 7 });
  const crop = squareCrop(bounds, 10, 10);
  assert.equal(crop.size, 6.48);
  assert.ok(crop.x >= 0 && crop.y >= 0);
  assert.ok(crop.x + crop.size <= 10 && crop.y + crop.size <= 10);
  assert.ok((6 / crop.size) * 36 >= 32);
});

test('empty transparency has no visible bounds', () => {
  assert.equal(findOpaqueBounds(new Uint8ClampedArray(4 * 4 * 4), 4, 4), null);
});

test('wide paw art is kept square without stretching or clipping', () => {
  const crop = squareCrop({ left: 1, top: 4, right: 18, bottom: 15 }, 20, 20);
  assert.ok(crop.size >= 18 && crop.size <= 20);
  assert.ok(crop.x <= 1 && crop.y <= 4);
  assert.ok(crop.x + crop.size >= 19 && crop.y + crop.size >= 16);
});
