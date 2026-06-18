# LumenBridge Finance

LumenBridge Finance - учебный fullstack MVP сервиса краткосрочного кредитования.
В репозитории есть:

- публичный сайт с кредитным калькулятором;
- личный кабинет клиента с OTP-входом, подписанием займа и графиком платежей;
- административная панель для операторов и администраторов;
- backend API на NestJS;
- PostgreSQL через Prisma.

Важно: это учебный проект. SMS, платежи и часть бизнес-процессов работают в mock-режиме.

## Что нужно для запуска

Минимально:

- Git
- Docker Engine / Docker Desktop
- Docker Compose v2
- Node.js
- npm

Проверенные версии:

- Node.js: 20+ или 24+
- npm: ставится вместе с Node.js
- Docker Compose: `docker compose` (не старый `docker-compose`)

Если система совсем пустая, сначала установите инструменты ниже, затем переходите к разделу `Запуск проекта`.

## 1. Подготовка системы с нуля

### Windows 10/11

1. Установите Git:
   - https://git-scm.com/download/win
2. Установите Node.js LTS:
   - https://nodejs.org/en/download
   - достаточно стандартного установщика `.msi`
3. Установите Docker Desktop:
   - https://www.docker.com/products/docker-desktop/
4. Перезагрузите систему, если установщик Docker или WSL этого попросит.
5. Откройте PowerShell и проверьте:

```bash
git --version
node -v
npm -v
docker --version
docker compose version
```

### macOS

1. Установите Git:
   - либо через Xcode Command Line Tools: `xcode-select --install`
   - либо через Homebrew: `brew install git`
2. Установите Node.js LTS:
   - через официальный pkg: https://nodejs.org/en/download
   - или через Homebrew: `brew install node`
3. Установите Docker Desktop:
   - https://www.docker.com/products/docker-desktop/
4. Проверьте версии:

```bash
git --version
node -v
npm -v
docker --version
docker compose version
```

### Ubuntu / Debian

#### Git и базовые пакеты

```bash
sudo apt update
sudo apt install -y git curl ca-certificates gnupg
```

#### Node.js LTS

Самый простой и безопасный путь для локальной разработки - через NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Проверка:

```bash
node -v
npm -v
```

#### Docker Engine + Docker Compose plugin

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu   $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Чтобы запускать Docker без `sudo`:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Проверка:

```bash
docker --version
docker compose version
```

## 2. Клонирование репозитория

```bash
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
cd lumen-bridge-finance
```

Если репозиторий уже на машине, просто перейдите в его каталог.

## 3. Структура проекта

```text
frontend/            Next.js приложение
backend/             NestJS API + Prisma
backend/prisma/      схема БД и миграции
docker-compose.yml   локальный PostgreSQL
AGENTS.md            зафиксированные правила проекта
TASK.md              рабочее задание
```

## 4. Запуск проекта

Ниже - полный путь от пустой БД до работающего интерфейса.

### Шаг 1. Поднять PostgreSQL через Docker Compose

Из корня проекта:

```bash
docker compose up -d
```

Проверить, что контейнер запущен:

```bash
docker compose ps
```

Ожидаемый контейнер: `lumenbridge-postgres`.

Остановить БД:

```bash
docker compose down
```

Полностью удалить БД вместе с данными:

```bash
docker compose down -v
```

### Шаг 2. Настроить backend

Перейдите в каталог backend:

```bash
cd backend
```

Создайте `.env`:

```bash
cp .env.example .env
```

Текущий рабочий `.env` для локального запуска:

