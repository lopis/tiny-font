var Jimp = require('jimp');
var fs = require('fs')

const font = []

const zeroPad = (num, places) => String(num).padStart(places, '0')

function printLetter(letter) {
  if (letter === '') {
    return
  }
  console.log('=====', letter);
  binary = zeroPad(parseInt(letter, 36).toString(2), 25)
  let line = ''
  binary.split('').forEach(bit => {
    if (bit === '1') {
      line += '██'
    } else {
      line += '  '
    }
    if (line.length === 10) {
      console.log(line);
      line = ''
    }
  })
}

Jimp.read('./font.png', function (err, image) {
  const rows = image.getHeight() / 5
  const cols = image.getWidth() / 5
  const size = 5

  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col ++) {
      let letter = ''
      for(let y = 0; y < size; y++) {
        for(let x = 0; x < size; x++) {
          const color = Jimp.intToRGBA(
            image.getPixelColor(
              x + col * size,
              y + row * size,
            )
          ).r;
          letter += color === 255 ? '1' : '0'
        }
      }
      const compressedLetter = parseInt(letter, 2).toString(36)
      font.push(compressedLetter);
    }
  }

  const cleanFont = font.map(l => l === '0' ? '' : l);
  cleanFont.forEach(letter => {
    printLetter(letter)
  })

  const fontString = cleanFont.join(',');
  console.log(fontString.length, 'bytes');
  fs.writeFile('font.js', `export const font = '${fontString}'`, err => {
    if (err) {
      console.error(err);
    }
  })
});


