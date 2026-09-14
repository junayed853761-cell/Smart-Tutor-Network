export function extractDominantColor(imgSrc: string, callback: (color: string) => void) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imgSrc;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 50;
    canvas.height = 50;
    try {
      ctx.drawImage(img, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0, count = 0;

      for (let i = 0; i < data.length; i += 16) {
        // Skip near white / near black pixels
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];

        if (alpha > 128 && !(red > 240 && green > 240 && blue > 240) && !(red < 15 && green < 15 && blue < 15)) {
          r += red;
          g += green;
          b += blue;
          count++;
        }
      }

      if (count > 0) {
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        callback(hex);
        document.documentElement.style.setProperty('--brand-primary', hex);
        document.documentElement.style.setProperty('--primary', hex);
        document.documentElement.style.setProperty('--color-primary', hex);
      }
    } catch (e) {
      console.warn('Could not extract dominant color:', e);
    }
  };
}
