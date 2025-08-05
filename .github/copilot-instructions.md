# Messad Estudio Development Guidelines

## Project Architecture

### Core Structure
```
/
├── scss/               # Main styles source
│   ├── style.scss     # Main SCSS entry
│   ├── components/    # Component styles
│   └── bootstrap/     # Bootstrap overrides
├── css/               # Compiled styles
├── js/               # JavaScript files
├── fonts/            # Custom fonts
└── images/          # Project images
```

### Base Configuration
- Primary color: `$primary: #fc5404`
- Font families:
  - Primary: Roboto (`$font-family-sans-serif`)
  - Secondary: Montserrat (`$font-family-sans-serif-secondary`)
- Default text size: `14px`
- Body color: `#7a7a7a`

## Component System

### Navigation
```scss
.site-nav {
    position: absolute;
    background-color: #1c1c1c;
    z-index: 9;
}
```

#### Mobile Navigation
- Transform states: `translateX(100%)` → `translateX(0%)`
- Background: `rgba(28, 28, 28, 0.95)`
- Animation: `.8s cubic-bezier(.23,1,.32,1)`

#### Dropdown Menu
```scss
.has-children {
    position: relative;
    
    .dropdown {
        visibility: hidden;
        opacity: 0;
        transition: 0.2s 0s;
    }
}
```

### Hero Sections
```scss
.hero-2 {
    background-size: cover;
    background-position: center;
    min-height: 670px;
    
    &.overlay:before {
        background: rgba($black, .6);
    }
}
```

### Section Layouts
- Standard padding: `7rem 0`
- Mobile padding: `2rem 0`
- Section headings:
  - Font size: `40px`
  - Text transform: `uppercase`
  - Font weight: `bold`

### Cards & Content Blocks
```scss
.post-entry-1 {
    .post-entry-1-contents {
        background: $white;
        padding: 30px;
        
        h2 {
            font-size: 20px;
            margin-bottom: 20px;
        }
    }
}
```

### Testimonials Slider
- Centered layout
- Background: white
- Border radius: `10px`
- Author image: `80px` circular

## JavaScript Components

### Main Scripts
- `custom.js`: Core functionality and initializations
- `tiny-slider.js`: Carousel/slider functionality
- `counter.js`: Animated counters

### Initialization Parameters
```javascript
AOS.init({
    duration: 800,
    easing: 'slide',
    once: true
});
```

### Slider Configuration
```javascript
{
    autoplay: true,
    controls: true,
    gutter: 50,
    center: true,
    responsive: {
        350: { items: 1 },
        700: { items: 2 }
    }
}
```

## Responsive Design

### Breakpoints
```scss
$grid-breakpoints: (
    xs: 0,
    sm: 576px,
    md: 768px,
    lg: 992px,
    xl: 1200px,
    xxl: 1400px
);
```

### Container Widths
```scss
$container-max-widths: (
    sm: 540px,
    md: 720px,
    lg: 960px,
    xl: 1140px,
    xxl: 1320px
);
```

## UI Components

### Buttons
```scss
.btn {
    padding: 12px 20px;
    border-radius: 0;
    
    &.btn-primary {
        background-color: $black;
        border: 2px solid transparent;
    }
}
```

### Forms & Inputs
```scss
.search-form {
    background: lighten($black, 97%);
    padding: 10px;
    
    .form-group {
        position: relative;
    }
}
```

### Typography
- Headings: Montserrat
- Body text: Roboto
- Base size: `14px`
- Line height: `1.6`

## Common Tasks

### Adding New Sections
1. Create component SCSS in `components/`
2. Follow section padding standards
3. Use responsive mixins

### Modifying Styles
1. Update variables in `_variables.scss`
2. Override Bootstrap in components
3. Test responsive breakpoints

### JavaScript Features
1. Initialize in `custom.js`
2. Configure responsive options
3. Add event handlers

### Image Optimization
1. Use appropriate formats
2. Maintain aspect ratios
3. Consider responsive sizes

## Best Practices

### SCSS Organization
- Use component partials
- Follow BEM naming
- Maintain variable system

### Performance
- Optimize images
- Minify production assets
- Use lazy loading

### Accessibility
- Maintain contrast ratios
- Include ARIA labels
- Support keyboard navigation
