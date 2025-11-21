# Design System - School Messenger

## Цветовая палитра

### Основные цвета
- **Primary:** `#6366f1` (Индиго)
- **Secondary:** `#8b5cf6` (Фиолетовый)
- **Gradient:** `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`

### Нейтральные цвета
- **Text Primary:** `#1c1e21` (Темный)
- **Text Secondary:** `#65676b` (Серый)
- **Background:** `#f0f2f5` (Светло-серый)
- **Border:** `#e4e6eb` (Светлая граница)
- **White:** `#ffffff`

### Акцентные цвета
- **Error:** `#ef4444` (Красный)
- **Success:** `#10b981` (Зеленый)

## Типографика

### Шрифты
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', sans-serif;
```

### Размеры
- **H1:** 32px, font-weight: 700
- **H2:** 24px, font-weight: 700
- **H3:** 18px, font-weight: 700
- **Body:** 15px, font-weight: 400
- **Small:** 13-14px, font-weight: 400-500
- **Tiny:** 11-12px, font-weight: 500

## Скругления (Border Radius)

- **Small:** 8px
- **Medium:** 12px
- **Large:** 16px
- **XLarge:** 20px
- **Circle:** 50%
- **Pill:** 24px (для кнопок и инпутов)

## Тени (Box Shadow)

### Карточки
```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
border: 1px solid #e4e6eb;
```

### Кнопки (Primary)
```css
box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
```

### Модальные окна
```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
```

## Отступы (Spacing)

- **XS:** 4px
- **S:** 8px
- **M:** 12px
- **L:** 16px
- **XL:** 20px
- **XXL:** 24px
- **XXXL:** 32px

## Компоненты

### Кнопки

#### Primary Button
```css
padding: 16px;
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
color: white;
border-radius: 12px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
```

#### Secondary Button
```css
padding: 12px 20px;
background: #f0f2f5;
color: #65676b;
border-radius: 12px;
font-weight: 500;
```

### Input Fields
```css
padding: 16px;
background: #f0f2f5;
border: 2px solid transparent;
border-radius: 12px;
font-size: 16px;
transition: all 0.2s ease;
```

#### Focus State
```css
background: white;
border-color: #6366f1;
box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
```

### Карточки постов
```css
background: white;
border-radius: 16px;
padding: 20px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
border: 1px solid #e4e6eb;
```

### Аватары
```css
width: 40px;
height: 40px;
border-radius: 50%;
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
color: white;
font-weight: 600;
```

## Иконки

### Библиотека
Lucide React - https://lucide.dev/

### Размеры
- **Small:** 16px
- **Medium:** 20px
- **Large:** 24px

### Основные иконки
- Home (Лента)
- PlusSquare (Создать)
- User (Профиль)
- Heart (Лайк)
- MessageCircle (Комментарии)
- Image (Фото)
- BarChart3 (Опрос)
- Trash2 (Удалить)
- X (Закрыть)
- Send (Отправить)
- LogOut (Выйти)

## Анимации

### Transitions
```css
transition: all 0.2s ease;
```

### Hover эффекты
```css
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: scale(0.98);
}
```

### Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Slide Up (Bottom Sheet)
```css
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

## Адаптивность

### Breakpoints
- **Mobile:** < 768px
- **Desktop:** >= 768px

### Desktop стили
```css
@media (min-width: 768px) {
  body {
    background: #e4e6eb;
  }
  
  .app {
    max-width: 500px;
    margin: 20px auto;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}
```

## Backdrop Effects

### Overlay
```css
background: rgba(0, 0, 0, 0.6);
backdrop-filter: blur(4px);
```

## Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}
```