```env
DATABASE_URL=postgresql://lumenuser:lumenpass@localhost:5432/lumenbridge
JWT_SECRET=учебный-секрет-не-для-прода
ADMIN_SEED_PASSWORD=admin123
OPERATOR_SEED_PASSWORD=operator123
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Установите зависимости и подготовьте БД:

```bash
npm install
npm run db:migrate
npm run db:seed
```

Запустите backend:

```bash
npm run start:dev
```

Backend будет доступен по адресу:

```text
http://localhost:3001/api
```

### Шаг 3. Настроить frontend

Откройте второй терминал и перейдите в каталог frontend:

```bash
cd frontend
```

Создайте `.env.local`:

```bash
cp .env.local.example .env.local
```

Содержимое:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Установите зависимости и запустите frontend:

```bash
npm install
npm run dev
```

Frontend будет доступен по адресу:

```text
http://localhost:3000
```

## 5. Что должно работать после запуска

Если всё поднялось корректно:

- главная страница: `http://localhost:3000`
- форма заявки: `http://localhost:3000/apply`
- контакты: `http://localhost:3000/contacts`
- вход клиента: `http://localhost:3000/login`
- вход персонала: `http://localhost:3000/admin/login`
- backend API: `http://localhost:3001/api`

## 6. Формула кредитного калькулятора

В проекте используется аннуитетная формула расчёта платежа:

```text
A = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
Total = A * n
```

Где:

- `P` - сумма займа
- `r` - дневная процентная ставка
- `n` - срок займа в днях
- `A` - ежедневный платёж
- `Total` - итоговая сумма к возврату

Для personal-flow в текущем MVP используется ставка `0.008`, то есть `0.8%` в день.

Пример:

```text
P = 5 000 EUR
r = 0.008
n = 14 дней
```

При таких параметрах калькулятор покажет ежедневный платёж около `378.94 EUR`, а итоговую сумму к возврату около `5 305.18 EUR`.

## 7. Тестовые учётные данные

### Админ-панель

Создаются через `npm run db:seed`.

- `admin` / `admin123`
- `operator` / `operator123`

Вход: `http://localhost:3000/admin/login`

### Клиентский вход

Реальной SMS нет. Используется mock OTP-flow:

1. Откройте `http://localhost:3000/login`
2. Введите любой телефон в формате E.164, например `+35312345678`
3. Backend вернёт тестовый OTP-код
4. Код отображается в интерфейсе учебным баннером
5. После подтверждения откроется личный кабинет

Та же схема используется для подписания займа.

## 8. Бизнес-ветка в текущем MVP

Сейчас бизнес-заявки не создают реальный займ в системе.

Что работает:

- форма для бизнеса доступна на `/apply`;
- заявка для бизнеса уходит в mock feedback flow;
- запрос принимается как обращение через `/contact-requests`.

Что не работает намеренно:

- отдельный онлайн-кабинет для бизнеса;
- полный жизненный цикл бизнес-займа.

## 9. Полезные команды

### Docker

```bash
docker compose up -d
docker compose ps
docker compose down
docker compose down -v
```

### Backend

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
npm run build
npm test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
```

## 10. Частые проблемы

### `docker: command not found`
Docker не установлен или не добавлен в PATH.

### `docker compose` не работает
Установлен старый Docker без Compose plugin. Нужен именно `docker compose version`.

### `P1001: Can't reach database server`
PostgreSQL не поднят. Выполните:

```bash
docker compose up -d
docker compose ps
```

### `EADDRINUSE: address already in use :::3000` или `:::3001`
Порт уже занят другим процессом. Освободите порт или поменяйте его в `.env` / `.env.local`.

### Frontend не видит backend
Проверьте:

- backend реально запущен;
- `frontend/.env.local` содержит `NEXT_PUBLIC_API_URL=http://localhost:3001`;
- `backend/.env` содержит `FRONTEND_URL=http://localhost:3000`.

### Не получается войти в админку
Скорее всего не выполнен сид:

```bash
cd backend
npm run db:seed
```

## 11. Проверка production-сборки локально

Backend:

```bash
cd backend
npm run build
npm run start
```

Frontend:

```bash
cd frontend
npm run build
npm start
```

## 12. Кратко про стек

- Frontend: Next.js 14, TypeScript, React Hook Form, Valibot
- Backend: NestJS, TypeScript
- База данных: PostgreSQL 16
- ORM: Prisma
- Авторизация: JWT, mock OTP

## 13. Важно про данные

Для локальной разработки база данных хранится в Docker volume `postgres_data`.
Если вы хотите полностью обнулить состояние проекта, выполните:

```bash
docker compose down -v
```

После этого заново:

```bash
docker compose up -d
cd backend
npm run db:migrate
npm run db:seed
```
