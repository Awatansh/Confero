# MDX Writing Guide

Complete guide to writing blog posts with MDX in Confero.

## Basic Structure

Every MDX file needs frontmatter + content:

```mdx
---
title: 'Your Post Title'
date: '2024-01-01'
description: 'Brief description for SEO'
tags: ['machine-learning', 'tutorial']
space: 'ml'
---

# Your Post Title

Your content starts here...
```

## Frontmatter Rules

### Required Fields

```yaml
title: 'Post Title' # Any string
date: '2024-01-01' # ISO format (YYYY-MM-DD)
description: 'Brief description' # 50-160 chars recommended
tags: ['tag1', 'tag2'] # Array of strings
space: 'ml' # Valid space ID
```

### Valid Spaces

- `ml` - Machine Learning
- `transformers` - Transformers
- `web` - Web Development
- `notes` - General Notes
- `blog` - Blog Posts

### Tag Rules

✅ **Correct:**

- `machine-learning`
- `deep-learning`
- `neural-networks`

❌ **Wrong:**

- `Machine Learning` (uppercase)
- `machine_learning` (underscore)
- `machine learning` (spaces)

**Format:** lowercase, alphanumeric, hyphens only

## Markdown Basics

### Headers

```md
# H1 - Post Title

## H2 - Major Section

### H3 - Subsection

#### H4 - Minor Heading
```

### Text Formatting

```md
**bold text** _italic text_ **_bold and italic_** `inline code` ~~strikethrough~~
```

### Lists

```md
Unordered:

- Item 1
- Item 2
  - Nested item

Ordered:

1. First
2. Second
3. Third
```

### Links

```md
[Link text](https://example.com) [Internal link](/posts/other-post)
```

### Images

```md
![Alt text](/assets/image.png) ![Alt text](https://example.com/image.jpg)
```

### Blockquotes

```md
> This is a quote Multiple lines
```

### Code Blocks

````md
```python
def hello():
    print("Hello, World!")
```

```javascript
const greet = () => {
  console.log('Hello!');
};
```
````

## Math Symbols

### Inline Math

Use `$...$` for inline equations:

```md
Einstein's equation is $E = mc^2$.
```

Result: Einstein's equation is $E = mc^2$.

### Display Math

Use `$$...$$` for block equations:

```md
$$
\frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$
```

Result:

$$
\frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$

### Common Math Symbols

**Greek Letters:**

```latex
$\alpha, \beta, \gamma, \delta$
$\Delta, \Sigma, \Omega$
```

**Operators:**

```latex
$\sum_{i=1}^{n} x_i$
$\int_{0}^{\infty} e^{-x} dx$
$\prod_{i=1}^{n} x_i$
```

**Fractions:**

```latex
$\frac{a}{b}$
$\frac{\partial f}{\partial x}$
```

**Superscripts/Subscripts:**

```latex
$x^2, x_i, x_i^2$
```

**Brackets:**

```latex
$\left( \frac{1}{2} \right)$
$\left[ x + y \right]$
$\left\{ a, b, c \right\}$
```

**Matrices:**

```latex
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
```

**Align Equations:**

```latex
$$
\begin{align}
f(x) &= x^2 \\
f'(x) &= 2x
\end{align}
$$
```

## Tables

```md
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

Alignment: | Left | Center | Right | |:-----|:------:|------:| | L | C | R |
```

## Advanced Features

### Horizontal Rule

```md
---
```

### Task Lists

```md
- [x] Completed task
- [ ] Incomplete task
```

### Footnotes

```md
Here's a sentence with a footnote[^1].

[^1]: This is the footnote.
```

## Complete Example

````mdx
---
title: 'Understanding Neural Networks'
date: '2024-01-15'
description: 'A comprehensive guide to neural network fundamentals'
tags: ['neural-networks', 'deep-learning', 'tutorial']
space: 'ml'
---

# Understanding Neural Networks

Neural networks are the foundation of modern deep learning.

## What is a Neural Network?

A neural network is a computational model inspired by biological neurons. The basic equation is:

$$
y = \sigma(Wx + b)
$$

where $\sigma$ is the activation function.

### Key Components

1. **Input Layer** - Receives data
2. **Hidden Layers** - Process information
3. **Output Layer** - Produces results

## Activation Functions

Common activation functions include:

- **Sigmoid:** $\sigma(x) = \frac{1}{1 + e^{-x}}$
- **ReLU:** $f(x) = \max(0, x)$
- **Tanh:** $\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$

### Code Example

```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def relu(x):
    return np.maximum(0, x)
```
````

## Training Process

The training process involves:

1. Forward pass
2. Loss calculation
3. Backpropagation
4. Weight update

The loss function for classification:

$$
L = -\sum_{i=1}^{n} y_i \log(\hat{y}_i)
$$

> **Note:** Always normalize your input data for better convergence.

## Summary

Neural networks are powerful tools for:

- Image recognition
- Natural language processing
- Time series prediction

For more details, see [this resource](https://example.com).

---

_Written on January 15, 2024_

````

## Best Practices

### Writing

1. **Start with outline** - Plan H2/H3 structure
2. **Use headers** - Clear section breaks
3. **Short paragraphs** - 2-4 sentences max
4. **Code examples** - Show, don't just tell
5. **Visual breaks** - Lists, blockquotes, code blocks

### Math

1. **Inline for simple** - $x = 5$
2. **Display for complex** - Multi-line equations
3. **Explain symbols** - Don't assume knowledge
4. **Number equations** - For reference

### Content

1. **Frontmatter first** - Always complete
2. **Valid tags** - lowercase-with-hyphens
3. **Correct space** - Matches spaces.json
4. **Proofread** - Check before committing

## Validation Checklist

Before publishing:

- [ ] Frontmatter has all required fields
- [ ] Date is ISO format (YYYY-MM-DD)
- [ ] Tags are lowercase with hyphens
- [ ] Space ID is valid
- [ ] Headers use proper levels (# ## ###)
- [ ] Code blocks have language specified
- [ ] Math symbols use $...$ or $$...$$
- [ ] Links are working
- [ ] Images have alt text

## Testing Your Post

```bash
# 1. Build to check for errors
npm run build

# 2. Run tests
npm test

# 3. View locally
npm run dev
# Visit http://localhost:4321/posts/your-post
````

## Common Errors

**Build Error: "space not found"**

- Fix: Use valid space ID from spaces.json

**Build Error: "date must be string"**

- Fix: Wrap date in quotes: `date: "2024-01-01"`

**Test Error: "tag not URL-safe"**

- Fix: Use lowercase + hyphens: `machine-learning`

**Math Not Rendering:**

- Fix: Check delimiter syntax `$...$` or `$$...$$`

## Resources

- [MathJax Docs](https://docs.mathjax.org/en/latest/input/tex/index.html)
- [MDX Syntax](https://mdxjs.com/)
- [Markdown Guide](https://www.markdownguide.org/)

Happy writing! 📝
