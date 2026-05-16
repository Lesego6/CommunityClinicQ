# CommunityClinicQ UI Component Library

A comprehensive, reusable React Native component library built for the CommunityClinicQ mobile app. All components follow the app's design system, support TypeScript, accessibility, and are fully themeable.

## 📦 Components Overview

### Base Components

#### **Button**
Primary component for user interactions.

**Props:**
- `label` (string) - Button text
- `variant` ("primary" | "secondary" | "outline" | "ghost" | "danger") - Style variant
- `size` ("sm" | "md" | "lg") - Button size
- `disabled` (boolean) - Disable button
- `loading` (boolean) - Show loading state
- `fullWidth` (boolean) - Stretch to full width
- `leftIcon` / `rightIcon` (ReactNode) - Icons on sides
- `onPress` (function) - Click handler

**Usage:**
```tsx
import { Button } from '@/components/ui';

<Button
  label="Join Queue"
  variant="primary"
  size="lg"
  fullWidth
  onPress={() => handleJoin()}
/>
```

---

#### **Card**
Container component for grouping content.

**Props:**
- `children` (ReactNode) - Card content
- `variant` ("elevated" | "outlined" | "flat") - Visual style
- `padded` (boolean) - Add default padding
- `padding` (number) - Custom padding
- `style` (ViewStyle) - Custom styles

**Usage:**
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated">
  <Text>Your content here</Text>
</Card>
```

---

#### **Divider**
Horizontal or vertical line separator.

**Props:**
- `orientation` ("horizontal" | "vertical")
- `color` (string)
- `thickness` (number)
- `margin` (number)

**Usage:**
```tsx
import { Divider, Spacer } from '@/components/ui';

<Divider margin={16} />
<Spacer size={12} />
```

---

### Form Components

#### **TextInput**
Text input field with label, validation, and icons.

**Props:**
- `label` (string) - Input label
- `placeholder` (string)
- `helperText` (string) - Helper message
- `error` (string) - Error message
- `leftIcon` / `rightIcon` (ReactNode)
- `required` (boolean)
- `size` ("sm" | "md" | "lg")

**Usage:**
```tsx
import { TextInput, PersonIcon } from '@/components/ui';

<TextInput
  label="Full Name"
  placeholder="Enter your name"
  leftIcon={<PersonIcon size={16} />}
  error={validationError}
  required
/>
```

---

#### **Checkbox**
Selectable checkbox with label.

**Props:**
- `checked` (boolean)
- `onToggle` (function)
- `label` (string)
- `helperText` (string)
- `disabled` (boolean)
- `size` ("sm" | "md" | "lg")

**Usage:**
```tsx
import { Checkbox } from '@/components/ui';

const [agreed, setAgreed] = useState(false);

<Checkbox
  label="I agree to terms"
  checked={agreed}
  onToggle={setAgreed}
/>
```

---

#### **Radio**
Single-select radio button.

**Props:**
- `selected` (boolean)
- `onSelect` (function)
- `label` (string)
- `helperText` (string)
- `disabled` (boolean)
- `size` ("sm" | "md" | "lg")

**Usage:**
```tsx
import { Radio } from '@/components/ui';

<Radio
  label="Option 1"
  selected={activeOption === 1}
  onSelect={() => setActiveOption(1)}
/>
```

---

#### **Select**
Dropdown/picker component with modal.

**Props:**
- `label` (string)
- `placeholder` (string)
- `options` (SelectOption[])
  - `value` (string | number)
  - `label` (string)
  - `description` (string, optional)
- `value` (string | number)
- `onChange` (function)
- `error` (string)
- `helperText` (string)
- `disabled` (boolean)
- `required` (boolean)

**Usage:**
```tsx
import { Select } from '@/components/ui';

const [serviceType, setServiceType] = useState("");

<Select
  label="Service Type"
  placeholder="Choose service"
  options={[
    { value: "general", label: "General Consultation", description: "Basic check-up" },
    { value: "chronic", label: "Chronic Care", description: "Long-term management" },
  ]}
  value={serviceType}
  onChange={setServiceType}
/>
```

---

#### **Tag**
Removable label/chip component.

**Props:**
- `label` (string)
- `variant` ("filled" | "outlined")
- `color` ("primary" | "secondary" | "success" | "warning" | "danger")
- `removable` (boolean)
- `onRemove` (function)
- `size` ("sm" | "md")
- `leftIcon` (ReactNode)

**Usage:**
```tsx
import { Tag } from '@/components/ui';

