# LumenBridge Finance — MVP

Учебный финтех-сервис краткосрочного кредитования для физических лиц и малого
бизнеса. Fullstack MVP: публичный сайт с кредитным калькулятором, личный кабинет
клиента с подписанием займа и графиком платежей, административная панель для
операторов и администраторов.

> Это учебный проект. Реальные SMS, платежи и скоринг не используются — все
> такие операции имитируются (mock) и помечены в интерфейсе жёлтым баннером.

---

## Стек

| Слой | Технология |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript (strict), Tailwind CSS v4 |
| Формы / валидация | React Hook Form + Valibot (клиент), class-validator (сервер) |
| Архитектура фронта | Feature-Sliced Design |
| Backend | NestJS (Node.js) |
| ORM | Prisma |
| База данных | PostgreSQL 16 |
| Авторизация | JWT (клиент — телефон + OTP, персонал — login/password) |

## Структура репозитория

```
frontend/            — Next.js (публичный сайт, ЛК клиента, админ-панель)
backend/             — NestJS (REST API, Prisma-схема, миграции, сиды)
docker-compose.yml   — контейнер PostgreSQL для локальной разработки
AGENTS.md            — архитектурный закон проекта (дизайн, схема БД, API)
TASK.md              — пошаговый план реализации
```

---

## Требования

- **Node.js** >= 18 (проверено на 24.x)
- **Docker** + Docker Compose — для базы данных (либо локально установленный PostgreSQL >= 14)
- Свободные порты: **5432** (БД), **3001** (backend), **3000** (frontend)

---

## Запуск с нуля до рабочего состояния

Ниже — полная последовательность от чистого клона до работающего приложения.
Откройте **два терминала**: один для backend, второй для frontend.

### Шаг 1. Поднять базу данных (PostgreSQL в Docker)

В корне репозитория уже лежит `docker-compose.yml`, который поднимает
PostgreSQL 16 с нужными кредами (БД `lumenbridge`, пользователь `lumenuser`,
пароль `lumenpass`, порт `5432`).

```bash
# из корня проекта
docker compose up -d            # поднять контейнер в фоне
docker compose ps               # убедиться, что статус "Up"/"healthy"
```

Данные сохраняются в Docker-volume `postgres_data` и переживают перезапуск.
Остановить БД: `docker compose down`. Полностью удалить вместе с данными:
`docker compose down -v`.

> **Без Docker:** установите PostgreSQL локально, создайте БД и пользователя,
> затем пропишите свою строку подключения в `backend/.env` (см. шаг 2).
> ```sql
> CREATE USER lumenuser WITH PASSWORD 'lumenpass';
> CREATE DATABASE lumenbridge OWNER lumenuser;
> ```

### Шаг 2. Настроить и запустить backend

```bash
cd backend
cp .env.example .env            # значения уже совпадают с docker-compose
npm install
npm run db:migrate              # применить миграции Prisma к БД
npm run db:seed                 # создать тестовых admin и operator
npm run start:dev               # backend на http://localhost:3001
```

Базовый префикс API — `/api` (например, `http://localhost:3001/api/applications`).
Если порт 3001 занят — измените `PORT` в `backend/.env`.

`backend/.env` (создаётся из `.env.example`):

```bash
DATABASE_URL=postgresql://lumenuser:lumenpass@localhost:5432/lumenbridge
JWT_SECRET=change-me-in-production
ADMIN_SEED_PASSWORD=admin123
OPERATOR_SEED_PASSWORD=operator123
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Шаг 3. Настроить и запустить frontend

Во **втором терминале**:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                     # frontend на http://localhost:3000
```

`frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Шаг 4. Открыть приложение

- Публичный сайт и калькулятор: **http://localhost:3000**
- Вход клиента (OTP): **http://localhost:3000/login**
- Вход персонала: **http://localhost:3000/admin/login**

Оба сервера (backend на 3001 и frontend на 3000) должны работать одновременно:
frontend ходит в backend по `NEXT_PUBLIC_API_URL`, а backend разрешает CORS с
`FRONTEND_URL`.

### Шпаргалка команд

```bash
# БД
docker compose up -d            # поднять PostgreSQL
docker compose down             # остановить

# Backend (каталог backend/)
npm run db:migrate              # миграции
npm run db:seed                 # тестовые admin/operator
npm run start:dev               # dev-режим (watch)
npm run build && npm start      # прод-сборка

