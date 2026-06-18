# PROMPT_PLAN.md

План ниже больше не пытается «с нуля выполнить весь TASK.md как он задуман в идеале». Он приведён к тому, что реально существует в репозитории.

Что сознательно выкинуто:

- всё, что описывает полноценный online business-loan lifecycle;
- всё, что требует артефакта, которого в репо нет в зафиксированном виде;
- всё, что расходится с `AGENTS.md` и текущим поведением приложения.

Самый заметный пример — `7.2` из `TASK.md`: в дереве нет закоммиченного e2e/smoke-артефакта, который можно считать частью текущей реализации. Поэтому отдельного блока под него здесь нет.

---

## 1.1 Монорепозиторий

**Target Area & Goal:** стартовая структура репозитория. Разложить проект на `frontend` и `backend` так, чтобы дальше не пришлось переносить код из корня и чинить import graph.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 1.1) и `AGENTS.md`. Нужно с нуля развернуть монорепозиторий LumenBridge без лишних abstraction layers.

Сделай только базовую файловую структуру:
- `frontend/`
- `backend/`
- рабочие подкаталоги под `src/`, `public/`, `prisma/`, если они реально нужны на следующих шагах

Что проверить до правок:
- нет ли файлов в корне, которые потом придётся переносить со сломанными path aliases;
- не появятся ли циклические зависимости между frontend и backend через shared-код в корне.

Технические ограничения:
- не создавай общий runtime package ради красоты;
- не тащи workspace orchestration, если он не нужен для MVP;
- структура должна быть совместима с Next.js App Router во `frontend` и NestJS во `backend`.

В конце проверь, что reference-файлы не изменены.

Обязательный commit message:
`chore(repo): scaffold frontend and backend workspaces`
```

## 1.2 Конфиги проектов

**Target Area & Goal:** package scripts, TypeScript и базовая toolchain-конфигурация без мёртвых команд и `any`-долга по умолчанию.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 1.2) и `AGENTS.md`. Настрой конфиги для двух приложений: Next.js во `frontend` и NestJS во `backend`.

Проверь и создай/измени:
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/postcss.config.*`
- `frontend/next.config.*`
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/tsconfig.build.json`
- `backend/nest-cli.json`
- eslint-конфиги, если они реально используются

Требования:
- TypeScript strict mode включён;
- `dev`, `build`, `start`, `test` отражают реальные команды, которые потом войдут в README;
- path aliases не ломают IDE и production build;
- не маскируй типовые проблемы через глобальный `any` и не прячь их под фиктивный tooling.

После настройки прогони dry run сборки или equivalent sanity check.

Обязательный commit message:
`chore(config): initialize frontend and backend toolchains`
```

## 1.3 Tailwind v4 и дизайн-токены

**Target Area & Goal:** базовый visual layer публичного фронта с токенами из `AGENTS.md`.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 1.3) и `AGENTS.md`. Нужно настроить Tailwind CSS v4 во `frontend` и перенести туда дизайн-токены из спецификации.

Файлы для работы:
- `frontend/src/app/globals.css`
- tailwind/postcss-конфиги во `frontend`
- при необходимости `frontend/src/app/layout.tsx`

Что должно появиться:
- CSS custom properties под палитру, типографику, spacing, radius, shadow из `AGENTS.md`;
- базовые стили для кнопок, карточек, инпутов, badge и skeleton;
- reset, который не убивает нативные form controls и не создаёт ghost padding.

Guardrails:
- не превращай всё в инлайн-стили;
- не добавляй декоративные gradients/orbs, которых нет в AGENTS.md;
- следи, чтобы hover/focus не вызывали layout shift;
- если используешь Tailwind v4 features, проверь, что production build не выкидывает нужные классы.

