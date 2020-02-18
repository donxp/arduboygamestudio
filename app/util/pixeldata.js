/* PixelData manipulation and storage library
*/
(function() {
    'use strict'
  
  function PixelData(input) {
    //console.log('new PixelData('+typeof input+'):', input)
  
    // Already a PixelData object
    if (typeof input === 'object' && input instanceof PixelData) {
      // Copy props to this object
      Object.assign(this, input.$host || input, input)
      return this
    }
  
    // ImageData object (import)
    if (
      typeof input === 'object' &&
      // it is an ImageData object
      ( (typeof ImageData !== 'undefined' && input instanceof ImageData)
        // it looks like an ImageData object
        || ('data' in input && input.data instanceof Uint8ClampedArray)
      )
    ) {
      return rgba2bitmap(input.data, input.width, input.height)
    }
  
    // Buffer object - should be some binary image file.
    // Supported import formats: BMP
    if (typeof input === 'object' && typeof Buffer !== 'undefined' && input instanceof Buffer) {
      try {
        this.bitmap = bmp2bitmap(input);
        this.w = this.bitmap[0].length;
        this.h = this.bitmap.length;
        return;
      } catch(e) {
  
      }
  
      // Not any of the supported binary formats, convert to string
      input = input.toString();
    }
  
    // Could be serialized JSON
    if (typeof input === 'string') {
      try {
        input = JSON.parse(input);
      } catch (e) {
        // don't fret, could still be a PIF
      }
    }
  
    // Object, should have w/h set and some data field
    // If object data is not byte data continue with that data as input
    if (typeof input === 'object' && input.data instanceof Array) {
      if (typeof input.data[0] === 'number') {
        this.bitmap = bytes2bitmap(input.data, input.w, input.h, input.frames, (input.w && input.h && "explicit-size") );
        this.frames = input.frames;
        this.w = this.bitmap[0].length / (input.frames||1);
        this.h = this.bitmap.length;
        this.id = input.id;
        return;
      } else {
        input = input.data;
      }
    }
  
    // String
    if (typeof input === 'string') {
      // Try parsing as Code Snippet
      let parsed = loadCode(input)
  
      if (parsed) {
        //console.log('Successfully parsed as Code Snippet', parsed)
        return parsed
      }
  
  
      // Try parsing as PIF (ASCII)
      try {
        let parsed = loadPif(input)
        if (parsed) {
          //console.log('Successfully parsed as PIF imagedata', parsed)
          return parsed
        }
  
      // Nonrecognized format
      } catch (e) {
        console.log('Invalid PIF data!');
        throw e;
      }
    }
  
    // Nested array - should be a bitmap already
    if (input instanceof Array && input[0] instanceof Array) {
      this.bitmap = input;
      this.w = this.bitmap[0].length;
      this.h = this.bitmap.length;
      return;
    }
  
    throw("Unrecognized file format.");
  }
  
  PixelData.prototype = {
    get pif() {
      return bitmap2pif(this.bitmap, this.id, this.frames, metadata(this));
    },
    get bytes() {
      return bitmap2bytes(this.bitmap, this.w,this.h, this.frames);
    },
    get rgba() {
      return bitmap2rgba(this.bitmap, this.palette)
    },
    get b3g3r2() {
      return bitmap2rgba(this.bitmap, this.palette).reduce(
        // Chunk into 4-byte arrays - TODO: generalize as ext function for 16bit
        (arr,i) => {
          //TODO: transparency
          if (arr.length && arr[arr.length-1].length<4) {
            arr[arr.length-1].push(i)
          } else {
            arr.push([i])
          }
  
          return arr
  
        // Reduce bit depth to 8-bit color
        }, []).map( rgba2c8 )
    },
    get b5g6r5() {
      return bitmap2rgba(this.bitmap, this.palette).reduce( rgbaToPixels, []
        // Reduce bit depth to 16-bit color
        ).map( rgba2c16 )
    },
    get sprite() {
      return this.bytes.reduce(function(sprite, v) {
        return sprite += (sprite === '' ? '' : ', ') + ( v<16 ? '0x0' : '0x' ) + v.toString(16);
      }, '');
    },
  
    // Monochrome C source (1 bit/pixel)
    c: function(bits) {
      let data, colors
  
      switch (bits) {
        // 8/16 bit color matrices
        case '8bit':
        case 8:
          data = this.b3g3r2.map(pixel => '0x'+(pixel<16?'0':'')+pixel.toString(16) ).join(', ')
          colors = '8b'
          break
        case 16:
          data = this.b5g6r5.map(pixel => '0x'+('0'.repeat(4-Math.ceil(Math.log2(pixel|2)/4)))+pixel.toString(16) ).join(', ')
          colors = '16b'
          break
  
        // Monochrome
        default:
          data = this.sprite
      }
  
      return ('/*'
        + this.w+'x'+this.h
        + (this.frames>1 ? 'x'+this.frames : '')
        + (colors ? '@'+colors : '')
        + '*/ '
        + data
      )
    },
  
    // SVG!
    svg: function(scale = 1) {
      const { w,h } = this
      const pixels = this.bitmap.map((row,y) =>
        row.reduce((rects,pixel,x) =>
          rects+(pixel ? `<rect width="${scale}" height="${scale}" x="${x*scale}" y="${y*scale}"/>\n` : '')
        ,'')
      ).join('')
  
      // todo: color tags
      return `<svg viewBox="0 0 ${w*scale} ${h*scale}" xmlns="http://www.w3.org/2000/svg"><g>${pixels}</g></svg>`
    },
  
    // Compare two PixelData objects
    equals: function(other) {
      try {
        return this.pif === other.pif;
      } catch (e) {
        console.log("Error matching PixelData: ", e);
        return false;
      }
    },
  
    // A "view" into the PixelData object, representing just a single frame
    frame: function(n) {
      if (n > (this.frames||0)) return this;
      var fobj = Object.create(this);
  
      Object.defineProperty(fobj, '$host', { value: this })
      Object.defineProperty(fobj, '$f', { value: n })
      Object.defineProperty(fobj, 'frames', { value: 0 })
  
      Object.defineProperty(fobj, 'id', { get: function() {
        return (this.$host.id ? this.$host.id+'_'+this.$f : void 0)
      } })
      Object.defineProperty(fobj, 'bitmap', { get: function() {
        return this.$host.bitmap
          .slice(this.$f*this.h, (this.$f+1)*this.h)
      } })
  
      return fobj;
    },
  
    // A "view" into the PixelData object, overriding the color palette
    colors: function(palette) {
      // Keep the same host object
      let host = this.$host || this
      if (!palette || !palette.length) return host
  
      const view = Object.create(host)
      view.palette = palette
  
      Object.defineProperty(view, '$host', { value: host })
      return view
    },
  
    // A "view" into the PixelData object, converting to 5-level grayscale
    // The optional palette specified can contain any number of colors, it will be
    // used to calculate the greyscale palette
    grayscale: function(palette) {
      // Keep the same host object
      let host = this.$host || this
  
      // Palette is optional
      // Use "this" instead of "host", in case it has a palette set already
      const view = Object.create(palette ? host.colors(palette) : this)
  
      // Generate grayscale palette
      const grayscale = colorsToGrayscale(view.palette, view.bitmap)
  
      view.palette = grayscale.palette
      view.bitmap = grayscale.bitmap
  
      // PWM (Arduboy) multiframe intensity mapped version
      Object.defineProperty(view, 'pwm', { get: function() {
        const pwm = Object.create(view)
        pwm.frames = 4
  
        Object.defineProperty(pwm, 'bitmap', { get: function() {
          return [].concat(
            view.bitmap.map(r => r.map(c => c==4|0)),
            view.bitmap.map(r => r.map(c => c==3|0)),
            view.bitmap.map(r => r.map(c => c==2|0)),
            view.bitmap.map(r => r.map(c => c==1|0))
          )
        } })
  
        return pwm
      } })
  
  
      Object.defineProperty(view, '$host', { value: host })
      return view
    },
  
    // Create an object with all properties
    serialize: function() {
      return {
        id: this.id,
        w: this.w,
        h: this.h,
        data: this.bytes
      };
    },
  
    // More flexible RGBA
    toRGBA(foreground, background) {
      return bitmap2rgba(this.bitmap, [ background||[0,0,0,0], foreground||[255,255,255,255] ])
    }
  }
  
  
  function bitmap2pif(bitmap, id, frames, metadata) {
    console.warn('[!] deprecated legacy call to "bitmap2pif()"')
  
    return (metadata ? metadata +'\n' : '') +
      bitmap.reduce(function(out,row) {
        out.push(row.join(''));
        return out;
      },[]).join('\n').replace(/0/g,'.').replace(/1/g,'#'); // TODO!!
  }
  
  function pif2bitmap(pif) {
    console.warn('[!] deprecated legacy call to "pif2bitmap()"')
    return loadPif(pif).bitmap;
  
    var rows = pif.replace(/[^\.\#]+/g,' ').trim().split(/\s+/g);
  
    var matrix = rows.map(function(s) {
      var i,
          r = [];
  
      for (i = 0; i < s.length; ++i) {
        r.push(s[i] === '#' ? 1 : 0);
      }
  
      return r;
    });
  
    return matrix;
  }
  
  function pif2bytes(pif) {
    return bitmap2bytes( pif2bitmap( pif ));
  }
  
  function bitmap2bytes(bitmap, w,h, frames) {
    w = w||bitmap[0].length
    h = h||bitmap.length
    frames = frames||1
  
    let bytes = []
  
    let fr = 0
    let seg = 0
  
    while (fr < frames && seg < h) {
      for (let x = 0; x < w; ++x) {
        let v = 0;
        let ymax = (h-seg < 8 ? h-seg : 8);
  
        for (let y = 0; y < ymax; ++y) {
          v |= (bitmap[fr*h +seg +y][x]&0x1) << y;
        }
  
        // Save byte values
        bytes.push(v);
      }
  
      seg += 8;
      if (seg >= h) {
        ++fr;
        seg = 0;
      }
    }
  
    return bytes;
  }
  
  function bitmap2rgba(bitmap, pal) { //TODO: frames
    let w = bitmap[0].length, h = bitmap.length;
    let rgba = new Uint8ClampedArray(w * h * 4);
  
    // default palette: transparent black background, opaque white foreground
    pal = pal || [ [0,0,0,0] , [255,255,255,255] ]
  
    let paletteColors = pal.length
  
    let y = 0;
    while (y < h) {
  
      for (let x = 0; x < w; ++x) {
        let cc = (bitmap[y][x]>0 ? (bitmap[y][x] < paletteColors ? pal[bitmap[y][x]] : pal[1]) : pal[0]);
  
        rgba[ (y*w + x)*4 + 0 ] = cc[0];
        rgba[ (y*w + x)*4 + 1 ] = cc[1];
        rgba[ (y*w + x)*4 + 2 ] = cc[2];
        rgba[ (y*w + x)*4 + 3 ] = cc[3];
      }
  
      ++y;
    }
  
    return rgba;
  }
  
  function rgba2bitmap(rgba,w,h) {
    let bitmap = Array(h).fill(1).map(_ => []);
    let pal = [];
  
    let x = 0, y = 0
    rgba.reduce(rgbaToPixels, []).forEach(px => {
      let idx = colorIndex(pal, px[0], px[1], px[2])
      bitmap[y][x] = idx
  
      x += 1
      if (x >= w) {
        x = 0
        y += 1
      }
    })
    // TODO: swap (0,0,0) to idx #0, (255,255,255) to idx #1
    // TODO: handle alpha transparency
  
    let pdata = Object.create(PixelData.prototype)
  
    pdata.w = w
    pdata.h = h
    pdata.bitmap = bitmap
    pdata.palette = pal
  
    return pdata
  }
  
  function colorIndex(pal, r,g,b, extendPalette=true) {
    let i = 0
    while (i<pal.length) {
      if (pal[i][0] === r && pal[i][1] === g && pal[i][2] === b) return i
      ++i
    }
  
    // extend palette
    if (!extendPalette) return 0
  
    pal.push([r,g,b])
    return pal.length-1
  }
  
  
  function bytes2bitmap(bytes,w,h,frames,explicit) {
    // Width / height optional, assume square image @ 8x8 or multiples
    if (!explicit) {
      if (!h) {
        h = w;
      }
      if (!w || (w * Math.ceil(h/8)) < bytes.length) {
        w = h = Math.ceil( Math.sqrt( bytes.length / 8) ) * 8;
      }
    }
  
    // Stores the image as a bitmap
    let bitmap = []
  
    // Real height of the frame is this divisible by 8
    let rows = Math.ceil(h/8)
  
    let f = 0;
    do {
  
      for (let y = 0; y<h; ++y) {
        bitmap[y+f*h] = bitmap[y+f*h] || [];
        for (let x = 0; x<w; ++x) {
          bitmap[y+f*h][x] = (bytes[w * (f*rows + (y >> 3)) + x] & (1 << (y % 8))) ? 1 : 0;
        }
      }
  
      ++f;
    } while (f < frames);
  
    return bitmap;
  }
  
  function bytes2pif(bytes,w,h,id) {
    return bitmap2pif( bytes2bitmap(bytes,w,h), id );
  }
  
  // Import BMP bitmap files
  // Based on the BMP data format structure documented in:
  // http://paulbourke.net/dataformats/bmp/
  function bmp2bitmap(b) {
    // BM (magic identifier) in fist two bytes: 0x42@0, 0x4D@1
    if (b[0] !== 0x42 || b[1] !== 0x4D) throw("Not a valid BMP file.");
  
    // Image data starts: 4-byte-uint@10
    var imgdata = b.readUInt32LE(10);
  
    // Image width & height: 4-byte-int@18,22
    var w = b.readInt32LE(18),
        h = b.readInt32LE(22);
  
    // Bits-per-pixel: 2-byte-ushort@28
    // 32bpp means alpha channel + RGB
    var bpp = b.readUInt16LE(28);
  
    // Log import
    console.log("Importing BMP bitmap:", b.length,"bytes,",w,"x",h,"bitmap @",bpp,"bpp");
  
    // Read image bitmap based on above metadata
    var bitmap = new Array(h),
        y = 0, v;
  
    for (i = 0; i < w*h; ++i) {
      // For some reason the image rows are flipped in BMP files
      y = h - 1 - Math.floor(i/w);
  
      // New row
      if (!bitmap[y]) bitmap[y] = [];
  
      switch (bpp) {
        // 32 bit ABGR
        case 32:
          v = b.readUInt32LE(imgdata + i * 4);
  
          // Check transparency value, also non-black color value
          bitmap[y][i%w] = ( (v >>> 24) > (0xFF >> 1) && (v & 0xFFFFFF) ) ? 1 : 0;
          break;
  
        // 24 bit BGR
        case 24:
          v = b[imgdata + i*3] | b[imgdata + i*3 + 1] | b[imgdata + i*3 + 2];
  
          // Count all non-completely-black color values
          bitmap[y][i%w] = v ? 1 : 0;
          break;
  
        // 1 bit B&W
        case 1:
          // Strange padding to 4 bytes
          v = b.readUInt32BE(imgdata + (h - y - 1) * Math.ceil(w/32)*4);
  
          // Count all bits
          bitmap[y][i%w] = ( (v >>> (31-(i%w))) & 1 ) ? 1 : 0;
          break;
      }
    }
  
    return bitmap;
  }
  
  function loadPif(contents) {
    // Skip empty rows and trim unneeded whitespace, split to lines
    let bitmap = contents.split('\n').map(r => r.trim()).filter(r => r !== '' );
  
    // Retrieve DATA and META rows separately
    let rows = bitmap.filter(r => r[0].match(/^[a-z0-9\.\#]/i))
    let meta = bitmap.filter(r => r[0].match(/^[^a-z0-9\.\#]/i)).join(' ') //TODO
  
    let pdata = Object.create(PixelData.prototype);
  
    // Dimensions
    pdata.w = Math.max(...rows.map(r=>r.length));
    pdata.h = rows.length;
  
    // Metadata
    detectDimensions(meta, pdata)
  
    let m = meta.match(/[a-z]\w+/)
    if (m) {
      pdata.id = m[0]
    }
  
    pdata.bitmap = rows.map(row => row.split('').map(i => i==='#' ? 1 : parseInt(i,16)||0) )
  
    // ensure bitmap row size
    pdata.bitmap.forEach(r => r.length = pdata.w)
  
    return pdata
  }
  
  function loadCode(contents, label, statement) {
    let pdata = Object.create(PixelData.prototype);
    statement = statement || contents;
  
    // Check for validarray initializer
    contents = arrayInitializerContent(statement);
  
    if (!contents) {
      console.log('No valid array initializer found')
      return null
    }
  
    // Pixelsprite id (label)
    if (!label) {
      let match;
      // try to guess from source
      // char|byte label[]
      // TODO: char|byte* label
      match = statement.match(/(?:char|byte)\s+(\w+)\[\]/)
      if (match) {
        label = match[1]
      }
    }
  
    pdata.id = label;
  
    // Serialized binary Pixelsprite data in PROGMEM format
    pdata.data = cleanComments(contents)
      .trim().replace(/,\s*$/,'') // get rid of useless whitespace and trailing commas
      .split(',') // get values
        .map(function(n) { return parseInt(n); }); // parse values
  
  
    // Try to guess image width/height
    pdata.w = parseInt( (statement.match(/w\:\s*(\d+)[^\n]+/) || [])[1] );
    pdata.h = Math.floor(pdata.data.length / pdata.w) * 8;
    pdata.frames = 0;
    pdata.ambiguous = true;
  
    // Try to detect/load dimensions from metadata
    detectDimensions(statement, pdata)
  
    // Generate bitmap
    pdata.bitmap = bytes2bitmap(pdata.data,pdata.w,pdata.h,pdata.frames,true)
  
    return pdata;
  }
  
  // Pixelsprite dimensions can be declared in comments besides the
  // binary pixeldata in the format WWWxHHH where WWW and HHH are both
  // integer pixel values for width/height
  // eg.: PROGMEM ... sprite[] = { /*128x64*/ 0xa3, 0x... }
  // Optionally, a single pixelsprite can contain multiple sprites (frames)...
  function detectDimensions(source, pdata) {
    var m = source.match(/(?:!|\/\/|\/\*)?\s*([1-9]\d*|0)x([1-9]\d*|0)(?:x(\d+))?(?:@(\d+|(?:#[a-fA-F0-9]{3,8}[,;|\/]?)+))?/);
    if (m) { // 0x0 can be used for size autodetect, when applicable
      pdata.w = parseInt(m[1],10)||pdata.w;
      pdata.h = parseInt(m[2],10)||pdata.h;
      pdata.frames = m[3] ? parseInt(m[3],10) : 0;
      pdata.bpp = m[4] ? detectPalette(m[4], pdata) : 1;
      pdata.ambiguous = false;
    }
  }
  
  function detectPalette(pal, pdata) {
    if (parseInt(pal, 10)) {
      pdata.palette = [ [0,0,0,0] , [255,255,255,255] ]
      pdata.frames = parseInt(pal, 10)
  
      return pdata.frames
    }
  
    const colors = pal.split(/[,;|\/]/)
    if (colors.length) {
      pdata.palette = [ [0,0,0,0] ].concat(
        colors.map(h => {
          // Skip hashmark and parse as a hex integer
          let i
          switch (h.length-1) {
            case 6:
              i = parseInt(h.substring(1), 16)
              return [ i>>16&0xFF , i>>8&0xFF , i&0xFF, 255 ]
              //return [ i>>8&0xF , i>>4&0xF , i&0xF, 0xF ].map( hexColor3to6 )
  
            case 3:
              i = parseInt(h.substring(1), 16)
              return [ i>>4&0xF0|i>>8&0xF , i&0xF0|i>>4&0xF , i<<4&0xF0|i&0xF, 255 ]
            //TODO: #RGBA, #RRGGBBAA
          }
        })
      )
  
      // For bit depth take into account transparency (color idx #0)
      return Math.ceil(Math.log2(colors.length+1))
    }
  }
  
  function metadata(pdata) {
    const { id, w, h } = pdata
  
    let ret = `! ${id} ${w}x${h}`
  
    if (pdata.frames > 1) {
      ret += `x${pdata.frames}`
    }
  
    if (pdata.palette && pdata.palette.length > 2) {
      // TODO: alpha handling (slice(0,4))
      const pc = pdata.palette.slice(1).map(color => color.slice(0,3).reduce(
        (a,b) => a + b.toString(16).padStart(2,'0'), '#'
      ))
      ret += `@${pc.join(',')}`
    }
  
    return ret
  }
  
  
  const RX_CLEANCOMMENTS = /(\/\/[^\n]*\n|\/\*(.*?\*\/))/g;
  
  function cleanComments(str) {
    return str.replace(
      RX_CLEANCOMMENTS,
      function(i) { return ' '.repeat(i.length); }
    );
  }
  
  function arrayInitializerContent(statement) {
    try {
      return ( statement
        .replace(/\r|\n|\t/g, ' ') // remove line breaks and tabs
        .match(/=\s*[{\[](.*)[}\]]/)[1] // match core data
        .replace(/\s+/g, ' ').trim() // clean up whitespace
      ) || statement;
    } catch(e) {
      return null
    };
  
    return statement;
  }
  
  const MONOPAL = [ [0,0,0,0], [255,255,255,255] ]
  const MONOMAP = MONOPAL.map(e => e[0])
  
  const GS5PAL = [ [0,0,0,0], [85,85,85,255], [128,128,128,255], [170,170,170,255], [255,255,255,255] ]
  const GS5MAP = GS5PAL.map(e => e[0])
  
  function colorsToGrayscale(palette, bitmap) {
    let ret = {}
  
    ret.mappedPalette = palette.map(toGray)
    ret.mapping = ret.mappedPalette.map(c => c[3]>0 ? GS5MAP.indexOf(c[0]) : 0)
  
    ret.palette = GS5PAL
  
    ret.bitmap =  bitmap.map(row => row.map(idx => ret.mapping[idx]))
  
    return ret
  }
  
  function toGray(color) {
    let avg
  
    // Simple average
    avg = ((color[0]+color[1]+color[2])/3)|0
    // Luma coded - https://en.wikipedia.org/wiki/Grayscale
    //avg = Math.floor(0.299*color[0]+0.587*color[1]+0.114*color[2])
  
    //const pts = [ 0, 96, 160, 255 ]
    const pts = GS5MAP
    let sel
    let d = 255
  
    // reduce to bit depth
    pts.forEach(p => {
      if (Math.abs(avg-p)<d) {
        d = Math.abs(avg-p)
        sel = p
      }
    })
  
    return [sel,sel,sel, color[3]]
  }
  
  // Chunk into 4-byte arrays - TODO: generalize as ext function for 16bit
  function rgbaToPixels(arr,i) {
    //TODO: transparency
    if (arr.length && arr[arr.length-1].length<4) {
      arr[arr.length-1].push(i)
    } else {
      arr.push([i])
    }
  
    return arr
  }
  
  function rgba2c8(pixel) {
    return pixel[2]&0xE0 | ((pixel[1]&0xE0)>>3) | ((pixel[0]&0xC0)>>6)
  }
  
  function rgba2c16(pixel) {
    return ((pixel[2]&0xF8)<<8) | ((pixel[1]&0xFC)<<3) | ((pixel[0]&0xF8)>>3)
  }
  function hexColor3to6(component) {
    return (component<<4|component)
  }
  
  
  
  PixelData.codeToPif = loadCode
  PixelData.loadPif = loadPif
  
  PixelData.util = {
    cleanComments, arrayInitializerContent, rgba2bitmap, rgba2c16, rgba2c8, hexColor3to6
  }
  
  /*
  GLOBAL.fromBitmap = bitmap2pif;
  GLOBAL.toBitmap = pif2bitmap;
  
  GLOBAL.fromBytes = bytes2pif;
  GLOBAL.toBytes = pif2bytes;
  */
  
  try {
    window.PixelData = PixelData;
  } catch (e) {
    module.exports = PixelData;
  }
  
  // Expose library version
  Object.defineProperty(PixelData, 'VERSION', { value: '0.4.0' })
  })(); // IIFE
  