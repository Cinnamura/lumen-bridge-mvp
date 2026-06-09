# AGENTS.md — LumenBridge Finance Ltd

Этот файл — единственный источник истины для AI-агентов и разработчиков, работающих над проектом. Он покрывает всё: дизайн-систему, структуру страниц, схему базы данных, API-контракты, бизнес-логику, правила валидации, ролевую модель, mock-сценарии и требования к документации.

**Не дополняй, не изменяй и не расширяй ничего за пределами scope, описанного здесь. Это учебный MVP, а не production-продукт.**

---

## 1. Философия дизайна

Продукт — европейский финтех-сервис краткосрочного кредитования. Аудитория — физические лица и малый бизнес, которым нужны деньги быстро. Сервис должен вызывать доверие как банк, но ощущаться проще и быстрее. Не агрессивный "займодавец", а спокойный, компетентный партнёр.

**Три главных ощущения:**
- Надёжность (структура, сдержанность, соответствие законам)
- Скорость (лаконичность, минимум шагов, понятный прогресс)
- Прозрачность (всё видно до оформления, ничего не скрыто)

**Сигнатурный элемент:** Кредитный калькулятор — центральный объект главной страницы. Он живой, мгновенно реагирует, отображает итоговую сумму крупным шрифтом. Это единственный «разговорный» момент интерфейса.

---

## 2. Цветовая палитра

```
--color-midnight:   #0D1B2A   /* Фон героя, хедер, тёмные секции */
--color-ink:        #1A2942   /* Карточки на тёмном фоне, sidebar */
--color-slate:      #4A6580   /* Вспомогательный текст, иконки */
--color-silver:     #E8ECF0   /* Фон светлых секций, разделители */
--color-white:      #FFFFFF   /* Основной фон контента */
--color-accent:     #2E7DF7   /* CTA-кнопки, активные состояния, акценты */
--color-accent-dim: #1A5CC4   /* Hover для accent */
--color-gold:       #C9923A   /* Бизнес-страница, премиум-маркер */
--color-success:    #1E8A5E   /* Одобрено, подтверждено */
--color-warning:    #C08020   /* Просрочка, внимание */
--color-danger:     #C0392B   /* Отклонено, ошибка */
--color-text-primary:   #0D1B2A
--color-text-secondary: #4A6580
--color-text-inverse:   #FFFFFF
```

**Логика применения:**
- Публичный сайт: светлая тема (`--color-white` / `--color-silver`), герой тёмный (`--color-midnight`)
- Личный кабинет: светлая тема с боковой панелью `--color-silver`
- Админ-панель: нейтральная рабочая тема, `--color-silver` фон, белые карточки

---

## 3. Типографика

**Display / Hero:** `DM Serif Display` (Google Fonts) — крупные заголовки первых экранов. Использовать только там, где нужен характер.

**Body / UI:** `Inter` (Google Fonts) — все остальные тексты, интерфейсы, формы, таблицы.

**Mono:** `JetBrains Mono` — цифры в калькуляторе, суммы займов, даты в таблицах.

```
/* Шкала размеров */
--text-xs:   0.75rem   /* 12px — подписи, микротекст */
--text-sm:   0.875rem  /* 14px — вторичный текст, метки форм */
--text-base: 1rem      /* 16px — основной текст */
--text-lg:   1.125rem  /* 18px — карточки, подзаголовки */
--text-xl:   1.25rem   /* 20px */
--text-2xl:  1.5rem    /* 24px — заголовки секций */
--text-3xl:  1.875rem  /* 30px */
--text-4xl:  2.25rem   /* 36px — заголовки страниц */
--text-5xl:  3rem      /* 48px — hero подзаголовок */
--text-6xl:  3.75rem   /* 60px — hero заголовок */
--text-hero-amount: 4.5rem  /* Сумма в калькуляторе, mono */

/* Межстрочный интервал */
--leading-tight:  1.2
--leading-normal: 1.5
--leading-relaxed: 1.7

/* Вес */
--font-normal:    400
--font-medium:    500
--font-semibold:  600
--font-bold:      700
```

---

## 4. Пространство и сетка

```
/* Внутренние отступы */
--space-1:  0.25rem   /* 4px */
--space-2:  0.5rem    /* 8px */
--space-3:  0.75rem   /* 12px */
--space-4:  1rem      /* 16px */
--space-5:  1.25rem   /* 20px */
--space-6:  1.5rem    /* 24px */
--space-8:  2rem      /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */

/* Контейнер */
--container-sm:  640px
--container-md:  768px
--container-lg:  1024px
--container-xl:  1200px
--container-2xl: 1400px
--container-content: 72ch   /* Максимальная ширина текстового контента */

/* Радиус */
--radius-sm:  4px
--radius-md:  8px
--radius-lg:  12px
--radius-xl:  16px
--radius-full: 9999px   /* Пилюли */

/* Тени */
--shadow-sm: 0 1px 3px rgba(13,27,42,0.08);
--shadow-md: 0 4px 12px rgba(13,27,42,0.10);
--shadow-lg: 0 8px 24px rgba(13,27,42,0.12);
--shadow-card: 0 2px 8px rgba(13,27,42,0.06), 0 1px 2px rgba(13,27,42,0.04);
```

**Сетка публичного сайта:** 12-колоночная, gutter 24px, max-width 1200px.
**Сетка дашбордов (ЛК и Admin):** боковая панель 240px + основная область flex-grow.

---

## 5. Компонентная библиотека

### 5.1 Кнопки

```
/* Primary — главное действие */
.btn-primary {
  background: var(--color-accent);
  color: var(--color-white);
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  transition: background 150ms ease;
}
.btn-primary:hover { background: var(--color-accent-dim); }

/* Secondary — вторичное действие */
.btn-secondary {
  background: transparent;
  border: 1.5px solid var(--color-accent);
  color: var(--color-accent);
  border-radius: var(--radius-md);
  padding: 11px 23px;
}

/* Ghost — для dark-фона */
.btn-ghost {
  background: rgba(255,255,255,0.12);
  color: var(--color-white);
  border: 1.5px solid rgba(255,255,255,0.24);
  border-radius: var(--radius-md);
}

/* Danger */
.btn-danger {
  background: var(--color-danger);
  color: var(--color-white);
}

/* Size variants: sm (10px 16px), md (12px 24px), lg (14px 32px) */
```

### 5.2 Карточки