<Tag
  label="Clinic"
  removable
  onRemove={() => removeFilter()}
/>
```

---

### Feedback Components

#### **Badge**
Status/label badge.

**Props:**
- `label` (string)
- `variant` ("primary" | "secondary" | "success" | "warning" | "danger" | "info")
- `size` ("sm" | "md" | "lg")
- `dot` (boolean) - Show indicator dot

**Usage:**
```tsx
import { Badge } from '@/components/ui';

<Badge label="In Queue" variant="success" dot />
```

---

#### **Alert**
Notification/message alert box.

**Props:**
- `title` (string, optional)
- `message` (string)
- `variant` ("info" | "success" | "warning" | "error")
- `icon` (ReactNode)
- `onClose` (function)

**Usage:**
```tsx
import { Alert, BellIcon } from '@/components/ui';

<Alert
  title="Confirmed!"
  message="You've been added to the queue"
  variant="success"
  icon={<BellIcon size={20} />}
/>
```

---

### Layout Components

#### **Spacer**
Create consistent spacing.

**Props:**
- `size` (number) - Default space
- `height` / `width` (number)

**Usage:**
```tsx
import { Spacer } from '@/components/ui';

<Spacer size={16} />  {/* 16px vertical space */}
<Spacer height={20} width={10} />
```

---

#### **Loading**
Loading spinner indicator.

**Props:**
- `size` ("sm" | "md" | "lg")
- `color` (string)

**Usage:**
```tsx
import { Loading } from '@/components/ui';

{isLoading && <Loading size="md" color={Colors.primary} />}
```

---

### Icon Components

All icons are available from `@/components/ui`:

```tsx
import {
  BellIcon,
  SearchIcon,
  LocationIcon,
  CalendarIcon,
  PersonIcon,
  // ... 20+ more icons
} from '@/components/ui';

<Button
  label="Search"
  leftIcon={<SearchIcon size={18} color="white" />}
/>
```

---

## 🎨 Theming

All components use the color system defined in `constants/colors.ts`:

```tsx
export const Colors = {
  primary: "#1B6B3A",
  secondary: "#E8821A",
  danger: "#DC2626",
  success: "#16A34A",
  // ... more colors
};
```

Customize colors globally by modifying `Colors`, or override individual component styles with the `style` prop.

---

## 📱 Responsive Design

Components automatically adapt to screen size:
- Touch targets are at least 44x44pt (accessibility)
- Font sizes scale appropriately
- Spacing respects device size

---

## ♿ Accessibility

All components include:
- `accessibilityRole` and `accessibilityLabel`
- `accessibilityState` for disabled/busy states
- `accessibilityHint` for additional context
- Keyboard navigation support
- Screen reader friendly

---

## 🚀 Best Practices

### 1. Import from index for clean imports
```tsx
// ✅ Good
import { Button, Card, TextInput } from '@/components/ui';

// ❌ Avoid
import Button from '@/components/ui/Button';
```

### 2. Use TypeScript for prop validation
```tsx
import { Button, type ButtonVariant } from '@/components/ui';

const variant: ButtonVariant = 'primary'; // Type-safe
```

### 3. Combine components for complex layouts
```tsx
<Card>
  <TextInput label="Name" />
  <Spacer size={12} />
  <Select label="Service" options={services} />
  <Spacer size={16} />
  <Button label="Continue" fullWidth />
</Card>
```

### 4. Use consistent spacing
```tsx
import { Spacer } from '@/components/ui';

// Spacing sizes: 4, 8, 12, 16, 20, 24, 32, 40
<Spacer size={16} />
```

---

## 📋 Component Checklist

- [x] Button (4 variants, 3 sizes)
- [x] Card (3 variants)
- [x] TextInput (with validation)
- [x] Checkbox
- [x] Radio
- [x] Select (dropdown with modal)
- [x] Tag/Chip
- [x] Badge (6 variants)
- [x] Alert (4 types)
- [x] Divider
- [x] Spacer
- [x] Loading Spinner
- [x] 25+ Icons

---

## 🔗 Usage Example File

See `EXAMPLES.tsx` for complete working examples of all components and common patterns.

---

## 💡 Tips

1. **Form Validation**: Use the `error` prop to display validation messages
2. **Loading States**: Use `loading` prop on buttons during async operations
3. **Icons**: Combine with components for better UX
4. **Accessibility**: Always provide `label` for form inputs
5. **Performance**: Memoize component lists for better performance

---

Generated for CommunityClinicQ v1.0.0
