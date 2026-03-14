# 06 - Rich Content

Custom visuals outperform stock photos every time. This chapter covers making technical images with Python + Pillow and optional hero images with Midjourney.

## Why Custom Visuals Matter

Stock photos are wallpaper. They fill space but communicate nothing. When someone sees a generic "person typing on laptop" image on your blog post about SEO pipelines, their brain skips it entirely.

Custom visuals do three things stock photos cannot:

1. They communicate information (a diagram explains a workflow faster than three paragraphs)
2. They signal effort (custom images tell readers you care about the content)
3. They're shareable (people screenshot and share useful diagrams, never stock photos)

You don't need to be a designer. You need Python and a basic sense of layout.

## The Pillow Stack

Pillow (PIL) is a Python image library. It's free, scriptable, and perfect for generating technical visuals programmatically. Install it:

```bash
pip install Pillow
```

That's the entire setup. No Figma. No Canva subscription. No design tool learning curve.

### What Pillow is good at

- Data comparison cards (Feature X vs Feature Y)
- Workflow diagrams with boxes and arrows
- Info cards with stats and key points
- Social preview images (Open Graph cards)
- Simple charts and visualizations

### What Pillow is not good at

- Photorealistic images (use Midjourney for those)
- Complex illustrations (hire a designer)
- Logos and brand assets (use a vector tool)

## Basic Pillow Recipe: Dark Info Card

Here's a complete script that generates a dark-themed info card. This is the foundation you'll adapt for most technical visuals.

```python
from PIL import Image, ImageDraw, ImageFont
import os

def create_info_card(
    title: str,
    points: list[str],
    output_path: str,
    width: int = 1200,
    height: int = 675,
):
    # Dark background
    bg_color = (17, 17, 17)
    text_color = (240, 240, 240)
    accent_color = (99, 102, 241)  # Indigo
    muted_color = (156, 163, 175)  # Gray

    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Use system fonts or bundle your own
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 42)
        body_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    except OSError:
        title_font = ImageFont.load_default()
        body_font = ImageFont.load_default()

    # Draw accent bar at top
    draw.rectangle([(0, 0), (width, 4)], fill=accent_color)

    # Title
    y_offset = 60
    draw.text((60, y_offset), title, fill=text_color, font=title_font)
    y_offset += 70

    # Divider line
    draw.line([(60, y_offset), (width - 60, y_offset)], fill=muted_color, width=1)
    y_offset += 40

    # Points
    for point in points:
        # Bullet
        draw.ellipse(
            [(60, y_offset + 8), (72, y_offset + 20)],
            fill=accent_color,
        )
        draw.text((90, y_offset), point, fill=text_color, font=body_font)
        y_offset += 50

    img.save(output_path)
    print(f"Saved: {output_path}")


# Usage
create_info_card(
    title="Markdown vs CMS",
    points=[
        "Zero maintenance cost",
        "Version controlled with git",
        "No database to secure",
        "Works with any text editor",
        "Deploys in seconds",
    ],
    output_path="public/images/blog/markdown-vs-cms-card.png",
)
```

Run it:

```bash
python scripts/create_info_card.py
```

The output is a clean, dark-themed image at 1200x675 (the standard Open Graph size). Drop it in your blog post:

```markdown
![Markdown vs CMS comparison](/images/blog/markdown-vs-cms-card.png)
```

## Adapting the Recipe

### Comparison card

Two columns. Feature on the left, alternative on the right.

```python
def create_comparison(left_title, right_title, rows, output_path):
    img = Image.new("RGB", (1200, 675), (17, 17, 17))
    draw = ImageDraw.Draw(img)

    mid = 600  # Center divider

    # Column headers
    draw.text((60, 40), left_title, fill=(99, 102, 241), font=title_font)
    draw.text((mid + 40, 40), right_title, fill=(239, 68, 68), font=title_font)

    # Divider
    draw.line([(mid, 30), (mid, 645)], fill=(75, 75, 75), width=2)

    # Rows
    y = 120
    for left, right in rows:
        draw.text((60, y), left, fill=(240, 240, 240), font=body_font)
        draw.text((mid + 40, y), right, fill=(240, 240, 240), font=body_font)
        y += 55

    img.save(output_path)
```

### Workflow diagram