```
/* Базовая карточка */
.card {
  background: var(--color-white);
  border: 1px solid var(--color-silver);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
}

/* Карточка на тёмном фоне */
.card-dark {
  background: var(--color-ink);
  border: 1px solid rgba(255,255,255,0.08);
  color: var(--color-white);
}

/* Интерактивная карточка */
.card-interactive {
  cursor: pointer;
  transition: box-shadow 150ms ease, transform 150ms ease;
}
.card-interactive:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### 5.3 Поля форм

```
.input {
  width: 100%;
  border: 1.5px solid #C8D0DA;
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: var(--color-white);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(46,125,247,0.15);
  outline: none;
}
.input--error {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(192,57,43,0.12);
}
.input-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}
.input-error-msg {
  font-size: var(--text-xs);
  color: var(--color-danger);
  margin-top: var(--space-1);
}
```

### 5.4 Бейджи статусов

```
/* Базовый */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.badge-new       { background: #EBF1FE; color: var(--color-accent); }
.badge-pending   { background: #FEF3CD; color: #7A5200; }
.badge-approved  { background: #D4EDDA; color: var(--color-success); }
.badge-rejected  { background: #FAD7D4; color: var(--color-danger); }
.badge-active    { background: #D4EDDA; color: var(--color-success); }
.badge-overdue   { background: #FEF3CD; color: var(--color-warning); }
.badge-closed    { background: var(--color-silver); color: var(--color-slate); }
.badge-signing   { background: #EDE9FE; color: #6D28D9; }
```

### 5.5 Слайдер калькулятора

```
.calc-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: var(--radius-full);
  background: linear-gradient(
    to right,
    var(--color-accent) 0%,
    var(--color-accent) var(--progress),
    #C8D0DA var(--progress),
    #C8D0DA 100%
  );
}
.calc-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(46,125,247,0.2);
  cursor: pointer;
}
.calc-result-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-hero-amount);
  font-weight: var(--font-bold);
  color: var(--color-midnight);
  letter-spacing: -0.02em;
}
```

### 5.6 Навигационный хедер (публичный сайт)

- Высота: 64px
- Фон: `var(--color-midnight)` (стеклянная полупрозрачность при скролле)
- Логотип: слева — wordmark «LumenBridge» в `DM Serif Display`
- Навигация: «Как это работает» | «Для бизнеса» | «FAQ» | «Контакты»
- Правая группа: кнопка «Войти» (ghost) + кнопка «Получить займ» (primary)
- Мобильный: hamburger-меню, полноэкранный drawer

---

## 6. Структура публичного сайта

### 6.1 Главная страница (`/`)

**Секция 1 — Hero**
```
Layout: тёмный фон --color-midnight
  Слева (7/12 колонок):
    - Eyebrow: «Быстрые займы в Европе» (text-sm, color-accent)
    - H1: «Получите деньги тогда, когда это действительно нужно»
      (DM Serif Display, text-6xl, color-white, leading-tight)
    - P: подзаголовок, text-lg, color: rgba(255,255,255,0.7)
    - Микротекст: «Без залога • Быстрое одобрение • Выплата на банковский счёт»
      (text-sm, color: rgba(255,255,255,0.5))
    - CTA: btn-primary «Получить займ» + btn-ghost «Как это работает →»
  Справа (5/12 колонок): [Калькулятор — карточка card-dark]
    
Минимальная высота: 100vh на десктопе, auto на мобильном
```

**Секция 2 — Кредитный калькулятор (главный элемент)**
```
Layout: --color-silver фон, padding-y: 80px
  Центр, max-width: 680px, mx-auto
  
  H2: «Рассчитайте условия займа»
  
  [Слайдер суммы]
    Label: «Сумма займа»
    Range: 500 — 50 000 EUR, step: 100
    Отображение: JetBrains Mono, text-3xl
  
  [Слайдер срока]
    Label: «Срок займа»
    Range: 7 — 90 дней
    Отображение: JetBrains Mono, text-3xl
  
  [Результат — карточка с --color-midnight фоном]
    «Ежедневный платёж»      → A (mono, text-xl)
    «Итого к возврату»       → Total (mono, text-hero-amount, bold)
    «Ставка: 0,8% в день»    → text-sm, мутный белый
    
    Сноска: курсив, text-xs, rgba(255,255,255,0.5)
    CTA: btn-primary «Подать заявку»
```

**Секция 3 — Условия займа**
```
Layout: белый фон, 4 карточки в ряд (на мобильном — 2×2)
  «Сумма: 500 — 50 000 EUR»
  «Срок: 7 — 90 дней»
  «Ставка: индивидуально»
  «Погашение: равными платежами»
  
  Каждая карточка: иконка (24px, color-accent) + title + value
```

**Секция 4 — Когда деньги нужны сейчас**
```
Layout: --color-silver, 2×2 карточки
  Иконка → Заголовок ситуации → Описание
  «Срочные расходы» | «Задержка дохода» | «Бизнес-задачи» | «Возможности»
```

**Секция 5 — Как это работает**
```
Layout: белый фон
  Горизонтальная линия прогресса с 3 точками (только если это реальный процесс)
  Шаг 1: Регистрация | Шаг 2: Заявка | Шаг 3: Получение средств
  Каждый шаг: номер (text-5xl, color-accent, mono) + заголовок + описание
```

**Секция 6 — Прозрачные условия**
```
Layout: тёмный --color-midnight, 2-колоночный список
  5 пунктов с иконкой-галочкой (color-accent) и текстом
```

**Секция 7 — О компании**
```
Layout: белый фон, текстовый блок max-width: 720px, mx-auto
  H2 + 3 абзаца
```

**Секция 8 — Улучшение кредитной истории**
```
Layout: --color-silver, split 50/50
  Слева: H2 + текст + список из 3 пунктов + CTA
  Справа: иллюстрация (SVG — восходящий график или значок щита)
```

**Секция 9 — Для бизнеса**
```
Layout: --color-midnight с gold-акцентом (#C9923A)
  H2 + описание + 5 преимуществ + CTA «Оставить заявку»
  Пометка: «Заявки принимаются через форму обратной связи»
```

**Секция 10 — Блок доверия**
```
Layout: белый фон, 4 пункта в ряд с иконками щита/галочки
  GDPR | Ответственный подход | Защита данных | Чёткие условия
```

**Секция 11 — FAQ (превью)**
```
Layout: --color-silver
  3 вопроса в accordion
  Кнопка «Смотреть все вопросы» → /faq
```

**Секция 12 — Безопасность**
```
Layout: --color-midnight
  H2 + текст + выделенный предупредительный блок
  «Мы не требуем предоплату и не запрашиваем конфиденциальные данные»
```

**Секция 13 — Обратная связь**
```
Layout: белый фон, 2 колонки
  Слева: форма (Имя, Email, Телефон, Сообщение, Файл, Checkbox)
  Справа: контактные данные + карта-заглушка
```

---

### 6.2 Страница «Как это работает» (`/how-it-works`)

```
Hero: --color-midnight, H1 + подзаголовок
  
Основной контент (max-width 800px, mx-auto):
  5 шагов — вертикальная timeline
    Маркер (порядковый номер) → только если порядок критически важен
    Заголовок шага + развёрнутое описание
    [Регистрация → Подача заявки → Проверка → Получение → Погашение]
    
Блок «Важно знать»:
  card, border-left: 4px solid var(--color-accent)
  4 пункта-факта
  
CTA: «Подать заявку» + «Есть вопросы? FAQ»
```

---

### 6.3 Страница «Для бизнеса» (`/business`)

```
Hero: --color-midnight с gold-акцентом, H1 + описание
  
Секция «Когда это актуально»: 2×2 карточки
  
Секция «Условия финансирования»: таблица или 4 карточки
  Сумма: 30 000 — 500 000 EUR
  Срок: 1 — 12 мес.
  Залог: не требуется
  Рассмотрение: быстро
  
Секция «Преимущества»: 3 карточки с иконками
  
Секция «Требования»: 2 блока (Компании / ИП)
  card с заголовком и checklist внутри
  
Секция «Порядок оформления»:
  Callout: «Заявки принимаются через форму обратной связи»
  CTA: «Оставить заявку»
```

---

### 6.4 Страница FAQ (`/faq`)

```
Hero: текстовый, H1 + введение
  
Фильтр-табы: «Для физических лиц» | «Для бизнеса»
  
Accordion (10 + 8 вопросов):
  Вопрос — кликабельный, раскрывается ответ
  border-bottom: 1px solid --color-silver
  
CTA внизу: «Не нашли ответ? Напишите нам»
```

---

### 6.5 Страница «Контакты» (`/contacts`)

```
H1 + вступление

2-колоночный layout:
  Слева: форма обратной связи (Имя, Email, Телефон, Сообщение, Файл, Checkbox)
  Справа: адрес, email, телефон, режим работы

Информационный callout:
  «Мы не требуем предоплату и не запрашиваем конфиденциальные данные»
```

---

### 6.6 Юридические страницы (`/privacy`, `/cookies`, `/terms`, `/credit-policy`, `/aml-kyc`)

```
Layout: белый фон, max-width: 800px, mx-auto, padding: 60px 0
H1 → разделы H2 → текст
Оглавление слева (sticky, только десктоп)
text-sm, color-text-secondary, leading-relaxed
```

---

### 6.7 Футер

```
4-колоночный layout на --color-midnight:
  Колонка 1 — Логотип + краткое описание + контакты
  Колонка 2 — Компания (О компании, Как это работает, Для бизнеса)
  Колонка 3 — Поддержка (FAQ, Обратная связь, Контакты)
  Колонка 4 — Документы (5 ссылок на юридические страницы)
  
Нижняя строка:
  «© 2024 LumenBridge Finance Ltd. Все права защищены.»
  «LumenBridge Finance Ltd осуществляет деятельность в соответствии с применимым европейским законодательством. Обработка персональных данных в рамках GDPR.»
  text-xs, rgba(255,255,255,0.4)
```

---

## 7. Личный кабинет пользователя (`/cabinet/*`)

### 7.1 Структура

```
Layout: sidebar + main area

[Sidebar — 240px, --color-midnight]
  Логотип / «LumenBridge»
  Аватар + номер телефона (маскированный)
  ---
  Навигация:
    📋 Заявки
    💳 Мои займы
    🔔 Уведомления
  ---
  Внизу: «Выйти»

[Main Area — flex-grow, --color-silver фон]
  Breadcrumb + Page Title
  Контент секции
```

### 7.2 Раздел «Заявки» (`/cabinet/applications`)

```
Page Title: «Мои заявки»
CTA правый верх: «Подать новую заявку» (btn-primary)

Таблица / список карточек:
  Колонки: Сумма | Дата подачи | Статус
  Строка: кликабельна → модальное окно или детальная страница
  
  Статус badge: На рассмотрении / Одобрена / Отклонена
  
Empty state: «Заявок пока нет. Подайте первую заявку.» + CTA
```

### 7.3 Раздел «Мои займы» (`/cabinet/loans`)

```
Табы: «Активные» | «Закрытые»

[Активные займы]
  Card-список, для каждого займа:
    Сумма займа (text-2xl, bold, mono)
    Дата получения
    Следующий платёж: сумма + дата (highlighted если <3 дней)
    Прогресс-бар погашения
    Кнопка «Открыть»
    Badge статуса: Активен / Ожидает подписания / Просрочен

[Закрытые займы]
  Более компактный вид:
    Сумма | Дата получения | Дата погашения

Empty state: «Активных займов нет» / «Истории займов нет»
```

### 7.4 Карточка займа (`/cabinet/loans/:id`)

```
[Header карточки]
  Сумма займа — крупно (mono, text-4xl)
  Статус badge
  
[Параметры — grid 2×2]
  Процентная ставка | Срок
  Общая сумма к возврату | Дата следующего платежа

[График платежей — таблица]
  №  | Дата | Сумма | Статус
  Строки: оплачено (зелёная иконка) / предстоит / просрочено (красная иконка)

[Действия]
  «Просмотреть договор» → mock-PDF или заглушка
  «Создать заявку на оплату» → форма модального окна
  «Статус заявки на оплату» → если есть pending заявка

[Сценарий «Ожидает подписания»]
  Informational banner синего цвета
  «Займ ожидает вашего подписания»
  Кнопка «Подписать займ» → OTP-flow
  OTP: поле 6 цифр + «Отправить код» → подтверждение
  Mock-code: отображается в интерфейсе как [ИМ: code = XXXXXX]
```

### 7.5 Раздел «Уведомления» (`/cabinet/notifications`)

```
Список уведомлений, обратный хронологический порядок
  Иконка типа (информация / предупреждение / успех)
  Заголовок уведомления
  Дата и время
  Непрочитанные: выделены --color-silver фоном + синяя точка
  
Типы: «Заявка одобрена» | «Займ ожидает подписания» | «Платёж подтверждён» | «Просрочка» | «Займ закрыт»
```

---

## 8. Административная панель (`/admin/*`)

### 8.1 Структура

```
Layout: sidebar + main area (аналогично ЛК, но рабочий, нейтральный)

[Sidebar — 256px, --color-midnight]
  Логотип + «Admin Panel»
  Роль пользователя (Admin / Operator)
  ---
  Навигация:
    📋 Заявки
    👥 Клиенты
    💳 Займы
    💰 Платежи
    🔔 Уведомления
  ---
  Внизу: имя + «Выйти»

[Main Area — --color-silver фон]
  Page Title + фильтры/поиск правее
  Таблица или карточки
```

### 8.2 Раздел «Заявки»

```
Toolbar: поисковое поле + фильтр по статусу (все / новая / в обработке / одобрена / отклонена)

Таблица:
  Клиент | Телефон | Сумма | Дата подачи | Статус | Действие
  Строка кликабельна → Карточка заявки (правая панель или отдельная страница)

Карточка заявки:
  Данные клиента: имя, телефон
  Параметры займа: сумма, срок
  Дата подачи, статус
  
  Действия (по роли):
    Select «Изменить статус» → новая / в обработке / одобрена / отклонена
    Btn «Одобрить» (success) / «Отклонить» (danger)
    Textarea «Комментарий» + «Сохранить»
```

### 8.3 Раздел «Клиенты»

```
Toolbar: поиск по имени / телефону + фильтр статуса

Таблица:
  Имя | Телефон | Займов | Статус | Действие

Карточка клиента:
  Контактные данные
  
  Tabs: «История заявок» | «Активные займы» | «История платежей»
  Каждый таб — компактная таблица
```

### 8.4 Раздел «Займы»

```
Tabs: «Активные» | «Закрытые»

Таблица:
  Клиент | Сумма | Срок | Статус | Дата выдачи | Действие

Карточка займа:
  Параметры займа
  График платежей (таблица с редактированием платежей для оператора)
  
  Действия:
    «Изменить статус займа»
    «Отметить платёж» → ввод суммы и даты
    «Закрыть займ»
```

### 8.5 Раздел «Платежи»

```
Toolbar: фильтр по статусу заявки на оплату

Таблица:
  Клиент | Займ | Сумма | Дата | Reference | Статус | Действие

Карточка заявки на оплату:
  Реквизиты от пользователя
  Сумма
  
  Для Admin: «Зафиксировать платёж» → ввод суммы
  Для Operator: «Подтвердить» / «Отклонить» заявку на оплату
  Пометка «Просрочка» — для оператора
```

### 8.6 Раздел «Уведомления»

```
Список системных уведомлений:
  «Новая заявка» | «Просрочка» | «Изменение статуса»
  Время + краткое описание + ссылка на объект
```

### 8.7 Страница входа в Admin (`/admin/login`)

```
Центрированный layout, --color-silver фон
  Card (max-width: 400px):
    Логотип
    «Административная панель»
    Input: «Логин»
    Input: «Пароль» (с toggle visibility)
    Btn-primary: «Войти»
    
  Тестовые данные (только в development):
    admin / admin123 (роль: admin)
    operator / operator123 (роль: operator)
```

---

## 9. Состояния интерфейса

Все разделы дашбордов обязаны реализовывать три состояния:

**Loading state:**
```
Skeleton-блоки: серые прямоугольники с анимацией shimmer
  background: linear-gradient(90deg, --color-silver, #D0D5DD, --color-silver)
  background-size: 200% 100%
  animation: shimmer 1.5s infinite
Не использовать спиннер в центре страницы — только скелеты на месте контента
```

**Empty state:**
```
Центрированный в области контента:
  SVG иконка (60px, color-slate)
  H3: что пусто
  P: подсказка что делать
  CTA (опционально)
```

**Error state:**
```
Card с border-left: 4px solid var(--color-danger):
  Иконка предупреждения
  «Не удалось загрузить данные»
  Описание проблемы
  Btn «Попробовать снова»
```

---

## 10. Адаптивность

```
Breakpoints (Tailwind v4):
  sm:  640px
  md:  768px
  lg:  1024px
  xl:  1280px
  2xl: 1536px

Публичный сайт:
  < 768px: одна колонка, hero вертикальный (контент сверху, калькулятор снизу)
  < 1024px: hero 2 колонки без калькулятора в hero (калькулятор отдельной секцией)
  
Sidebar дашбордов:
  < 1024px: sidebar скрыт, открывается через hamburger
  Drawer с backdrop overlay

Таблицы:
  < 768px: карточный вид вместо таблицы, горизонтальный scroll для критических таблиц
  
Калькулятор:
  100% ширины на мобильном
```

---

## 11. Страница входа пользователя (OTP-flow)

```
Центрированный layout, --color-silver фон

Шаг 1 — Ввод телефона:
  Card (max-width: 400px):
    «Вход в личный кабинет»
    Input: «Номер телефона» (placeholder: +353...)
    Btn-primary «Получить код»

Шаг 2 — Подтверждение кода:
  Card:
    «Введите код из SMS»
    «Код отправлен на +7XX XXX XX XX»
    OTP-input: 6 отдельных ячеек (tab-через-ячейки при вводе)
    Btn-primary «Подтвердить»
    Текст: «Не получили код? Отправить снова» (таймер 60 сек)

Mock-UI:
  Жёлтый informational banner внизу карточки:
  ⚠ «Учебный режим. SMS не отправляется. Тестовый код: XXXXXX»
  Код возвращается из backend в поле ответа (только для dev)
```

---

## 12. Форма заявки (публичная, `/apply`)

```
Stepper (3 шага) горизонтальный:
  1. Тип заявителя → 2. Данные и параметры → 3. Подтверждение

Шаг 1:
  Radio-cards: «Физическое лицо» | «Бизнес»
  Каждая карточка-кнопка: иконка + заголовок + описание

Шаг 2 (физлицо):
  Имя, Фамилия
  Дата рождения
  Email, Телефон
  Сумма займа (select или input с валидацией 500–50000)
  Срок (select или input 7–90 дней)
  Расчёт итоговой суммы — мини-preview
  Checkbox согласия с условиями

Шаг 2 (бизнес):
  Название компании, Регистрационный номер
  Имя представителя, Должность
  Email, Телефон
  Сумма, Срок
  Checkbox согласия

Шаг 3:
  Сводка данных (read-only)
  Итоговые условия займа
  Btn «Отправить заявку» с loading-состоянием
  
Успех:
  Зелёная иконка + «Заявка принята»
  Номер заявки (mono)
  «Мы уведомим вас о статусе» + «Перейти в личный кабинет»

Ошибка:
  Banner: «Не удалось отправить заявку. [Описание ошибки].»
```

---

## 13. Mock-маркировка в интерфейсе

Следующие элементы должны иметь визуальную пометку о том, что это имитация:

```
[Mock SMS banner] — жёлтый, на страницах OTP-входа и подписания
[Mock Contract] — при просмотре договора показывать плашку «Это учебный документ»
[Mock Payment] — при подтверждении платежа нет реального перевода

Стиль badge-mock:
  background: #FFFBCC; border: 1px solid #E6D200; color: #5A4800;
  padding: 8px 16px; border-radius: var(--radius-md);
  «⚠ Учебный режим — [пояснение]»
```

---

## 14. Feature Sliced Design — структура директорий frontend

```
src/
├── app/                    # Next.js App Router, layouts, pages
│   ├── (public)/           # Публичный сайт
│   │   ├── page.tsx        # Главная
│   │   ├── how-it-works/
│   │   ├── business/
│   │   ├── faq/
│   │   ├── contacts/
│   │   ├── apply/
│   │   └── legal/          # Юридические страницы
│   ├── (cabinet)/          # Личный кабинет
│   │   ├── login/
│   │   └── cabinet/
│   │       ├── applications/
│   │       ├── loans/
│   │       └── notifications/
│   └── (admin)/            # Административная панель
│       ├── admin/login/
│       └── admin/
│           ├── applications/
│           ├── clients/
│           ├── loans/
│           ├── payments/
│           └── notifications/
│
├── features/               # Бизнес-фичи
│   ├── loan-calculator/
│   ├── application-form/
│   ├── auth-otp/
│   ├── loan-signing/
│   ├── payment-request/
│   └── admin-status-change/
│
├── entities/               # Доменные сущности
│   ├── loan/
│   ├── application/
│   ├── payment/
│   ├── notification/
│   └── user/
│
├── shared/
│   ├── ui/                 # Атомарные компоненты (Button, Input, Badge, Card...)
│   ├── lib/                # Утилиты, форматирование сумм, дат
│   ├── config/             # ENV, константы (API_URL, ставки)
│   └── types/              # Общие TypeScript-типы
│
└── widgets/                # Составные UI-блоки
    ├── header/
    ├── footer/
    ├── sidebar/
    └── loan-card/
```

---

## 15. Константы и бизнес-логика

```typescript
// shared/config/loan.ts
export const LOAN_CONFIG = {
  personal: {
    minAmount: 500,
    maxAmount: 50_000,
    minDays: 7,
    maxDays: 90,
    dailyRate: 0.008, // 0.8% в день
  },
  business: {
    minAmount: 30_000,
    maxAmount: 500_000,
    minMonths: 1,
    maxMonths: 12,
  },
} as const;

// Формула аннуитетного платежа
export function calcAnnuity(P: number, r: number, n: number) {
  const payment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = payment * n;
  return { payment, total };
}

// Пример использования:
// calcAnnuity(10000, 0.008, 30)
```

---

## 16. Переменные окружения

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/lumenbridge
JWT_SECRET=учебный-секрет-не-для-прода
ADMIN_SEED_PASSWORD=admin123
OPERATOR_SEED_PASSWORD=operator123
PORT=3001
NODE_ENV=development
```

---

## 17. Дополнительные правила для AI-агентов

1. **Цвет accent `#2E7DF7` применять только для интерактивных элементов** — кнопки, ссылки, слайдеры, фокус-кольца. Не использовать как декоративный.

2. **DM Serif Display — только для hero-заголовков** H1 на публичных страницах и логотипа. Всё остальное — Inter.

3. **JetBrains Mono — только для денежных сумм и дат** в таблицах/карточках.

4. **Статусные badge** — использовать строго по цветовому коду из п. 5.4. Не изобретать новые цвета.

5. **Калькулятор** — результат обновляется немедленно при движении слайдера (без дебаунса на UI), debounce только для API-вызовов если они есть.

6. **Формы** — все поля валидируются через React Hook Form + Valibot. Ошибки показываются под полем, не в виде alert.

7. **Loading states** — всегда использовать skeleton, не spinner, для секций с данными.

8. **Мобильный sidebar** — закрывать при клике по overlay и при навигации.

9. **Gold-акцент `#C9923A`** — только на бизнес-странице и связанных с ней элементах. На остальных страницах не использовать.

10. **Mock-блоки** — жёлтый banner с ⚠ обязателен на всех страницах с имитируемой функциональностью (OTP, договор, платёж).

---

## 18. Стек и технические ограничения

### 18.1 Фиксированный стек — не менять

| Слой | Технология |
|---|---|
| Frontend framework | Next.js (App Router) |
| Frontend язык | TypeScript (строгий режим) |
| Frontend стили | Tailwind CSS v4 |
| Frontend формы | React Hook Form + Valibot |
| Frontend архитектура | Feature-Sliced Design (FSD) |
| Backend framework | NestJS (Node.js) |
| База данных | PostgreSQL |
| ORM | TypeORM или Prisma (на выбор, но один, не оба) |

### 18.2 Жёсткие технические требования

- Клиентская валидация (Valibot) — обязательна для всех форм.
- Серверная валидация (NestJS `class-validator` или Zod) — обязательна независимо от клиентской.
- Frontend и backend соединены через HTTP; `NEXT_PUBLIC_API_URL` — переменная окружения, не хардкод.
- CORS настроен на backend: разрешён origin frontend (localhost:3000 по умолчанию).
- ЛК и админ-панель работают с данными backend — никаких изолированных mock-массивов в компонентах.
- Все изменения статусов персистентны — сохраняются в БД и переживают перезагрузку страницы.
- Не использовать реальные SMS-провайдеры, платёжные шлюзы, скоринговые API.
- Не хранить реальные персональные данные — тестовые данные в seed.

---

## 19. Схема базы данных

### 19.1 Таблица `users`

```sql
users
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  phone         VARCHAR(20) UNIQUE NOT NULL        -- логин пользователя
  first_name    VARCHAR(100)
  last_name     VARCHAR(100)
  email         VARCHAR(255)
  created_at    TIMESTAMP DEFAULT now()
  updated_at    TIMESTAMP DEFAULT now()
```

### 19.2 Таблица `otp_codes`

```sql
otp_codes
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  phone         VARCHAR(20) NOT NULL
  code          VARCHAR(10) NOT NULL               -- mock-код, не отправляется реально
  purpose       VARCHAR(50) NOT NULL               -- 'login' | 'sign_loan'
  loan_id       UUID REFERENCES loans(id)          -- NULL для 'login', заполнен для 'sign_loan'
  expires_at    TIMESTAMP NOT NULL                 -- now() + 10 минут
  used          BOOLEAN DEFAULT false
  created_at    TIMESTAMP DEFAULT now()
```

### 19.3 Таблица `applications`

```sql
applications
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id       UUID REFERENCES users(id)          -- NULL если подаётся до регистрации
  type          VARCHAR(20) NOT NULL               -- 'personal' | 'business'
  amount        DECIMAL(12,2) NOT NULL
  term_days     INTEGER NOT NULL                   -- для personal: 7–90 дней
  term_months   INTEGER                            -- для business: 1–12 мес.
  status        VARCHAR(30) NOT NULL DEFAULT 'new' -- см. 19.3.1
  -- Данные физлица
  first_name    VARCHAR(100)
  last_name     VARCHAR(100)
  date_of_birth DATE
  email         VARCHAR(255)
  phone         VARCHAR(20)
  -- Данные бизнеса
  company_name  VARCHAR(255)
  reg_number    VARCHAR(100)
  rep_name      VARCHAR(200)
  rep_position  VARCHAR(100)
  -- Служебные
  comment       TEXT                               -- комментарий оператора
  created_at    TIMESTAMP DEFAULT now()
  updated_at    TIMESTAMP DEFAULT now()
```

#### 19.3.1 Статусы заявки

```
new          — только что создана, ждёт оператора
in_review    — оператор взял в работу
approved     — одобрена, создаётся займ
rejected     — отклонена
```

### 19.4 Таблица `loans`

```sql
loans
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
  application_id    UUID REFERENCES applications(id) UNIQUE
  user_id           UUID REFERENCES users(id)
  amount            DECIMAL(12,2) NOT NULL
  term_days         INTEGER NOT NULL
  daily_rate        DECIMAL(8,6) NOT NULL DEFAULT 0.008
  daily_payment     DECIMAL(12,2) NOT NULL        -- A из формулы
  total_repayment   DECIMAL(12,2) NOT NULL        -- Total = A × n
  status            VARCHAR(30) NOT NULL DEFAULT 'pending_signing'  -- см. 19.4.1
  -- Данные подписания
  signed_at         TIMESTAMP
  signed_ip         VARCHAR(45)
  signed_user_agent TEXT
  -- Даты
  issued_at         TIMESTAMP                     -- дата после подписания
  closed_at         TIMESTAMP
  created_at        TIMESTAMP DEFAULT now()
  updated_at        TIMESTAMP DEFAULT now()
```

#### 19.4.1 Статусы займа

```
pending_signing  — ожидает подписания пользователем (после одобрения заявки)
active           — подписан, выдан, есть график платежей
overdue          — есть просроченные платежи
closed           — полностью погашен
```

### 19.5 Таблица `payment_schedule`

```sql
payment_schedule
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  loan_id       UUID REFERENCES loans(id)
  seq           INTEGER NOT NULL                  -- порядковый номер (1, 2, ...)
  due_date      DATE NOT NULL
  amount        DECIMAL(12,2) NOT NULL
  status        VARCHAR(20) NOT NULL DEFAULT 'pending'  -- 'pending' | 'paid' | 'overdue'
  paid_at       TIMESTAMP
  created_at    TIMESTAMP DEFAULT now()
  updated_at    TIMESTAMP DEFAULT now()

  UNIQUE (loan_id, seq)
```

### 19.6 Таблица `payments`

```sql
payments
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  loan_id       UUID REFERENCES loans(id)
  amount        DECIMAL(12,2) NOT NULL
  recorded_at   TIMESTAMP NOT NULL               -- когда оператор зафиксировал
  recorded_by   UUID REFERENCES admin_users(id)
  note          TEXT
  created_at    TIMESTAMP DEFAULT now()
```

### 19.7 Таблица `payment_requests`

Заявки на оплату от пользователей (ручная проверка оператором).

```sql
payment_requests
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  loan_id       UUID REFERENCES loans(id)
  user_id       UUID REFERENCES users(id)
  amount        DECIMAL(12,2) NOT NULL
  reference     TEXT NOT NULL                    -- реквизиты или номер перевода от пользователя
  status        VARCHAR(20) NOT NULL DEFAULT 'pending'  -- 'pending' | 'confirmed' | 'rejected'
  reviewed_by   UUID REFERENCES admin_users(id)
  reviewed_at   TIMESTAMP
  created_at    TIMESTAMP DEFAULT now()
  updated_at    TIMESTAMP DEFAULT now()
```

### 19.8 Таблица `notifications`

```sql
notifications
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id       UUID REFERENCES users(id)
  type          VARCHAR(50) NOT NULL             -- см. 19.8.1
  title         VARCHAR(255) NOT NULL
  body          TEXT
  is_read       BOOLEAN DEFAULT false
  related_id    UUID                             -- id заявки или займа (опционально)
  created_at    TIMESTAMP DEFAULT now()
```

#### 19.8.1 Типы уведомлений

```
application_approved   — заявка одобрена
application_rejected   — заявка отклонена
loan_pending_signing   — займ ожидает подписания
loan_signed            — займ подписан, выдан
payment_confirmed      — платёж подтверждён
payment_rejected       — заявка на оплату отклонена
payment_overdue        — просрочка платежа
loan_closed            — займ закрыт
```

### 19.9 Таблица `admin_users`

```sql
admin_users
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  login         VARCHAR(100) UNIQUE NOT NULL
  password_hash VARCHAR(255) NOT NULL            -- bcrypt
  role          VARCHAR(20) NOT NULL             -- 'admin' | 'operator'
  created_at    TIMESTAMP DEFAULT now()
```

### 19.10 Seed-данные

```sql
-- Тестовые аккаунты (создаются при миграции/seed)
INSERT INTO admin_users (login, password_hash, role) VALUES
  ('admin',    bcrypt('admin123'),    'admin'),
  ('operator', bcrypt('operator123'), 'operator');
```

---

## 20. API-контракты

Базовый URL: `NEXT_PUBLIC_API_URL` (по умолчанию `http://localhost:3001`).

Все ответы — JSON. Ошибки возвращают `{ message: string, statusCode: number }`.

Авторизация: JWT Bearer-токен в заголовке `Authorization: Bearer <token>`.

### 20.1 Аутентификация пользователя (OTP)

```
POST /auth/otp/request
Body: { phone: string }
Response 200: { mockCode: string }   -- только в NODE_ENV=development
Response 400: ошибка валидации

POST /auth/otp/verify
Body: { phone: string, code: string }
Response 200: { accessToken: string, user: UserDto }
Response 401: неверный или просроченный код
```

### 20.2 Аутентификация администратора

```
POST /auth/admin/login
Body: { login: string, password: string }
Response 200: { accessToken: string, admin: AdminDto }
Response 401: неверные данные
```

### 20.3 Заявки (публичная подача)

```
POST /applications
Auth: не требуется (публичный endpoint)
Body: ApplicationCreateDto (см. 20.3.1)
Response 201: { id: string, status: 'new' }
Response 400: ошибки валидации
Response 422: бизнес-ошибка (напр., сумма вне диапазона)
```

#### 20.3.1 ApplicationCreateDto

```typescript
{
  type: 'personal' | 'business';
  amount: number;          // personal: 500–50000, business: 30000–500000
  termDays?: number;       // personal: 7–90
  termMonths?: number;     // business: 1–12
  // personal fields
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;    // ISO date
  email?: string;
  phone: string;           // обязательно для всех
  // business fields
  companyName?: string;
  regNumber?: string;
  repName?: string;
  repPosition?: string;
}
```

### 20.4 Личный кабинет — заявки

```
GET /cabinet/applications
Auth: User JWT
Response 200: ApplicationDto[]

GET /cabinet/applications/:id
Auth: User JWT
Response 200: ApplicationDto
Response 403: не принадлежит пользователю
```

### 20.5 Личный кабинет — займы

```
GET /cabinet/loans
Auth: User JWT
Response 200: { active: LoanDto[], closed: LoanDto[] }

GET /cabinet/loans/:id
Auth: User JWT
Response 200: LoanDetailDto  -- включает schedule[]

POST /cabinet/loans/:id/sign
Auth: User JWT
Body: { code: string }
Response 200: LoanDetailDto
Response 401: неверный OTP
Response 409: уже подписан
```

### 20.6 Личный кабинет — подписание (запрос OTP)

```
POST /cabinet/loans/:id/sign/request
Auth: User JWT
Response 200: { mockCode: string }  -- только в development
Response 409: займ не в статусе pending_signing
```

### 20.7 Личный кабинет — заявки на оплату

```
POST /cabinet/payment-requests
Auth: User JWT
Body: { loanId: string, amount: number, reference: string }
Response 201: PaymentRequestDto

GET /cabinet/payment-requests
Auth: User JWT
Response 200: PaymentRequestDto[]
```

### 20.8 Личный кабинет — уведомления

```
GET /cabinet/notifications
Auth: User JWT
Response 200: NotificationDto[]

PATCH /cabinet/notifications/:id/read
Auth: User JWT
Response 200: { success: true }
```

### 20.9 Административные — заявки

```
GET /admin/applications
Auth: Admin JWT
Query: ?status=new|in_review|approved|rejected&search=string&page=1&limit=20
Response 200: PaginatedDto<ApplicationDto>

GET /admin/applications/:id
Auth: Admin JWT
Response 200: ApplicationDetailDto

PATCH /admin/applications/:id/status
Auth: Admin JWT (operator+)
Body: { status: 'in_review' | 'approved' | 'rejected', comment?: string }
Response 200: ApplicationDto
-- При approved: автоматически создаётся займ (status: pending_signing)
--              и уведомление пользователю (loan_pending_signing)
-- При rejected: уведомление пользователю (application_rejected)
```

### 20.10 Административные — клиенты

```
GET /admin/clients
Auth: Admin JWT
Query: ?search=string&page=1&limit=20
Response 200: PaginatedDto<ClientDto>

GET /admin/clients/:id
Auth: Admin JWT
Response 200: ClientDetailDto   -- включает applications[], loans[], payments[]
```

### 20.11 Административные — займы

```
GET /admin/loans
Auth: Admin JWT
Query: ?status=active|closed&page=1&limit=20
Response 200: PaginatedDto<LoanDto>

GET /admin/loans/:id
Auth: Admin JWT
Response 200: LoanDetailDto    -- включает schedule[], payments[]

PATCH /admin/loans/:id/status
Auth: Admin JWT (operator+)
Body: { status: 'active' | 'overdue' | 'closed' }
Response 200: LoanDto

POST /admin/loans/:id/payments
Auth: Admin JWT (admin only)
Body: { amount: number, note?: string }
Response 200: LoanDetailDto    -- с пересчитанным schedule
```

### 20.12 Административные — платежи

```
GET /admin/payment-requests
Auth: Admin JWT
Query: ?status=pending|confirmed|rejected&page=1&limit=20
Response 200: PaginatedDto<PaymentRequestDto>

PATCH /admin/payment-requests/:id
Auth: Admin JWT (operator+)
Body: { status: 'confirmed' | 'rejected' }
Response 200: PaymentRequestDto
```

### 20.13 Административные — уведомления

```
GET /admin/notifications
Auth: Admin JWT
Response 200: SystemNotificationDto[]   -- агрегированные системные события
```

### 20.14 Типы DTO

```typescript
// ApplicationDto
{
  id: string;
  type: 'personal' | 'business';
  amount: number;
  termDays?: number;
  termMonths?: number;
  status: 'new' | 'in_review' | 'approved' | 'rejected';
  phone: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  comment?: string;
  createdAt: string;
}

// LoanDto
{
  id: string;
  applicationId: string;
  amount: number;
  termDays: number;
  dailyRate: number;
  dailyPayment: number;
  totalRepayment: number;
  status: 'pending_signing' | 'active' | 'overdue' | 'closed';
  issuedAt?: string;
  closedAt?: string;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

// LoanDetailDto extends LoanDto
{
  schedule: ScheduleItemDto[];
  payments: PaymentDto[];
  signedAt?: string;
}

// ScheduleItemDto
{
  id: string;
  seq: number;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: string;
}

// PaymentRequestDto
{
  id: string;
  loanId: string;
  amount: number;
  reference: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
}

// NotificationDto
{
  id: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

// PaginatedDto<T>
{
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

---

## 21. Бизнес-логика — детальные сценарии

### 21.1 Полный путь заявки

```
[Пользователь] Заполняет форму на /apply
  → POST /applications
  → Запись в applications (status: 'new')
  → Создание/привязка user по phone
  → Уведомление не создаётся (заявка ещё не рассмотрена)

[Оператор] Видит заявку в /admin/applications
  → PATCH /admin/applications/:id/status { status: 'in_review' }
  → status → 'in_review'

[Оператор] Одобряет заявку
  → PATCH /admin/applications/:id/status { status: 'approved' }
  → status → 'approved'
  → АВТОМАТИЧЕСКИ: создаётся loans (status: 'pending_signing')
  → АВТОМАТИЧЕСКИ: создаётся notification(user, 'loan_pending_signing')
  → АВТОМАТИЧЕСКИ: создаётся notification(user, 'application_approved')

[Пользователь] Видит займ в ЛК со статусом «Ожидает подписания»
  → POST /cabinet/loans/:id/sign/request
  → Backend генерирует OTP-код, сохраняет в otp_codes
  → Возвращает { mockCode } в development
  → UI показывает mock-banner с кодом

[Пользователь] Вводит OTP-код
  → POST /cabinet/loans/:id/sign { code }
  → Backend проверяет otp_codes: code совпадает, не просрочен, не использован
  → Сохраняет: signed_at, signed_ip, signed_user_agent
  → Помечает OTP-код как used
  → Меняет status займа: 'active'
  → АВТОМАТИЧЕСКИ: создаёт payment_schedule (см. 21.2)
  → АВТОМАТИЧЕСКИ: создаёт notification(user, 'loan_signed')

[Пользователь] Хочет внести платёж
  → POST /cabinet/payment-requests { loanId, amount, reference }
  → Создаётся payment_request (status: 'pending')
  → Появляется в /admin/payment-requests

[Оператор] Проверяет заявку на оплату
  → PATCH /admin/payment-requests/:id { status: 'confirmed' | 'rejected' }
  → При confirmed: уведомление пользователю 'payment_confirmed'
  → При rejected: уведомление пользователю 'payment_rejected'

[Администратор] Фиксирует реальный платёж вручную
  → POST /admin/loans/:id/payments { amount, note }
  → Создаётся запись в payments
  → Вызывается пересчёт schedule (см. 21.3)
  → Если займ полностью погашен: status → 'closed', closed_at = now()
  → Уведомление пользователю 'payment_confirmed'
  → (При закрытии) уведомление пользователю 'loan_closed'
```

### 21.2 Создание графика платежей

После подписания займа — автоматически, на backend:

```typescript
function buildPaymentSchedule(loan: Loan): ScheduleItem[] {
  const { amount, termDays, dailyPayment, issuedAt } = loan;
  const schedule: ScheduleItem[] = [];

  for (let i = 1; i <= termDays; i++) {
    const dueDate = addDays(issuedAt, i);
    schedule.push({
      seq: i,
      dueDate,
      amount: dailyPayment,  // A из аннуитетной формулы
      status: 'pending',
    });
  }
  return schedule;
}
```

Все записи сохраняются в `payment_schedule` одной транзакцией.

### 21.3 Пересчёт графика после платежа

При `POST /admin/loans/:id/payments { amount }`:

```
1. Найти ближайший unpaid платёж в schedule (минимальный seq со status='pending')
2. Если amount >= amount_of_nearest_payment:
   a. Погасить ближайший платёж: status → 'paid', paid_at → now()
   b. Остаток = amount - amount_of_nearest_payment
   c. Если остаток > 0: рекурсивно применить к следующему платежу
3. Если amount < amount_of_nearest_payment:
   a. Уменьшить amount ближайшего платежа на внесённую сумму
   b. (Частичное погашение — платёж остаётся pending с новой суммой)
4. Если все платежи status='paid': закрыть займ
```

### 21.4 IP и User-Agent при подписании

В endpoint `POST /cabinet/loans/:id/sign`:

```typescript
// NestJS controller
async signLoan(
  @Param('id') loanId: string,
  @Body() dto: SignLoanDto,
  @Req() req: Request,
  @CurrentUser() user: User,
) {
  const ip = req.ip || req.headers['x-forwarded-for']?.toString();
  const userAgent = req.headers['user-agent'];

  return this.loansService.signLoan(loanId, dto.code, user.id, ip, userAgent);
}
```

Поля `signed_ip` и `signed_user_agent` сохраняются в таблице `loans`.

### 21.5 Ролевая модель (admin vs operator)

```
Действие                                    | admin | operator
--------------------------------------------|-------|----------
Просматривать заявки                        |  ✓    |  ✓
Менять статус заявки (in_review/approved)   |  ✓    |  ✓
Отклонять заявки                            |  ✓    |  ✓
Оставлять комментарии к заявкам             |  ✓    |  ✓
Просматривать клиентов                      |  ✓    |  ✓
Просматривать займы                         |  ✓    |  ✓
Менять статус займа                         |  ✓    |  ✓
Подтверждать/отклонять заявки на оплату     |  ✓    |  ✓
Отмечать просрочки                          |  ✓    |  ✓
ФИКСИРОВАТЬ ПЛАТЁЖ (POST /admin/loans/:id/payments) | ✓ | ✗
Управлять учётными записями admin_users     |  ✓    |  ✗
```

Реализуется через NestJS Guard + декоратор `@Roles('admin')`.

### 21.6 OTP-flow (mock)

```
Backend при POST /auth/otp/request:
  1. Генерировать 6-значный числовой код (Math.random)
  2. Сохранить в otp_codes: { phone, code, purpose: 'login', expires_at: now()+10min }
  3. В production: отправить SMS (не реализовано)
  4. В development (NODE_ENV=development): вернуть { mockCode: code } в ответе

Backend при POST /auth/otp/verify:
  1. Найти актуальную запись: phone совпадает, used=false, expires_at > now()
  2. Проверить code
  3. Пометить used=true
  4. Найти или создать user по phone
  5. Вернуть JWT accessToken

Frontend mock-UI:
  Показывать yellow banner: «⚠ Учебный режим. SMS не отправляется. Код: {mockCode}»
  Поле OTP заполнять можно вручную — autofill из mockCode не делать
```

---

## 22. Структура backend (NestJS)

```
backend/
├── src/
│   ├── main.ts                   -- bootstrap, CORS, prefix '/api'
│   ├── app.module.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts    -- /auth/otp/request, /auth/otp/verify, /auth/admin/login
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts       -- отдельные стратегии для user и admin
│   │   │   └── roles.guard.ts
│   │   │
│   │   ├── applications/
│   │   │   ├── applications.module.ts
│   │   │   ├── applications.controller.ts  -- публичный POST + admin GET/PATCH
│   │   │   ├── applications.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── loans/
│   │   │   ├── loans.module.ts
│   │   │   ├── loans.controller.ts         -- cabinet + admin endpoints
│   │   │   ├── loans.service.ts
│   │   │   ├── payment-schedule.service.ts -- buildSchedule(), recalculate()
│   │   │   └── dto/
│   │   │
│   │   ├── payments/
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.controller.ts      -- payment-requests cabinet+admin
│   │   │   └── payments.service.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   └── notifications.service.ts    -- createNotification() вызывается из других сервисов
│   │   │
│   │   ├── clients/
│   │   │   └── clients.controller.ts       -- admin GET /admin/clients
│   │   │
│   │   └── admin/
│   │       └── admin-notifications.controller.ts
│   │
│   ├── entities/                 -- TypeORM / Prisma schema
│   │   ├── user.entity.ts
│   │   ├── otp-code.entity.ts
│   │   ├── application.entity.ts
│   │   ├── loan.entity.ts
│   │   ├── payment-schedule.entity.ts
│   │   ├── payment.entity.ts
│   │   ├── payment-request.entity.ts
│   │   ├── notification.entity.ts
│   │   └── admin-user.entity.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   │
│   └── database/
│       ├── database.module.ts
│       └── seed.ts               -- создаёт admin/operator при первом запуске
│
├── .env
├── .env.example
└── package.json
```

### 22.1 Конфигурация CORS

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
app.setGlobalPrefix('api');
```

### 22.2 JWT

```typescript
// Два типа токенов: user и admin
// Payload user: { sub: userId, type: 'user' }
// Payload admin: { sub: adminId, role: 'admin'|'operator', type: 'admin' }

// Срок жизни токена: 24 часа (учебный MVP)
```

---

## 23. Валидация — правила

### 23.1 Форма заявки (frontend, Valibot)

```typescript
// personal
{
  type: literal('personal'),
  firstName: string([minLength(2), maxLength(100)]),
  lastName: string([minLength(2), maxLength(100)]),
  dateOfBirth: string([isoDate()]),  // не моложе 18 лет
  email: string([email()]),
  phone: string([regex(/^\+[1-9]\d{6,14}$/)]),
  amount: number([minValue(500), maxValue(50000)]),
  termDays: number([minValue(7), maxValue(90)]),
  consent: literal(true),
}

// business
{
  type: literal('business'),
  companyName: string([minLength(2), maxLength(255)]),
  regNumber: string([minLength(2), maxLength(100)]),
  repName: string([minLength(2), maxLength(200)]),
  repPosition: string([minLength(2), maxLength(100)]),
  email: string([email()]),
  phone: string([regex(/^\+[1-9]\d{6,14}$/)]),
  amount: number([minValue(30000), maxValue(500000)]),
  termMonths: number([minValue(1), maxValue(12)]),
  consent: literal(true),
}
```

### 23.2 Серверная валидация (NestJS, class-validator)

```typescript
// Те же ограничения, что и на клиенте — независимо
@IsIn(['personal', 'business'])
@IsNumber() @Min(500) @Max(50000)   // для personal
@IsPhoneNumber()                     // E.164 формат
// и т.д.
```

### 23.3 Что НЕ валидировать на сервере как ошибку

- Дубликат заявки от того же пользователя — разрешить (один пользователь может подать несколько заявок).
- Проверку кредитной истории — не реализовывать (учебный MVP).

---

## 24. Документация проекта (обязательные файлы)

Каждый файл должен существовать в корне репозитория и содержать указанное:

### README.md (обязателен)

```
# LumenBridge Finance — MVP

## Описание
Краткое описание проекта: учебный финансовый сервис, fullstack MVP.

## Стек
Перечисление технологий (Next.js, NestJS, PostgreSQL и т.д.)

## Структура репозитория
frontend/ — Next.js
backend/  — NestJS

## Установка и запуск

### Требования
Node.js >= 18, PostgreSQL >= 14

### Backend
cd backend
cp .env.example .env
# Заполнить DATABASE_URL в .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev   # запускается на :3001

### Frontend
cd frontend
cp .env.local.example .env.local
npm install
npm run dev         # запускается на :3000

## Калькулятор — формула
A = P × (r × (1 + r)^n) / ((1 + r)^n − 1)
где P — сумма, r = 0.008 (0.8%/день), n — срок в днях
Total = A × n

## Mock OTP
SMS не отправляется. Код возвращается в ответе API (только development).
На странице входа и подписания отображается yellow-баннер с кодом.

## Тестовые учётные данные
Пользователь: любой номер телефона в формате +353...
Код OTP: отображается в интерфейсе (mock)

Администратор: login=admin, password=admin123
Оператор: login=operator, password=operator123

## Известные ограничения (mock)
- SMS не отправляется (mock OTP)
- Реальные платежи не проводятся
- Договор — заглушка (mock document)
- Скоринг не реализован — все заявки одобряются/отклоняются вручную
```

### TASK.md (обязателен)

```
Описание задания своими словами:
- что нужно было реализовать
- что является MVP-scope, а что выходит за рамки
- что реализовано как mock и почему
```

### PROMPT_PLAN.md (обязателен)

```
Пошаговый план промптов, использованных для разработки:
- какие части генерировались с AI
- порядок генерации (backend → frontend → интеграция → и т.д.)
- какие промпты оказались наиболее эффективными
```

### AI_USAGE.md (обязателен)

```
Честный отчёт об использовании AI:
- какой инструмент использовался
- что было сгенерировано
- что было проверено и исправлено вручную
- что не получилось сделать через AI и почему
```

---

## 25. Git-история — требования

- Минимум 10–15 осмысленных коммитов.
- Каждый коммит — работающее состояние (не ломает сборку).
- Примеры хороших сообщений:
  ```
  feat(backend): add applications module with create endpoint
  feat(frontend): implement loan calculator with annuity formula
  feat(backend): implement OTP auth flow with mock code return
  feat(frontend): add application form with Valibot validation
  feat(backend): implement loan signing with IP/UA capture
  feat(backend): add payment schedule creation after signing
  feat(admin): add application status management
  feat(cabinet): add loan detail view with payment schedule
  fix(backend): recalculate schedule correctly on overpayment
  docs: add README with setup instructions and mock OTP explanation
  ```
- Не делать один коммит «add all files» в конце.

---

## 26. Definition of Done — полный чеклист

Проект принимается, если выполнены **все** пункты:

### Страницы

- [ ] Главная (`/`) — все 13 смысловых блоков из ТЗ
- [ ] Как это работает (`/how-it-works`)
- [ ] Для бизнеса (`/business`)
- [ ] FAQ (`/faq`)
- [ ] Контакты + форма обратной связи (`/contacts`)
- [ ] Политика конфиденциальности (`/privacy`)
- [ ] Cookie Policy (`/cookies`)
- [ ] Условия использования (`/terms`)
- [ ] Credit Policy (`/credit-policy`)
- [ ] AML/KYC Policy (`/aml-kyc`)
- [ ] Вход пользователя (OTP, `/login`)
- [ ] Вход администратора (`/admin/login`)
- [ ] Личный кабинет — заявки (`/cabinet/applications`)
- [ ] Личный кабинет — займы (`/cabinet/loans`)
- [ ] Личный кабинет — карточка займа (`/cabinet/loans/:id`)
- [ ] Личный кабинет — уведомления (`/cabinet/notifications`)
- [ ] Админ — заявки (`/admin/applications`)
- [ ] Админ — клиенты (`/admin/clients`)
- [ ] Админ — займы (`/admin/loans`)
- [ ] Админ — платежи (`/admin/payments`)
- [ ] Админ — уведомления (`/admin/notifications`)
- [ ] Все страницы адаптивны (не ломаются на 375px)

### Функциональность

- [ ] Калькулятор использует формулу аннуитета с r=0.008
- [ ] Калькулятор показывает ежедневный платёж и итоговую сумму
- [ ] Форма заявки: физлицо и бизнес (два варианта)
- [ ] Форма заявки: клиентская валидация через Valibot
- [ ] Форма заявки: loading-состояние при отправке
- [ ] Форма заявки: отображение номера заявки после успеха
- [ ] OTP-вход пользователя: запрос кода + подтверждение
- [ ] Mock-код отображается в интерфейсе (dev-режим)
- [ ] ЛК создаётся при первой заявке
- [ ] ЛК — список заявок со статусами
- [ ] ЛК — активные и закрытые займы
- [ ] ЛК — карточка займа: параметры + график платежей
- [ ] Подписание займа через OTP (отдельный flow)
- [ ] signed_at, signed_ip, signed_user_agent сохраняются в БД
- [ ] График платежей создаётся автоматически после подписания
- [ ] ЛК — заявка на оплату: форма с суммой и reference
- [ ] ЛК — статус заявки на оплату виден пользователю
- [ ] ЛК — просмотр договора (mock/заглушка)
- [ ] ЛК — уведомления о ключевых событиях
- [ ] Новая заявка появляется в админ-панели
- [ ] Оператор: взять в работу / одобрить / отклонить заявку
- [ ] Оператор: оставить комментарий к заявке
- [ ] Оператор: просматривать клиентов и их карточки
- [ ] Оператор: управлять займами, менять статус
- [ ] Оператор: подтверждать/отклонять заявки на оплату
- [ ] Оператор: отмечать просрочки
- [ ] Администратор: фиксировать платёж вручную
- [ ] График пересчитывается при переплате
- [ ] Закрытые займы переходят в историю
- [ ] Все изменения в ЛК сохраняются после перезагрузки страницы

### Технические требования

- [ ] Серверная валидация независима от клиентской
- [ ] CORS настроен
- [ ] API URL в переменной окружения
- [ ] ЛК и админ работают с данными backend (не mock-массивы)
- [ ] JWT-авторизация для ЛК и admin
- [ ] Ролевая модель admin/operator работает корректно
- [ ] Loading / empty / error states во всех разделах дашбордов
- [ ] Скелетон-анимация вместо спиннера
- [ ] PostgreSQL (не SQLite, не in-memory)

### Документация

- [ ] README.md с установкой, запуском, формулой, mock-описанием, тестовыми данными
- [ ] .env.example в backend
- [ ] .env.local.example в frontend

---

## 27. Что строго запрещено

- **Не подключать реальные SMS-провайдеры** (Twilio, AWS SNS и т.д.)
- **Не подключать реальные платёжные шлюзы** (Stripe, PayPal и т.д.)
- **Не подключать внешние скоринговые API**
- **Не хранить реальные персональные данные** в seed или тестовых данных
- **Не расширять scope** — добавлять функции, не описанные в этом файле, без явного согласования
- **Не использовать изолированные mock-массивы в компонентах** вместо реальных API-запросов для ЛК и администратора
- **Не делать SQLite или in-memory хранение** — только PostgreSQL
- **Не хардкодить URL backend** — только через переменную окружения
- **Не пропускать серверную валидацию** — даже если клиентская уже проверила