Обязательный commit message:
`feat(frontend): wire design tokens and tailwind base styles`
```

## 1.4 Переменные окружения

**Target Area & Goal:** рабочие `.env.example` для backend и frontend.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 1.4) и `AGENTS.md`. Настрой конфигурацию окружения для backend и frontend.

Файлы:
- `backend/.env.example`
- `frontend/.env.local.example`
- при необходимости bootstrap/config код в `backend/src/main.ts` и frontend API config

Что нужно зафиксировать:
- DATABASE_URL;
- JWT secret;
- backend port;
- frontend API base URL;
- seed credentials для `admin` и `operator`.

Guardrails:
- `.env` не коммитить;
- example-файлы должны совпадать с тем, что реально читает код;
- не хардкодь секреты в исходниках;
- не делай два несовместимых способа загрузки env.

Обязательный commit message:
`chore(env): add runtime configuration templates`
```

## 2.1 Prisma и схема БД

**Target Area & Goal:** базовая доменная схема данных, которая реально используется текущим приложением.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 2.1) и `AGENTS.md`. Подними Prisma в `backend` и опиши фактическую доменную схему текущего проекта.

Файлы:
- `backend/prisma/schema.prisma`
- `backend/src/database/prisma.service.ts`
- `backend/src/database/database.module.ts`
- при необходимости bootstrap Prisma module в `backend/src/app.module.ts`

Минимальный набор моделей:
- User
- Application
- Loan
- PaymentSchedule
- PaymentRequest
- Payment
- OtpCode
- AdminUser
- Notification

Важно: не проектируй здесь отдельную сущность под полноценный business-loan lifecycle, если текущий продукт её не использует.

Guardrails:
- денежные поля только Decimal с фиксированной точностью;
- статусы не разносить по нескольким boolean-флагам;
- связи должны выдерживать schedule recalculation и payment reconciliation;
- уникальность по loan/application/admin login фиксировать сразу.

