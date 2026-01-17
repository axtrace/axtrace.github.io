const fs = require('fs');
const path = require('path');

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf'];
const imagesDir = 'docs/_images';

// Рекурсивно находим все изображения
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Пропускаем _images и другие служебные папки
      if (file !== '_images' && !file.startsWith('.')) {
        findImages(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Находим все изображения в docs
const imageFiles = findImages('docs');

// Создаем структуру папок в _images на основе исходных путей
imageFiles.forEach(filePath => {
  // Получаем относительный путь от docs/
  const relativePath = path.relative('docs', filePath);
  
  // Определяем новое местоположение в _images
  // Например: books/desc/img/photo.jpg -> _images/books/desc/img/photo.jpg
  const newPath = path.join(imagesDir, path.dirname(relativePath), path.basename(filePath));
  const newDir = path.dirname(newPath);
  
  // Создаем директорию, если её нет
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true });
  }
  
  // Копируем файл
  fs.copyFileSync(filePath, newPath);
  console.log(`Copied: ${filePath} -> ${newPath}`);
});

console.log(`\nTotal images moved: ${imageFiles.length}`);

