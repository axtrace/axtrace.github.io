const fs = require('fs');
const path = require('path');
const glob = require('glob');
const {parse, serialize} = require('parse5');
const utils = require('parse5-utils');

const metrikaScript = `<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(54428956, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>`;

const metrikaNoscript = `<noscript><div><img src="https://mc.yandex.ru/watch/54428956" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`;

function injectMetrika(html) {
  // Проверяем, не добавлен ли уже код Metrika
  if (html.includes('yandex.ru/metrika') || html.includes('ym(54428956')) {
    return html;
  }
  
  const parsed = parse(html);
  
  function traverse(node) {
    if (node.nodeName === 'head') {
      // Создаем script узел для Metrika
      const scriptNode = utils.createNode('script');
      utils.setAttribute(scriptNode, 'type', 'text/javascript');
      const scriptContent = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");ym(54428956, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`;
      const scriptText = utils.createTextNode(scriptContent);
      utils.append(scriptNode, scriptText);
      utils.append(node, scriptNode);
    }
    
    if (node.nodeName === 'body') {
      // Добавляем noscript в начало body
      const noscript = utils.createNode('noscript');
      const div = utils.createNode('div');
      const img = utils.createNode('img');
      utils.setAttribute(img, 'src', 'https://mc.yandex.ru/watch/54428956');
      utils.setAttribute(img, 'style', 'position:absolute; left:-9999px;');
      utils.setAttribute(img, 'alt', '');
      utils.append(div, img);
      utils.append(noscript, div);
      // Вставляем в начало body
      if (node.childNodes && node.childNodes.length > 0) {
        node.childNodes.unshift(noscript);
      } else {
        utils.append(node, noscript);
      }
    }
    
    if (node.childNodes) {
      node.childNodes.forEach(child => traverse(child));
    }
  }
  
  traverse(parsed);
  
  return serialize(parsed);
}

// Инжектируем Metrika во все HTML файлы
const outputDir = 'docs-html';
const pattern = path.join(outputDir, '**', '*.html');
const htmlFiles = glob.globSync(pattern, {ignore: 'node_modules/**'});

htmlFiles.forEach(filePath => {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Проверяем, не добавлен ли уже код Metrika
    if (html.includes('yandex.ru/metrika')) {
      console.log(`Metrika already present in ${filePath}`);
      return;
    }
    
    const transformed = injectMetrika(html);
    fs.writeFileSync(filePath, transformed, {encoding: 'utf8'});
    console.log(`Injected Metrika into ${filePath}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
});

console.log('Metrika injection completed!');

