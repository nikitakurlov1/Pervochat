# Quick Start Guide

## Быстрый запуск за 3 шага

### 1. Установка
```bash
npm install
```

### 2. Настройка базы данных
```bash
npm run prisma:generate
npm run prisma:migrate
mkdir uploads
```

### 3. Запуск
```bash
npm run dev
```

Откройте http://localhost:3000 в браузере.

## Первый запуск

1. Зарегистрируйте аккаунт
2. Создайте первый пост
3. Попробуйте добавить фото или опрос
4. Поставьте лайк и напишите комментарий

## Структура команд

### Разработка
- `npm run dev` - Запуск frontend + backend одновременно
- `npm run client` - Только frontend (Vite)
- `npm run server` - Только backend (Express)

### База данных
- `npm run prisma:generate` - Генерация Prisma Client
- `npm run prisma:migrate` - Применение миграций
- `npx prisma studio` - Открыть Prisma Studio (GUI для БД)

### Сборка
- `npm run build` - Production сборка

## Порты

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Uploads: http://localhost:3001/uploads/

## Тестовые данные

Для тестирования создайте несколько аккаунтов:
- test1@test.com / password123
- test2@test.com / password123

## Возможные проблемы

### Порт занят
```bash
# Найти процесс на порту 3001
lsof -ti:3001

# Убить процесс
kill -9 <PID>
```

### База данных не создается
```bash
# Удалить старую БД и пересоздать
rm prisma/dev.db
npm run prisma:migrate
```

### Ошибка при загрузке изображений
```bash
# Проверить наличие папки uploads
mkdir -p uploads
chmod 755 uploads
```

## Полезные ссылки

- [Prisma Docs](https://www.prisma.io/docs)
- [Lucide Icons](https://lucide.dev/)
- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
