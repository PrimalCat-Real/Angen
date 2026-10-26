# Angen

Стартовый проект расширения для Chromium: Vue 3, TypeScript, WXT и Manifest V3.
Основа: официальный Vue-шаблон https://wxt.dev/guide/installation

## Быстрый старт

Требуется Node.js 22.12+ и npm.

```sh
npm install
npm run dev
```

WXT откроет Chrome с расширением и будет обновлять его при изменениях кода.
Для ручной загрузки в Chrome/Edge/Brave открой страницу расширений,
включи режим разработчика и выбери «Загрузить распакованное расширение»:
.output/chrome-mv3-dev для dev-сервера или .output/chrome-mv3 после сборки.
Dev-папка работает вместе с запущенным npm run dev.

## Команды

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Разработка в Chrome с горячим обновлением |
| `npm run compile` | Проверка типов TypeScript и Vue |
| `npm run build` | Production-сборка в .output/chrome-mv3 |
| `npm run zip` | ZIP-архив расширения в .output |

## Структура

- `entrypoints/popup/App.vue` — интерфейс по клику на иконку.
- `entrypoints/popup/style.css` — стили popup.
- `entrypoints/background.ts` — фоновый service worker.
- `wxt.config.ts` — имя, Manifest V3, разрешения и настройки сборки.
- `public/icon/` — иконки расширения.

manifest.json генерируется WXT автоматически. Меняй поле manifest в wxt.config.ts.
Демонстрационный счётчик сбрасывается при закрытии popup.
Доступ к сайтам и дополнительные разрешения не запрашиваются.
Когда понадобится работа со страницами, добавь entrypoints/content.ts
через defineContentScript и укажи нужные сайты в matches.

После клонирования используй `npm ci` для установки версий из lock-файла.

## Зависимости

При установке npm audit сообщил о четырёх high-записях в одной цепочке
WXT → web-ext → adbkit → node-forge (GHSA-86w9-cpqp-85rv).
Это инструменты разработки; в production-бандл расширения они не входят.
Не применяй автоматически npm audit fix --force: предложенное исправление
понижает WXT/web-ext до других версий. Проверяй обновления инструментов отдельно.