Обязательный commit message:
`feat(backend): define prisma domain schema`
```

## 2.2 Первая миграция

**Target Area & Goal:** стартовая PostgreSQL migration под фактическую Prisma-схему.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 2.2) и `AGENTS.md`. После описания Prisma-схемы создай и примени первую миграцию.

Файлы и артефакты:
- `backend/prisma/migrations/**`
- package scripts для migrate/generate, если их ещё нет

Что сделать:
- сгенерировать migration из реальной схемы;
- проверить SQL руками: unique constraints, nullable/non-nullable, foreign keys, индексы;
- применить миграцию к локальной PostgreSQL.

Guardrails:
- не редактируй generated SQL вслепую;
- naming consistency через `@map`/`@@map` держи сразу;
- не делай destructive drop/create там, где хватает аккуратной initial schema.

Обязательный commit message:
`chore(db): create initial postgres migration`
```

## 2.3 Seed для персонала

**Target Area & Goal:** тестовые учётки `admin` и `operator`.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 2.3) и `AGENTS.md`. Напиши seed для тестовых ролей `admin` и `operator`.

Файлы:
- `backend/src/database/seed.ts`
- `backend/package.json`

Что требуется:
- создаются минимум две учётки: `admin` и `operator`;
- пароли берутся из env;
- seed можно запускать повторно без дублей.

Guardrails:
- пароль хранится только как hash;
- не ломай повторный запуск через неудачный upsert;
- не засоряй seed тестовыми клиентами, если это не нужно текущему продукту.

Обязательный commit message:
`feat(seed): add admin and operator bootstrap`
```

## 2.4 Аннуитетный модуль

**Target Area & Goal:** backend-финансы: аннуитетный расчёт, который реально используют калькулятор и loan engine.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 2.4) и `AGENTS.md`. Реализуй backend-модуль расчёта аннуитета по формуле из спецификации и прикрой его unit-тестами.

Файлы:
- `backend/src/common/utils/loan-calculator.ts`
- `backend/src/common/utils/loan-calculator.spec.ts`

Что нужно:
- функция расчёта daily payment / total repayment;
- конфиг диапазонов займа, который потом переиспользуется в UI и API;
- округление до центов;
- защита от кривого input.

Guardrails:
- не смешивай математику и HTTP/domain validation в одну функцию;
- payment и total должны округляться предсказуемо;
- тесты должны ловить rounding regression, а не просто проверять, что число положительное.

Обязательный commit message:
`feat(finance): add annuity calculator with tests`
```

## 3.1 Клиентский OTP-flow

**Target Area & Goal:** вход клиента по телефону с mock OTP.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 3.1) и `AGENTS.md`. Реализуй клиентский вход/регистрацию по телефону с mock OTP.

Файлы:
- `backend/src/modules/auth/**`
- `backend/src/common/guards/**` если нужны user guards
- `backend/src/common/decorators/**` если нужны current user helpers

Что должно работать:
- запрос кода по телефону;
- генерация и сохранение OTP с TTL;
- verify OTP -> выдача JWT;
- если user не существует, он создаётся в рамках сценария входа;
- в dev/mock режиме код возвращается в ответе или явно логируется так, как требует AGENTS.md.

Guardrails:
- OTP одноразовый;
- expired code невалиден;
- reused code не проходит;
- JWT payload не раздувать лишними полями.

Обязательный commit message:
`feat(auth): implement client otp login flow`
```

## 3.2 Вход персонала

**Target Area & Goal:** staff auth по `login/password`, как это реально сделано в текущем проекте.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 3.2) и `AGENTS.md`. Реализуй staff login для `admin` и `operator`.

Файлы:
- `backend/src/modules/auth/**`
- DTO под staff login
- admin JWT strategy / guard

Что должно работать:
- endpoint login/password;
- проверка hash пароля;
- отдельный JWT для staff-потока;
- в payload есть роль, достаточная для RBAC.

Guardrails:
- не подменяй модель на email/password, если фактический продукт использует `login`;
- client JWT и admin JWT не должны быть взаимозаменяемы;
- ошибка авторизации не должна палить существование логина.

Обязательный commit message:
`feat(auth): add staff jwt authentication`
```

## 3.3 RBAC

**Target Area & Goal:** развести `client`, `operator`, `admin` по реальным backend-правам.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 3.3) и `AGENTS.md`. Настрой RBAC и guards.

Файлы:
- `backend/src/common/guards/**`
- `backend/src/common/decorators/**`
- контроллеры auth/applications/loans/payments/admin

Что нужно:
- client routes закрыты user guard;
- admin routes закрыты admin guard + role guard;
- `operator` и `admin` разведены по действиям вокруг заявок и платежей.

Guardrails:
- 401 и 403 должны различаться корректно;
- не хардкодь роли в каждом контроллере вручную;
- не оставляй служебные endpoints незакрытыми.

Обязательный commit message:
`feat(security): enforce role-based access control`
```

## 4.1 FSD-структура фронтенда

**Target Area & Goal:** разложить frontend-код по FSD без декоративной сложности.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 4.1) и `AGENTS.md`. Разверни frontend-структуру по FSD.

Файлы и директории:
- `frontend/src/app/**`
- `frontend/src/widgets/**`
- `frontend/src/features/**`
- `frontend/src/shared/**`

Что требуется:
- повторяемую логику вынести из страниц;
- не плодить слои без реального use case;
- api helpers, auth helpers, formatters, skeletons и reusable UI должны получить понятный дом.

Guardrails:
- App Router conventions не ломать;
- не уходить в глубокую вложенность без необходимости.

Обязательный commit message:
`refactor(frontend): organize app with fsd structure`
```

## 4.2 Layouts публичного сайта

**Target Area & Goal:** публичный layout: header, footer, общая сетка.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 4.2) и `AGENTS.md`. Собери публичный layout проекта.

Файлы:
- `frontend/src/app/(public)/layout.tsx`
- `frontend/src/widgets/header/**`
- `frontend/src/widgets/footer/**`
- `frontend/src/app/layout.tsx`

Что должно быть:
- header по структуре из AGENTS.md;
- footer с навигацией и legal links;
- мобильная адаптация без horizontal overflow;
- единая тема без конфликтов с cabinet/admin layout.

Guardrails:
- не превращай header в hero;
- не используй floating-card композицию для целых страниц.

Обязательный commit message:
`feat(public): build shared site layout`
```

## 4.3 Главная и калькулятор

**Target Area & Goal:** hero и кредитный калькулятор с мгновенным расчётом.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 4.3) и `AGENTS.md`. Сверстай главную страницу и интерактивный кредитный калькулятор.

Файлы:
- `frontend/src/app/(public)/page.tsx`
- `frontend/src/features/loan-calculator/**`
- frontend format/math helpers, если нужны

Что нужно:
- hero по AGENTS.md;
- калькулятор без debounce;
- передача amount/term в `/apply`;
- формула на клиенте совпадает с backend calculator.

Guardrails:
- не дублируй математику по всему фронту;
- не допускай layout shift на длинных числах;
- если slider управляет CSS progress, не оставляй stale style state.

Обязательный commit message:
`feat(public): add homepage and interactive loan calculator`
```

## 4.4 Текстовые страницы

**Target Area & Goal:** публичные content/legal страницы, включая рабочий mock contacts flow.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 4.4) и `AGENTS.md`. Добавь текстовые страницы публичной зоны.

Файлы:
- `frontend/src/app/(public)/how-it-works/page.tsx`
- `frontend/src/app/(public)/business/page.tsx`
- `frontend/src/app/(public)/faq/page.tsx`
- `frontend/src/app/(public)/contacts/page.tsx`
- legal pages: `privacy`, `cookies`, `terms`, `credit-policy`, `aml-kyc`
- shared legal page component, если он реально сокращает дублирование
- `backend/src/modules/contact/**` для mock feedback endpoint

Важно:
- business page должна честно вести в contact-only сценарий;
- FAQ разделяет personal/business сценарии;
- contacts page — не пустая верстка, а рабочая mock form.

Guardrails:
- без lorem ipsum;
- legal pages не превращать в marketing copy;
- feedback flow не должен притворяться production-ticketing системой.

Обязательный commit message:
`feat(public): add content pages and contact flow`
```

## 5.1 Защищённая зона `/cabinet`

**Target Area & Goal:** каркас личного кабинета и route protection.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 5.1) и `AGENTS.md`. Сделай клиентский кабинет с route protection.

Файлы:
- `frontend/src/middleware.ts`
- `frontend/src/app/(cabinet)/**`
- `frontend/src/widgets/sidebar/Cabinet*`
- auth context / token helpers во `frontend/src/shared/lib/**`

Что должно работать:
- неавторизованный пользователь не попадает в `/cabinet/*`;
- после успешного OTP login сессия подхватывается фронтом;
- sidebar и layout соответствуют AGENTS.md.

Guardrails:
- middleware не должен ломать public routes и static assets;
- не создавай redirect loop между `/login` и `/cabinet`.

Обязательный commit message:
`feat(cabinet): add protected client area`
```

## 5.2 Форма заявки

**Target Area & Goal:** публичная заявка на займ в текущем продукте: personal issuance + business lead capture.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 5.2) и `AGENTS.md`. Реализуй форму заявки в том виде, в котором она реально существует в проекте.

Файлы:
- `frontend/src/app/(public)/apply/page.tsx`
- `frontend/src/shared/lib/**` для form resolver / API client / auth persistence
- backend application DTO/controller/service
- `backend/src/modules/contact/**`, если business lead идёт через contact path

Что требуется:
- React Hook Form + Valibot;
- personal-flow создаёт реальную заявку;
- business-flow остаётся видимым, но submit идёт в mock contact/feedback path;
- параметры из калькулятора подтягиваются в форму;
- business submit не создаёт user loan lifecycle и не логинит пользователя в кабинет.

Guardrails:
- не скатывайся обратно в `useState`-валидацию;
- дата рождения и денежные поля не должны разваливаться в NaN/string mess;
- backend остаётся trust boundary и повторяет критичную validation.

Обязательный commit message:
`feat(apply): implement personal application and business lead form`
```

## 5.3 Экран займа и подписание

**Target Area & Goal:** экран займа в кабинете, pending signing и mock OTP signing.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 5.3) и `AGENTS.md`. Собери экран займа в кабинете и backend signing flow.

Файлы:
- `backend/src/modules/loans/**`
- `backend/src/modules/auth/**`, если OTP purpose логика общая
- `frontend/src/app/(cabinet)/cabinet/loans/[id]/page.tsx`
- `frontend/src/app/(cabinet)/login/page.tsx`

Что должно работать:
- pending_signing banner;
- запрос mock OTP на подписание;
- verify/sign endpoint;
- фиксация `signed_at`, IP, User-Agent;
- после подписания строится график платежей.

Guardrails:
- login OTP и sign OTP не смешивать по purpose;
- чужой займ нельзя подписать;
- повторная подпись уже активного займа должна падать предсказуемо.

Обязательный commit message:
`feat(loans): add client loan signing flow`
```

## 5.4a Платёжный движок и график

**Target Area & Goal:** backend payment engine, schedule recalculation и payoff logic.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 5.4) и `AGENTS.md`. Сначала сделай backend payment engine, без фронтовых правок в этом промпте.

Файлы:
- `backend/src/modules/payments/**`
- `backend/src/modules/loans/payment-schedule.utils.ts`
- `backend/src/modules/loans/payment-schedule.service.ts`
- `backend/src/modules/loans/loans.service.ts`
- `backend/src/modules/admin/admin.controller.ts` в части фиксации/подтверждения платежей
- `backend/src/modules/loans/payment-schedule.utils.spec.ts`

Обязательная семантика:
- partial payment не двигает `dueDate` и `seq`;
- overpayment уменьшает principal и пересчитывает будущие аннуитетные суммы;
- full payoff считается как `outstanding principal + one-day interest`, без future interest;
- нужен динамический `Payoff Amount`;
- payment request выше payoff cap не должен проходить бесконтрольно;
- после полного погашения `remainingAmount = 0`, займ закрыт, будущие строки графика не висят как открытые.

Guardrails:
- Decimal только на persistence boundary;
- округление до центов после каждого значимого шага расчёта;
- confirm/reject не должны быть уязвимы к double-submit и race conditions.

Обязательный commit message:
`feat(payments): implement schedule recalculation and payoff logic`
```

## 5.4b Кабинет: график и уведомление об оплате

**Target Area & Goal:** клиентский UI поверх payment backend.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 5.4) и `AGENTS.md`. Теперь собери клиентский UI поверх payment backend.

Файлы:
- `frontend/src/app/(cabinet)/cabinet/loans/[id]/page.tsx`
- `frontend/src/app/(cabinet)/cabinet/loans/page.tsx`
- `frontend/src/shared/lib/api.ts`
- `frontend/src/shared/lib/loan-display.ts`

Что требуется:
- интерактивный график платежей;
- payment request form с amount + reference;
- отдельный payoff UX, если backend отдаёт payoff amount;
- pending request / closed loan / overdue states отображаются явно.

Guardrails:
- не держи stale balance после submit/confirm;
- не показывай активную CTA в impossible state;
- не рисуй business-loan ветку там, где её фактически нет.

Обязательный commit message:
`feat(cabinet): add payment schedule and payment request ui`
```

## 6.1 `/admin/login`

**Target Area & Goal:** вход в административную панель.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 6.1) и `AGENTS.md`. Реализуй экран входа в админку и привязку к staff auth backend.

Файлы:
- `frontend/src/app/(admin)/admin/login/page.tsx`
- `frontend/src/shared/lib/admin-auth-context.tsx`
- staff token helpers / route guards, если они нужны

Что должно работать:
- форма login/password;
- сохранение staff session;
- redirect в `/admin/*`.

Guardrails:
- client auth context и admin auth context не смешивать;
- пароль не должен утекать в query/localStorage debug garbage.

Обязательный commit message:
`feat(admin): add admin login screen`
```

## 6.2 Дашборд оператора и работа с заявками

**Target Area & Goal:** операторский workflow вокруг personal applications.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 6.2) и `AGENTS.md`. Собери workflow обработки заявок в админке в том виде, в котором он реально реализован сейчас.

Файлы:
- `backend/src/modules/admin/admin.controller.ts`
- `backend/src/modules/applications/**`
- `frontend/src/app/(admin)/admin/applications/page.tsx`
- `frontend/src/app/(admin)/admin/applications/[id]/page.tsx`
- при необходимости `frontend/src/app/(admin)/admin/clients/**`

Что должно работать:
- список заявок с фильтрами/поиском;
- перевод статусов `new -> in_review -> approved/rejected`;
- approve personal application создаёт loan;
- интерфейс не обещает operator-visible online business pipeline, которого в продукте нет.

Guardrails:
- запрещай нелегальные status transitions на backend;
- комментарии оператора не должны теряться;
- повторный approve не должен создавать второй loan по той же заявке.

Обязательный commit message:
`feat(admin): implement application review workflow`
```

## 6.3 Подтверждение платежей пользователей

**Target Area & Goal:** admin payment review и фиксация платежей.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 6.3) и `AGENTS.md`. Реализуй workflow подтверждения пользовательских payment requests и фиксации реальных платежей.

Файлы:
- `backend/src/modules/admin/admin.controller.ts`
- `backend/src/modules/payments/**`
- `backend/src/modules/loans/payment-schedule.service.ts`
- `frontend/src/app/(admin)/admin/payments/page.tsx`
- `frontend/src/app/(admin)/admin/loans/[id]/page.tsx`

Что должно работать:
- оператор видит payment requests и может confirm/reject;
- администратор может зафиксировать реальный payment по loan;
- после confirm/record schedule пересчитывается автоматически;
- full payoff закрывает loan и не оставляет residual debt в графике.

Guardrails:
- confirm одной и той же payment request дважды не создаёт duplicate payment row;
- operator/admin права не смешивать;
- response DTO должен возвращать актуальный balance, а не stale pre-sync snapshot.

Обязательный commit message:
`feat(admin): add payment confirmation workflow`
```

## 7.1 Ошибки API и Skeletons

**Target Area & Goal:** loading/error/empty states по фактически существующим экранам.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 7.1) и `AGENTS.md`. Пройди frontend и выровняй обработку 400/401/403 и loading state.

Файлы:
- cabinet pages
- admin pages
- shared skeleton/error UI
- `frontend/src/shared/lib/api.ts`

Что требуется:
- skeleton вместо пустого экрана;
- понятные user-facing ошибки;
- empty state там, где данных действительно нет;
- auth failure не оставляет UI в полумёртвом состоянии.

Guardrails:
- не сваливай все ошибки в одно сообщение;
- не показывай stack trace пользователю;
- не подменяй loading полноценным infinite spinner в центре страницы.

Обязательный commit message:
`fix(frontend): normalize api errors and skeleton states`
```

## 7.3 README и runbook

**Target Area & Goal:** итоговый README, соответствующий реальному проекту.

**The Prompt Text:**

```text
Работаешь по `TASK.md` (пункт 7.3) и `AGENTS.md`. Напиши итоговый README так, чтобы проект поднимался на пустой машине без устных пояснений.

Файлы:
- `README.md`
- `backend/.env.example`
- `frontend/.env.local.example`
- `docker-compose.yml`, если инструкции не совпадают с реальностью

README обязан содержать:
- описание проекта;
- стек;
- команды установки и запуска;
- как одновременно стартовать backend и frontend;
- формулу калькулятора;
- известные ограничения учебного режима;
- mock OTP-flow;
- тестовые учётные данные для `admin` и `operator`;
- пояснение, что business-заявки идут через contact/feedback path, а не через online issuance.

Guardrails:
- никаких фейковых production claims;
- команды в README должны совпадать с package scripts;
- не упоминай несуществующие env keys, routes или артефакты.

Обязательный commit message:
`docs(readme): add complete setup and operation guide`
```
