// Node.js script to convert SVG to PNG
// Requires: npm install canvas

const fs = require('fs');
const path = require('path');

try {
  const { createCanvas, loadImage } = require('canvas');
  
  async function generateIcon() {
    console.log('Generating icon from SVG...');
    
    // Note: Canvas doesn't support SVG directly, so we'll create a simple PNG
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
    gradient.addColorStop(0, '#EC7F13');
    gradient.addColorStop(1, '#F59E0B');
    
    // Draw rounded rectangle background
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, 1024, 1024, 200);
    ctx.fill();
    
    // Inner border
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, 40, 944, 944, 180);
    ctx.stroke();
    
    // C3 Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 380px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C3', 512, 520);
    
    // CANTEEN text
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '600 80px Arial';
    ctx.fillText('CANTEEN', 512, 720);
    
    // Decorative elements
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(512, 850, 200, 35, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    const outputPath = path.join(__dirname, '..', 'assets', 'images', 'icon.png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('Icon generated successfully at:', outputPath);
  }
  
  generateIcon().catch(console.error);
  
} catch (error) {
  console.log('Canvas package not installed. Install it with: npm install canvas');
  console.log('Or use one of the other conversion methods in README-ICON.md');
}

