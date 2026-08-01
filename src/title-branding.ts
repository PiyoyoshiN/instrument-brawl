import Phaser from 'phaser';

const japaneseTitle = 'サウンドブレイバー';
const englishTitle = 'SOUND BRAVER';

function replaceBrandText(value: string | string[]): string | string[] {
  const replace = (text: string) => text
    .replaceAll('楽器無双', japaneseTitle)
    .replaceAll('Instrument Brawl', englishTitle)
    .replaceAll('INSTRUMENT BRAWL', englishTitle);

  return Array.isArray(value) ? value.map(replace) : replace(value);
}

// Phaser scenes still contain the former working title in a few display strings.
// Patch only rendered Text objects so persistent storage keys and internal IDs remain stable.
const factoryPrototype = Phaser.GameObjects.GameObjectFactory.prototype;
const originalTextFactory = factoryPrototype.text;

factoryPrototype.text = function brandedTextFactory(
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  text: string | string[],
  style?: Phaser.Types.GameObjects.Text.TextStyle,
) {
  const brandedText = replaceBrandText(text);
  const gameObject = originalTextFactory.call(this, x, y, brandedText, style);

  // The old short title fitted a 210px home card at 30px. The new title needs
  // a smaller size only in that compact card; full title headings stay large.
  if (
    brandedText === japaneseTitle
    && (style?.fontSize === '30px' || style?.fontSize === 30)
  ) {
    gameObject.setFontSize(20);
  }

  return gameObject;
};

const originalSetText = Phaser.GameObjects.Text.prototype.setText;
Phaser.GameObjects.Text.prototype.setText = function brandedSetText(
  this: Phaser.GameObjects.Text,
  text: string | string[],
) {
  return originalSetText.call(this, replaceBrandText(text));
};

document.title = japaneseTitle;

export {};
