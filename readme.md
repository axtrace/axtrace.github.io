# AXTRACE Knowledge Base

Личная база знаний на базе [Diplodoc](https://github.com/diplodoc-platform/documentation-template).

## Структура

- `docs/` - исходные markdown файлы документации
- `docs-html/` - сгенерированные HTML файлы (не коммитятся в git)
- `scripts/` - скрипты для сборки, инжекции Metrika и создания редиректов

## Разработка

### Локальная разработка

```bash
# Установить зависимости
npm install

# Запустить dev сервер с hot reload
npm start
```

Сервер будет доступен на `http://0.0.0.0:8000`

### Сборка

```bash
npm run build
```

Это создаст HTML файлы в `docs-html/` и:
- Инжектирует Yandex.Metrika во все страницы
- Создаст редиректы для старых URL

## Деплой

Деплой происходит автоматически через GitHub Actions при пуше в ветку `main`.

Также можно настроить GitHub Pages вручную:
1. Settings → Pages
2. Source: GitHub Actions
3. После первого деплоя сайт будет доступен на `https://axtrace.github.io`

## Редиректы

Старые URL автоматически перенаправляются на новые через HTML редиректы:
- `/books.html` → `/books/`
- `/courses.html` → `/courses/`
- `/health.html` → `/health/`
- и т.д.

Редиректы создаются автоматически при сборке через `scripts/create-redirects.js`

## Структура документации

- `/books` - список прочитанных книг
- `/courses` - пройденные курсы
- `/health` - медицинские знания
- `/parfenon` - вина из Парфенона
- `/zakladka` - книги из программы "Закладка"
- `/yetnopozner_books` - книги из выпусков #ещенепознер
- `/notes` - разные заметки
- `/anecdots` - анекдоты
