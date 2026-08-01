import Phaser from 'phaser';

const japaneseTitle = 'サウンドブレイバー';
const englishTitle = 'SOUND BRAVER';

function replaceAllText(source: string, search: string, replacement: string) {
  return source.split(search).join(replacement);
}

function replaceBrandText(value: string | string[]): string | string[] {
  const replace = (text: string) => {
    let result = replaceAllText(text, '楽器無双', japaneseTitle);
    result = replaceAllText(result, 'Instrument Brawl', englishTitle);
    return replaceAllText(result, 'INSTRUMENT BRAWL', englishTitle);
  };

  return Array.isArray(value) ? value.map(replace) : replace(value);
}

// Keep internal IDs and localStorage keys unchanged. Only text rendered by
// Phaser is rebranded from the former working title.
const originalSetText = Phaser.GameObjects.Text.prototype.setText;
Phaser.GameObjects.Text.prototype.setText = function brandedSetText(
  this: Phaser.GameObjects.Text,
  text: string | string[],
) {
  const brandedText = replaceBrandText(text);
  const result = originalSetText.call(this, brandedText);
  const currentFontSize = String(this.style.fontSize);

  // The compact home card used a much shorter working title at 30px.
  // Full-size headings remain unchanged.
  if (
    brandedText === japaneseTitle
    && (currentFontSize === '30' || currentFontSize === '30px')
  ) {
    this.setFontSize(20);
  }

  return result;
};

document.title = japaneseTitle;

export {};
