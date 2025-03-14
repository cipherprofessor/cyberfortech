# Mohsin Button System

A comprehensive, flexible, and animated button system for React applications. This button library offers a variety of pre-styled buttons with animations, states, and customization options to enhance your UI experience.

## Features

- 🎨 **Multiple Variants**: Filled and outline styles for all buttons
- 🌈 **Color Options**: Primary, secondary, warning, danger, info, and default colors
- 📏 **Size Options**: Small, medium, and large sizes
- 🔄 **Animated Interactions**: Bounce, pulse, rotate, and scale animations
- 🔍 **Visual Feedback**: Ripple effects and smooth transitions
- 🔣 **Icon Support**: Left or right icon positioning
- ⏳ **Loading States**: Built-in spinner with customizable loading text
- 🌓 **Theming**: Full light and dark mode support

## Installation

1. First, ensure you have the required dependencies:

```bash
npm install framer-motion lucide-react clsx
# or
yarn add framer-motion lucide-react clsx
```

2. Copy the button components to your project:
   - `MohsinButton.tsx` - Base button component
   - `MohsinButton.module.scss` - Button styles
   - `MohsinActionButtons.tsx` - Action button variants
   - Utility file: `utils.ts` (for `cn` function)

## Basic Usage

### Import the components

```jsx
import { 
  MohsinButton,
  MohsinDownloadButton,
  MohsinLearnMoreButton,
  // ...other button components
} from '@/components/ui';
```

### Simple Button Examples

```jsx
// Basic button
<MohsinButton variant="filled" color="primary">
  Click Me
</MohsinButton>

// Button with icon
<MohsinButton 
  icon={StarIcon}
  iconPosition="left" 
  variant="outline" 
  color="secondary"
>
  Star
</MohsinButton>

// Button with animation
<MohsinButton 
  animation="bounce" 
  variant="filled" 
  color="warning"
>
  Bounce
</MohsinButton>

// Loading state
<MohsinButton 
  isLoading={true} 
  loadingText="Saving..." 
  variant="filled" 
  color="primary"
>
  Save
</MohsinButton>
```

### Pre-styled Action Buttons

```jsx
// Download button
<MohsinDownloadButton variant="filled" />

// Learn more button
<MohsinLearnMoreButton variant="outline" />

// Delete button 
<MohsinDeleteButton variant="filled" />
```

### Interactive Buttons

```jsx
// Like button with counter
const [isLiked, setIsLiked] = useState(false);
const [likeCount, setLikeCount] = useState(42);

const handleLike = () => {
  setIsLiked(!isLiked);
  setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
};

<MohsinLikeButton 
  isLiked={isLiked} 
  count={likeCount} 
  onClick={handleLike} 
/>

// Bookmark button
const [isBookmarked, setIsBookmarked] = useState(false);

<MohsinBookmarkButton 
  isBookmarked={isBookmarked} 
  onClick={() => setIsBookmarked(!isBookmarked)} 
/>
```

## Available Button Components

### Base Button

- `MohsinButton` - The core button component with all customization options

### Action Buttons

- `MohsinDownloadButton` - Green button with download icon (pulse animation)
- `MohsinLearnMoreButton` - Blue button with help circle icon (scale animation)
- `MohsinStartOverButton` - Yellow button with rotate icon (rotate animation)
- `MohsinDeleteButton` - Red button with trash icon (scale animation)
- `MohsinOpenButton` - Blue button with external link icon (pulse animation)
- `MohsinCancelButton` - Gray button (pulse animation)
- `MohsinEditButton` - Blue button with edit icon (bounce animation)
- `MohsinLikeButton` - Like button with counter (scale animation)
- `MohsinBookmarkButton` - Bookmark button (bounce animation)
- `MohsinShareButton` - Share button (pulse animation)

## Customization Options

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outline'` | `'outline'` | Button style variant |
| `color` | `'primary' \| 'secondary' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'primary'` | Button color theme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `icon` | `LucideIcon` | - | Icon component from lucide-react |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of the icon |
| `isLoading` | `boolean` | `false` | Whether the button is in loading state |
| `loadingText` | `string` | - | Text to display during loading |
| `animation` | `'bounce' \| 'pulse' \| 'rotate' \| 'scale' \| 'none'` | `'none'` | Animation to play on click |
| `className` | `string` | - | Additional CSS classes |

### Special Button Props

#### MohsinLikeButton

```tsx
type LikeButtonProps = ActionButtonBaseProps & {
  count?: number;     // Number of likes to display
  isLiked?: boolean;  // Whether the current user has liked
};
```

#### MohsinBookmarkButton

```tsx
type BookmarkButtonProps = ActionButtonBaseProps & {
  isBookmarked?: boolean;  // Whether the current user has bookmarked
};
```

## Implementation in a Blog Post

Here's how to implement the buttons for blog post actions:

```jsx
import { 
  MohsinEditButton, 
  MohsinDeleteButton, 
  MohsinLikeButton, 
  MohsinBookmarkButton, 
  MohsinShareButton 
} from '@/components/ui';

// Inside your component
return (
  <div className="blog-actions">
    {/* Admin actions */}
    {isAuthor && (
      <>
        <MohsinEditButton 
          size="sm"
          variant="outline"
          onClick={handleEdit}
        />
        
        <MohsinDeleteButton 
          size="sm"
          variant="outline"
          onClick={handleDeleteClick}
        />
      </>
    )}
    
    {/* User actions */}
    <MohsinLikeButton 
      size="sm"
      count={likeCount} 
      isLiked={isLiked}
      onClick={handleLike}
    />
    
    <MohsinBookmarkButton 
      size="sm"
      isBookmarked={isBookmarked}
      onClick={handleBookmark}
    >
      {isBookmarked ? 'Saved' : 'Save'}
    </MohsinBookmarkButton>
    
    <MohsinShareButton 
      size="sm"
      variant="outline"
      onClick={handleShare}
    />
  </div>
);
```

## Styling

The buttons use CSS modules for styling. You can customize the appearance by modifying the `MohsinButton.module.scss` file. The key style variables are:

```scss
.primary {
  --bg-color: #4CAF50;
  --text-color: white;
  --border-color: #4CAF50;
  --hover-bg: #3b8a3f;
  --hover-border: #3b8a3f;
  --hover-text: white;
  --ripple-color: rgba(255, 255, 255, 0.4);
}
```

Adjust these variables for each color variant to match your application's theme.

## Accessibility

All buttons are built with accessibility in mind:
- Proper focus states
- Support for `disabled` state
- Loading indicators to prevent multiple submissions
- Semantic HTML elements

## Advanced Usage

### Custom Animations

You can modify the animation timing and properties in the `MohsinButton.tsx` file:

```jsx
const buttonAnimation = {
  bounce: {
    y: [0, -4, 0],
    transition: { 
      duration: 0.5,
      times: [0, 0.5, 1],
      repeat: 0
    }
  },
  // Add or modify other animations
};
```

### Creating Custom Action Buttons

You can create new button variants following this pattern:

```jsx
export const MyCustomButton: React.FC<ActionButtonBaseProps> = ({ 
  children = 'Custom Action', 
  ...props 
}) => (
  <MohsinButton 
    icon={MyIcon} 
    iconPosition="left" 
    color="primary" 
    animation="pulse"
    {...props}
  >
    {children}
  </MohsinButton>
);
```

## License

MIT