Boxes connected by arrows. Good for showing pipelines.

```python
def draw_box(draw, x, y, text, font, color=(99, 102, 241)):
    box_w, box_h = 200, 60
    draw.rounded_rectangle(
        [(x, y), (x + box_w, y + box_h)],
        radius=8,
        outline=color,
        width=2,
    )
    # Center text in box
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text((x + (box_w - tw) // 2, y + 15), text, fill=(240, 240, 240), font=font)

def draw_arrow(draw, x1, y1, x2, y2, color=(75, 75, 75)):
    draw.line([(x1, y1), (x2, y2)], fill=color, width=2)
    # Simple arrowhead
    draw.polygon(
        [(x2, y2), (x2 - 8, y2 - 8), (x2 + 8, y2 - 8)],
        fill=color,
    )
```

Combine these helpers to build pipeline diagrams. `Write -> Review -> Publish` with boxes and arrows between them.

### Open Graph image

The 1200x675 info card doubles as your Open Graph image. Add it to your blog post frontmatter:

```yaml
---
title: "Why Markdown Beats a CMS"
image: "/images/blog/markdown-vs-cms-card.png"
---
```

When someone shares your post on LinkedIn, X, or Slack, they see a custom image instead of a blank preview or a random page screenshot.

## Midjourney for Hero Images (Optional)

Midjourney costs $10/month at the basic tier. It's the one paid tool in this section. Skip it if you're staying fully free.

### When to use Midjourney

- Hero images for blog posts that need visual weight
- Social media visuals that aren't diagrams or charts
- Abstract imagery that sets a mood

### When not to use Midjourney

- Technical diagrams (Pillow is better and more accurate)
- Screenshots (just take screenshots)
- Anything where precision matters (Midjourney is creative, not precise)

### Practical workflow

1. Write a prompt that describes the visual you want
2. Generate 4 variations
3. Upscale the best one
4. Download and resize for web (compress to under 200KB)
5. Save to `public/images/blog/` with a descriptive filename
6. Save the prompt to `content/midjourney/` for future reference

### Prompt tips for technical content

Keep prompts specific and include style cues:

```
dark minimal workspace, single monitor showing code,
ambient purple lighting, isometric perspective, clean lines,
no text, no people --ar 16:9 --style raw
```

The `--style raw` flag reduces Midjourney's tendency to over-stylize. The `--ar 16:9` flag sets the aspect ratio to match Open Graph dimensions.

## Image Optimization

Whatever tool you use, optimize images before committing them to the repo.

### Size targets

- Blog hero images: under 200KB
- Info cards: under 100KB
- Thumbnails: under 50KB

### Quick optimization

```bash
# Install on macOS
brew install pngquant

# Compress a PNG
pngquant --quality=65-80 --output optimized.png input.png

# For JPEGs
brew install jpegoptim
jpegoptim --max=80 image.jpg
```

Or handle it in Python:

```python
img.save(output_path, optimize=True, quality=85)
```

### Alt text

Every image needs alt text. Not "image" or "screenshot." Descriptive text that tells a screen reader what the image communicates.

```markdown
![Comparison card showing 5 advantages of markdown over a CMS:
zero maintenance, version control, no database, any editor,
fast deploys](/images/blog/markdown-vs-cms-card.png)
```

## Organizing Visual Assets

```
public/
└── images/
    └── blog/
        ├── markdown-vs-cms-card.png
        ├── seo-pipeline-workflow.png
        └── content-distribution-matrix.png

content/
└── midjourney/
    └── hero-images/
        ├── 2026-03-14_markdown-hero.txt    # Prompt used
        └── 2026-03-14_markdown-hero.png    # Output
```

Keep generated images in `public/images/blog/` for the site to serve them. Keep Midjourney prompts and raw outputs in `content/midjourney/` for your records.

## Scripts Directory

Store your Pillow scripts in `scripts/` so they're reusable:

```
scripts/
├── create_info_card.py
├── create_comparison.py
└── create_workflow_diagram.py
```

Over time, you build a library of visual generators. Need a comparison card? Run the script with new data. Need a workflow diagram? Same thing. The consistency compounds.

---

**Related:** Chapter 04 (Blog Workflow), Chapter 07 (SEO Pipeline)
