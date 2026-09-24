# Input Format Reference

## Quick Start

The simplest way to create slides is to separate your text with **blank lines**:

```
First Slide

Second Slide

Third Slide
```

## Basic Syntax

### Slide Separators

You can separate slides in two ways:

#### 1. Blank Lines (Recommended)
```
Hello
World

This is
A new slide

And another
One here
```

#### 2. Horizontal Rules
```
First Slide
---
Second Slide
---
Third Slide
```

### Multiple Blank Lines

Multiple blank lines are treated as a single separator:

```
Slide One


Slide Two



Slide Three
```
All produce the same result.

## Special Formatting

### Title Slides

Use `#` at the beginning to mark a title slide (slightly different styling):

```
# Welcome

# Introduction

# Conclusion
```

### Emphasis Slides

Use `!` at the beginning for emphasis (future feature):

```
! Important

! Remember This

! Key Takeaway
```

## Metadata Block

You can include a metadata block at the very beginning of your presentation to set global options:

```
---
theme: dark
font: sans-serif
---

Your First Slide

Second Slide
```

### Available Metadata Options

- `theme`: `dark` or `light`
- `font`: `sans-serif`, `serif`, or `monospace`

Example:
```
---
theme: light
font: serif
---

# My Presentation

Welcome

To my talk
```

## Complete Example

Here's a complete presentation with all features:

```
---
theme: dark
font: sans-serif
---

# Takahashi Method

Simple
---
Is

Better

One
Idea

Per
Slide

Big
Text

Fast
Pace

! Remember

Keep
It
Simple

# Thank You
```

## Images

You can add images to your presentation using the `@image:` syntax:

```
@image: https://example.com/photo.jpg
Optional caption text

@image: https://example.com/another.jpg

Regular text slide
```

### Image Syntax

#### Basic Image (No Caption)
```
@image: https://example.com/image.jpg

Next slide
```

#### Image with Caption
```
@image: https://example.com/image.jpg
Beautiful sunset

Next slide
```

### Image Guidelines

- **One image per slide**: Each `@image:` declaration creates a new slide
- **URL-based**: Images must be hosted online (HTTP/HTTPS URLs)
- **Caption**: Optional single line of text after the image URL
- **Separation**: Blank line after the image (or caption) starts a new slide

### Supported Image Sources

✅ **Recommended Sources:**
- Public image hosting (Imgur, Cloudinary, etc.)
- Cloud storage with public links (Google Drive, Dropbox)
- Content delivery networks (CDN)
- Direct image URLs from websites

✅ **URL Formats:**
- `https://example.com/image.jpg`
- `http://example.com/image.png`
- Relative paths: `./images/photo.jpg`

### Image Display

- Images are displayed **full-screen** (90% viewport width, 85% viewport height)
- Images maintain their **aspect ratio** (no cropping)
- Images are **centered** on the slide
- Captions appear at the **bottom** in a readable size
- Works with **all themes**

### Example: Photo Presentation

```
---
theme: ocean
---

# Summer 2025

@image: https://picsum.photos/1920/1080?random=1
Adventure begins

@image: https://picsum.photos/1920/1080?random=2
Stunning views

@image: https://picsum.photos/1920/1080?random=3
Memories made

# The End
```

### Best Practices

✅ **Do's:**
- Use high-resolution images (minimum 1920x1080)
- Keep captions short (1-5 words)
- Test images load before presenting
- Use reliable image hosting services
- Ensure images are publicly accessible

❌ **Don'ts:**
- Don't use very large files (>5MB) - they slow loading
- Don't use images requiring authentication
- Don't add multiple lines in captions
- Don't mix text and images on the same slide

### Troubleshooting

**Image not loading?**
- Check the URL is correct and public
- Ensure CORS is enabled on the image host
- Try opening the URL in a browser
- Check your internet connection

**Caption not showing?**
- Make sure caption is on the line immediately after `@image:`
- Caption must be a single line
- Blank line after caption starts new slide

## Best Practices

### ✅ Do's

- **Keep it short**: 1-5 words per slide
- **Use blank lines**: Most readable separator
- **Test font size**: Preview to ensure text fits
- **Be consistent**: Stick to one separator style

### ❌ Don'ts

- **Don't write paragraphs**: Too much text won't fit
- **Avoid very long words**: May overflow the screen
- **Don't mix separators**: Use blank lines OR --- consistently
- **Skip complex formatting**: Keep it minimal

## Tips for Great Presentations

1. **One Concept Per Slide**
   ```
   Problem
   
   Solution
   
   Result
   ```

2. **Build Anticipation**
   ```
   What is
   
   The secret
   
   To success?
   
   Hard work
   ```

3. **Use Numbers**
   ```
   3
   
   Simple
   
   Steps
   ```

4. **Questions Work**
   ```
   Why?
   
   Because
   
   It works
   ```

## Character Limits

- **Ideal**: 1-10 characters
- **Good**: 11-30 characters
- **Okay**: 31-50 characters
- **Warning**: 51-100 characters (may not fit well)
- **Too Long**: 100+ characters (will likely overflow)

## Multi-line Slides

You can have multiple lines in a single slide:

```
Line One
Line Two
Line Three

This is
All one
Slide

This is
Another slide
```

The text will auto-scale to fit the screen.

## Examples

### Minimal Presentation
```
Start

Middle

End
```

### Story Format
```
Once

Upon

A time

There was

A bug

We fixed it

The End
```

### Technical Presentation
```
# Problem

Slow
Performance

# Solution

Cache
Everything

# Result

10x
Faster
```

### Motivational Talk
```
Dream

Big

Work

Hard

Never

Give

Up

Success
```

## Loading Your Presentation

### Method 1: Direct Input
Type or paste directly into the text area on the main page.

### Method 2: Upload File
Create a `.txt` or `.md` file and use the "Upload File" button.

### Method 3: Auto-save
Your presentation is automatically saved as you type!

## File Naming

When saving your presentations:
- Use `.txt` for plain text: `my-presentation.txt`
- Use `.md` for markdown: `my-presentation.md`

Both formats work identically!

## Testing Your Presentation

Before presenting:
1. Click "Start Presentation"
2. Navigate through all slides
3. Check text fits on screen
4. Verify all content is included
5. Test keyboard shortcuts

## Troubleshooting

### Slides Not Separating
- Make sure you have a **blank line** between slides
- Check for invisible characters
- Try using `---` instead

### Text Too Small/Large
- The app auto-scales based on content length
- Shorter text = larger font
- Longer text = smaller font (to fit)

### Missing Slides
- Check your separators
- Verify no accidental triple-spacing
- Look for metadata block errors

### Metadata Not Working
- Must be at the **very beginning** of file
- Must use exact format: `---` on separate lines
- Check spelling: `theme:` not `themes:`

## Advanced Tips

### Consistent Pacing
Keep similar character counts for smooth pacing:
```
One

Two

Three

Four
```

### Dramatic Pauses
Use single-character slides:
```
But

.

.

.

Wait
```

### Countdowns
```
3

2

1

Go!
```

---

**Questions?** Just start typing and experiment! The format is designed to be intuitive and forgiving.