# Frontend (каталог frontend/)
npm run dev                     # dev-режим
npm run build && npm start      # прод-сборка
```

---

## Калькулятор — формула

Используется аннуитетный платёж:

```
A = P × (r × (1 + r)^n) / ((1 + r)^n − 1)
Total = A × n
```

где `P` — сумма займа, `r = 0.008` (0,8 % в день), `n` — срок в днях.
Результат пересчитывается мгновенно при движении ползунков, без задержки.

Пример: `P = 5000`, `n = 14` → ежедневный платёж ≈ `378.94`, итого ≈ `5305.18`.

---

## Mock OTP-flow и тестовые учётные данные

### Клиент — вход по телефону + OTP (mock)

Реальные SMS **не отправляются**. Flow:

1. На `/login` клиент вводит номер телефона в формате E.164 (например,
   `+35312345678`) — подойдёт любой корректный номер.
2. Backend генерирует 6-значный код и в режиме `NODE_ENV=development`
   возвращает его прямо в ответе API.
3. Код показывается в интерфейсе в **жёлтом учебном баннере**; клиент вводит
   его вручную в поле OTP.
4. После подтверждения выдаётся JWT, и клиент попадает в личный кабинет.

Тот же mock-OTP используется при **подписании займа** в ЛК: при подписании
фиксируются `signed_at`, IP и User-Agent.

> Отдельная регистрация не требуется — личный кабинет создаётся автоматически
> при первом входе или при подаче заявки с нового номера.

### Персонал — вход по логину и паролю

Тестовые учётные записи создаются командой `npm run db:seed`:

| Логин | Пароль | Роль | Возможности |
|---|---|---|---|
| `admin` | `admin123` | `admin` | Всё, что у оператора, **плюс** фиксация фактических платежей и закрытие займов |
| `operator` | `operator123` | `operator` | Заявки, смена статусов, подтверждение/отклонение заявок на оплату |

Вход для персонала — **`/admin/login`**. Пароли задаются переменными
`ADMIN_SEED_PASSWORD` / `OPERATOR_SEED_PASSWORD` в `backend/.env`.

---

## Ключевые маршруты

**Публичные:** `/` (главная + калькулятор), `/how-it-works`, `/business`,
`/faq`, `/contacts`, `/apply` (форма заявки), юридические страницы
(`/privacy`, `/cookies`, `/terms`, `/credit-policy`, `/aml-kyc`).

**Личный кабинет** (`/cabinet/*`, требует входа): `applications`, `loans`,
`loans/:id` (подписание + график + заявка на оплату), `notifications`.

**Админ-панель** (`/admin/*`, требует входа персонала): `applications`,
`clients`, `loans`, `payments`, `notifications`.

---

## Сценарий работы (end-to-end)

1. Клиент рассчитывает условия в калькуляторе и подаёт заявку (`/apply`).
2. Оператор видит заявку в админ-панели, берёт в работу и одобряет —
   автоматически создаётся займ в статусе «ожидает подписания».
3. Клиент входит в ЛК, подписывает займ через mock-OTP — фиксируются
   `signed_at`, IP и User-Agent, формируется график ежедневных платежей.
4. Клиент отправляет заявку на оплату с реквизитами.
5. Оператор подтверждает заявку; администратор фиксирует фактический платёж —
   график пересчитывается, при полном погашении займ закрывается, клиенту
   приходит уведомление.

---

## Известные ограничения (mock)

- **SMS не отправляется** — код OTP виден в интерфейсе (только в dev).
- **Реальные платежи не проводятся**; договор — учебная заглушка.
- **Скоринг не реализован** — заявки одобряются/отклоняются вручную оператором.
- Тестовые данные не содержат реальных персональных данных.
- Не подключены внешние провайдеры (SMS-шлюзы, платёжные системы, скоринг-API).

---

## Возможные проблемы

| Симптом | Решение |
|---|---|
| `P1001: Can't reach database` при `db:migrate` | БД не поднята — выполните `docker compose up -d` и дождитесь статуса healthy |
| `EADDRINUSE :3001` | Порт занят прошлым процессом: `lsof -i:3001 -t \| xargs kill -9` |
| Frontend не видит API / CORS-ошибка | Проверьте, что backend запущен и `NEXT_PUBLIC_API_URL` совпадает с его адресом |
| Вход персонала не работает | Не выполнен `npm run db:seed` — создайте тестовые учётные записи |
