const fs = require('fs');
const path = require('path');

// Находим все markdown файлы
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== '_images' && !file.startsWith('.')) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Обновляем ссылки на изображения в файле
function updateImageLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Получаем относительный путь от docs/
  const relativePath = path.relative('docs', filePath);
  const fileDir = path.dirname(relativePath);
  
  // Паттерн для поиска всех изображений: ![alt](path) или ![](path)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/gi;
  
  content = content.replace(imagePattern, (match, altText, imagePath) => {
    // Проверяем, является ли это изображением по расширению
    const imageExt = /\.(png|jpg|jpeg|gif|svg|pdf)(\?.*)?$/i;
    if (!imageExt.test(imagePath)) {
      return match; // Не изображение, пропускаем
    }
    
    // Если путь уже начинается с _images, пропускаем
    if (imagePath.startsWith('_images/') || imagePath.startsWith('/_images/')) {
      return match;
    }
    
    // Убираем query параметры и якоря
    const cleanPath = imagePath.split('?')[0].split('#')[0];
    
    // Если путь абсолютный (начинается с /), убираем первый слэш
    let cleanImagePath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
    
    // Определяем новый путь в _images
    // Строим путь: _images + текущая директория файла + путь к изображению
    let newPath;
    if (cleanImagePath.includes('/')) {
      // Путь уже содержит подпапки (например, img/photo.jpg или flu_img/photo.png)
      newPath = path.join('_images', fileDir, cleanImagePath).replace(/\\/g, '/');
    } else {
      // Просто имя файла (например, photo.jpg) - ищем в текущей директории
      newPath = path.join('_images', fileDir, cleanImagePath).replace(/\\/g, '/');
    }
    
    // Проверяем, существует ли файл по новому пути
    const fullNewPath = path.join('docs', newPath);
    if (fs.existsSync(fullNewPath)) {
      changed = true;
      return `![${altText}](${newPath})`;
    } else {
      // Если файл не найден, пытаемся найти его в других местах
      const imageName = path.basename(cleanImagePath);
      const searchDirs = [
        path.join('_images', fileDir),
        path.join('_images', path.dirname(fileDir)),
        '_images'
      ];
      
      for (const searchDir of searchDirs) {
        const searchPath = path.join('docs', searchDir);
        if (fs.existsSync(searchPath)) {
          const found = findImageInDir(searchPath, imageName);
          if (found) {
            const relPath = path.relative('docs', found).replace(/\\/g, '/');
            changed = true;
            return `![${altText}](${relPath})`;
          }
        }
      }
      
      console.warn(`Warning: Image not found for ${cleanImagePath} in ${filePath}`);
      return match;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Рекурсивно ищем изображение в директории
function findImageInDir(dir, imageName) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const found = findImageInDir(filePath, imageName);
      if (found) return found;
    } else if (file === imageName) {
      return filePath;
    }
  }
  
  return null;
}

// Обрабатываем все markdown файлы
const mdFiles = findMarkdownFiles('docs');
let updatedCount = 0;

mdFiles.forEach(file => {
  if (updateImageLinks(file)) {
    updatedCount++;
  }
});

console.log(`\nTotal files updated: ${updatedCount} out of ${mdFiles.length}`);

