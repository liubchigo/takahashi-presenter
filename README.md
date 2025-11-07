# Takahashi-Style Presenter

A minimalist presentation tool that embodies the Takahashi Method: **large text, few words, maximum impact**.

## What is the Takahashi Method?

Created by Masayoshi Takahashi, this presentation style emphasizes:
- **One key phrase per slide**
- **Very large font size**
- **Minimal visual distractions**
- **Fast-paced delivery**

## Features

✨ Simple text input format  
🎨 Dark and light themes  
⌨️ Full keyboard navigation  
📱 Mobile-friendly with tap navigation  
💾 Auto-save to localStorage  
🎯 Auto-scaling text to fit screen  
🚀 No dependencies, pure vanilla JavaScript  

## Quick Start

1. Open `index.html` in your browser
2. Enter your presentation text (blank lines separate slides)
3. Choose your theme and font
4. Click "Start Presentation"

## Input Format

Create slides by separating text with blank lines:

```
Welcome

To

Takahashi

Method

Simple
Is
Better
```

### Advanced Format

You can also use:
- `---` as slide separators
- `#` prefix for title slides
- Metadata block for theme/font settings

```
---
theme: dark
font: sans-serif
---

# Welcome

Your slides here
```

**📖 See [INPUT-FORMAT.md](INPUT-FORMAT.md) for complete documentation and examples.**

## Navigation Controls

### Keyboard Shortcuts

- `→` `Space` `↓` - Next slide
- `←` `↑` - Previous slide
- `Home` - First slide
- `End` - Last slide
- `F` - Toggle fullscreen
- `P` - Toggle progress bar
- `C` - Toggle slide counter
- `?` - Show help
- `Esc` - Exit presentation

### Touch & Mouse Controls

- **Tap left side** of screen - Previous slide
- **Tap right side** of screen - Next slide  
- **Tap center** - No action (safe zone for accidental touches)

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Local Development

No build process required! Just open `index.html` in your browser.

For a local server (optional):
```bash
python -m http.server 8000
# or
npx serve
```

## Project Structure

```
takahashi-style-presenter/
├── index.html          # Editor page
├── presenter.html      # Presentation view
├── css/
│   ├── main.css       # Global styles
│   ├── editor.css     # Editor styles
│   ├── presenter.css  # Presentation styles
│   └── themes.css     # Theme definitions
├── js/
│   ├── app.js         # Main app logic
│   ├── parser.js      # Text parser
│   ├── renderer.js    # Slide renderer
│   ├── navigation.js  # Keyboard navigation
│   ├── storage.js     # LocalStorage
│   └── presenter.js   # Presentation controller
└── README.md
```

## License

MIT License - feel free to use and modify!

## Credits

Inspired by the presentation method created by Masayoshi Takahashi.

---

**Keep it simple. Keep it bold. Keep it impactful.** 🚀
