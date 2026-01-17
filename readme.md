# AXTRACE Knowledge Base

Личная база знаний на базе [Diplodoc](https://diplodoc.com/).

## Структура

- `docs/` - исходные markdown файлы документации
- `docs-html/` - сгенерированные HTML файлы (не коммитятся в git)
- `scripts/` - скрипты для пост-обработки (инжекция Metrika, создание редиректов)
- `.yfm` - конфигурационный файл Diplodoc

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

Сборка выполняется через Diplodoc CLI и включает:
1. Компиляцию markdown в HTML через `yfm build`
2. Инжекцию Yandex.Metrika во все страницы
3. Создание редиректов для старых URL

## Деплой

Деплой происходит автоматически через GitHub Actions при пуше в ветку `main`.

Используется официальный action от Diplodoc: `diplodoc-platform/docs-build-static-action@v1`

Настройка GitHub Pages:
1. Settings → Pages
2. Source: GitHub Actions
3. После первого деплоя сайт будет доступен на `https://axtrace.github.io`


## Структура документации

- `/books` - список прочитанных книг
- `/courses` - пройденные курсы
- `/health` - медицинские знания
- `/parfenon` - вина из Парфенона
- `/zakladka` - книги из программы "Закладка"
- `/yetnopozner_books` - книги из выпусков #ещенепознер
- `/notes` - разные заметки
- `/anecdots` - анекдоты
