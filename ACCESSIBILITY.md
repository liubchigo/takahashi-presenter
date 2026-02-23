# Accessibility Features

The Takahashi-Style Presenter has been designed with comprehensive accessibility features to ensure all users can create and deliver presentations effectively.

## WCAG 2.1 Compliance

This application strives to meet WCAG 2.1 Level AA standards through the following features:

### Keyboard Navigation

**Complete keyboard control** - no mouse required:
- **Arrow keys** (←/→/↑/↓), **Space**, **PageUp/PageDown** - Navigate between slides
- **Home/End** - Jump to first/last slide
- **Tab** - Move between interactive elements
- **Enter/Space** - Activate buttons and controls
- **Escape** - Close modals and exit presentation
- **F** - Toggle fullscreen
- **P/C/T/%/H** - Toggle various UI controls
- **O** - Open slide overview
- **?** - Show keyboard shortcuts help
- **A** - Toggle animations
- **R** - Reset timer

### Screen Reader Support

**ARIA labels and landmarks** throughout:
- Main content areas marked with `role="main"`
- Modals properly identified with `role="dialog"` and `aria-modal="true"`
- Live regions (`aria-live="polite"`) announce slide changes and status updates
- Progress bar with `role="progressbar"` and dynamic `aria-valuenow`
- All interactive elements have descriptive `aria-label` attributes
- Slide counter marked as `role="status"` for automatic announcements

**Semantic HTML**:
- Proper heading hierarchy (h1, h2, h3)
- Native `<button>` elements instead of clickable divs
- Labeled form controls with `<label>` elements
- Descriptive link text

### Focus Management

**Modal focus trapping**:
- When a modal opens, focus moves to the first interactive element
- Tab key cycles through modal elements only
- Escape closes modal and returns focus to main content
- Prevents keyboard users from getting lost

**Visible focus indicators**:
- High-contrast outline (3px solid blue) on all focusable elements
- Enhanced focus states for buttons, links, and controls
- Respects `:focus-visible` for better mouse/touch UX

### Visual Accessibility

**Color and Contrast**:
- All themes maintain WCAG AA contrast ratios (4.5:1 for text)
- Focus indicators use high-contrast colors
- Interactive elements have clear hover/focus states

**Responsive Text Sizing**:
- Text scales appropriately for zoom levels up to 200%
- No horizontal scrolling required
- Minimum touch target size of 44x44px for buttons

**Reduced Motion Support**:
- Respects `prefers-reduced-motion` media query
- Animations can be disabled via settings
- Keyboard shortcut (A) to toggle animations during presentation

### High Contrast Mode

- Additional styles for users with `prefers-contrast: high`
- Enhanced borders on interactive elements
- Thicker focus indicators (4px)

## Assistive Technology Testing

This application has been designed to work with:
- **Screen readers**: JAWS, NVDA, VoiceOver, TalkBack
- **Keyboard navigation**: Full functionality without mouse
- **Voice control**: Dragon NaturallySpeaking, Voice Control
- **Screen magnification**: ZoomText, Windows Magnifier

## Accessibility Checklist

✅ Keyboard navigation for all functionality  
✅ Screen reader support with ARIA labels  
✅ Focus management in modals  
✅ Visible focus indicators  
✅ Semantic HTML structure  
✅ Sufficient color contrast  
✅ Responsive text sizing  
✅ Reduced motion support  
✅ Touch target minimum sizes  
✅ Live region announcements  
✅ Skip links capability  
✅ Form labels and descriptions  
✅ Error messages are accessible  
✅ Progress and status updates announced  

## Keyboard Shortcuts Reference

### Navigation
- `→` `Space` `↓` `PageDown` - Next slide
- `←` `↑` `PageUp` - Previous slide
- `Home` - First slide
- `End` - Last slide

### Controls
- `F` - Toggle fullscreen
- `P` - Toggle progress bar
- `C` - Toggle slide counter
- `T` - Toggle timer
- `%` - Toggle percentage
- `H` - Hide/show all controls
- `R` - Reset timer

### Features
- `O` - Toggle overview mode
- `A` - Toggle animations
- `?` - Show/hide help
- `Esc` - Close modal or exit

### Overview Mode
- `Tab` - Navigate between slide thumbnails
- `Enter` or `Space` - Jump to selected slide
- `Esc` - Close overview

## Best Practices for Presenters

### Creating Accessible Presentations

1. **Keep text concise** - Screen readers will read all text aloud
2. **Use clear language** - Avoid jargon when possible
3. **Provide context** - Title slides help orient users
4. **Announce slide numbers** - Use the built-in counter (press C to show)
5. **Describe visual elements** - If using emojis or symbols, consider adding context

### Presenting with Screen Readers

1. Enable the slide counter (press `C`) for orientation
2. Use the timer (press `T`) to pace yourself
3. Press `O` to review all slides before presenting
4. The current slide content is automatically announced when it changes

### Keyboard-Only Presentation

1. Use arrow keys or space bar for smooth navigation
2. Press `?` to review shortcuts anytime
3. Press `H` to hide all controls for cleaner view
4. Use `Home`/`End` for quick navigation to bookends

## Reporting Accessibility Issues

If you encounter any accessibility barriers, please report them via GitHub Issues with:
- Description of the issue
- Steps to reproduce
- Assistive technology used (if applicable)
- Browser and OS version

We are committed to continuous improvement of accessibility features.
