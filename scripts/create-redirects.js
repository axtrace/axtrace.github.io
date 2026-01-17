const fs = require('fs');
const path = require('path');

// Маппинг старых путей на новые
const redirects = {
  // Главные разделы
  'books.html': '/books/',
  'books/index.html': '/books/',
  'courses.html': '/courses/',
  'courses/index.html': '/courses/',
  'health.html': '/health/',
  'health/index.html': '/health/',
  'parfenon.html': '/parfenon/',
  'parfenon/index.html': '/parfenon/',
  'zakladka.html': '/zakladka/',
  'zakladka/index.html': '/zakladka/',
  'yetnopozner_books.html': '/yetnopozner_books/',
  'yetnopozner_books/index.html': '/yetnopozner_books/',
  'notes.html': '/notes/',
  'notes/index.html': '/notes/',
  'anecdots.html': '/anecdots/',
  'anecdots/index.html': '/anecdots/',
  
  // Медицинские разделы
  'health/celiac.html': '/health/celiac/',
  'health/celiac/index.html': '/health/celiac/',
  'health/celiac/diagnostic.html': '/health/celiac/diagnostic.html',
  'health/celiac/silent_gluten.html': '/health/celiac/silent_gluten.html',
  'health/Vaccination/flu.html': '/health/Vaccination/flu.html',
};

function createRedirectHTML(targetUrl) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Перенаправление</title>
  <meta http-equiv="refresh" content="0; url=${targetUrl}">
  <link rel="canonical" href="${targetUrl}">
  <script>
    window.location.href = "${targetUrl}";
  </script>
</head>
<body>
  <p>Страница перемещена. Если перенаправление не произошло автоматически, <a href="${targetUrl}">нажмите здесь</a>.</p>
</body>
</html>`;
}

// Создаем редиректы в корне и в соответствующих папках
const outputDir = process.argv[2] || 'docs-html';

Object.entries(redirects).forEach(([oldPath, newPath]) => {
  const fullPath = path.join(outputDir, oldPath);
  const dir = path.dirname(fullPath);
  
  // Создаем директорию, если её нет
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Создаем HTML файл с редиректом
  fs.writeFileSync(fullPath, createRedirectHTML(newPath), 'utf8');
  console.log(`Created redirect: ${oldPath} -> ${newPath}`);
});

console.log('All redirects created!');

