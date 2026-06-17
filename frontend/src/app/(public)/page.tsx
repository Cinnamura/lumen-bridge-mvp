import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LoanCalculator } from '@/features/loan-calculator/LoanCalculator';
import { HomeClient } from './HomeClient';
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock,
  Lock,
  FileText,
  Zap,
  RefreshCw,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Building2,
} from 'lucide-react';

const conditions = [
  { label: 'Сумма', value: 'От 500 до 50,000 EUR', tone: 'blue' },
  { label: 'Срок', value: 'От 7 до 90 дней', tone: 'violet' },
  { label: 'Процентная ставка', value: 'Определяется индивидуально', tone: 'amber' },
  { label: 'Погашение', value: 'Равными платежами', tone: 'emerald' },
];

const useCases = [
  { icon: Zap, title: 'Срочные расходы', description: 'Неожиданные платежи, которые нельзя перенести', tone: 'blue' },
  { icon: Clock, title: 'Задержка дохода', description: 'Когда деньги нужны сейчас, а поступления позже', tone: 'amber' },
  { icon: Building2, title: 'Бизнес-задачи', description: 'Кассовые разрывы или операционные расходы', tone: 'violet' },
  { icon: RefreshCw, title: 'Возможности', description: 'Ситуации, где важно действовать без промедления', tone: 'emerald' },
];

const trustPoints = [
  { icon: Shield, title: 'Соответствие требованиям GDPR' },
  { icon: CheckCircle2, title: 'Ответственный подход к проверке заявок' },
  { icon: Lock, title: 'Защита персональных данных' },
  { icon: FileText, title: 'Чёткие и понятные условия' },
];

const processSteps = [
  { step: '01', title: 'Регистрация', text: 'Введите номер телефона и подтвердите его с помощью SMS-кода.' },
  { step: '02', title: 'Заявка', text: 'Выберите сумму и срок займа и отправьте заявку на рассмотрение.' },
  { step: '03', title: 'Получение средств', text: 'После одобрения деньги поступают на ваш банковский счёт.' },
];

const transparencyPoints = [
  { title: 'Никаких скрытых комиссий', text: 'Полная стоимость займа известна до оформления' },
  { title: 'Быстрое рассмотрение', text: 'Заявки обрабатываются в течение нескольких минут' },
  { title: 'Безопасность данных', text: 'Ваши данные защищены современными технологиями' },
  { title: 'Гибкое погашение', text: 'Выбирайте удобный срок и погашайте без лишнего давления' },
  { title: 'Улучшение условий со временем', text: 'При повторных займах могут быть доступны более выгодные параметры и увеличенный лимит' },
];

const companyParagraphs = [
  'LumenBridge Finance Ltd — финансовая организация, предоставляющая быстрые и доступные решения в сфере кредитования в Европе.',
  'Наша цель — упростить доступ к финансированию за счёт прозрачных условий и современных технологий.',
  'Мы работаем в соответствии с действующим законодательством и уделяем особое внимание защите данных клиентов и ответственному кредитованию.',
];

const PremiumFintechEuroCoin = dynamic(() => import('@/shared/ui/animations/PremiumFintechEuroCoin'), { ssr: false });

function toneGlow(tone: string): string {
  if (tone === 'emerald') return 'radial-gradient(circle at top right, rgba(16,185,129,0.18), transparent 58%)';
  if (tone === 'amber') return 'radial-gradient(circle at top right, rgba(245,158,11,0.18), transparent 58%)';
  if (tone === 'violet') return 'radial-gradient(circle at top right, rgba(139,92,246,0.18), transparent 58%)';
  return 'radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 58%)';
}

export default function HomePage() {
  return (
    <>
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(4.75rem,8vw,6rem) 24px 2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 36%, rgba(59,130,246,0.16), transparent 32%), radial-gradient(circle at 82% 18%, rgba(139,92,246,0.12), transparent 28%), radial-gradient(circle at 72% 82%, rgba(16,185,129,0.08), transparent 24%)' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(360px, 0.95fr)', gap: '1.5rem', alignItems: 'stretch' }}>
            <div className="anim-fade-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.24)', borderRadius: '999px', padding: '0.4rem 0.85rem', marginBottom: '1.5rem' }}>
                <Sparkles size={14} color="#93C5FD" />
                <span style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Быстрые займы в Европе
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4.85rem)', color: '#F8FAFC', lineHeight: 1.02, marginBottom: '1rem', letterSpacing: '-0.04em', maxWidth: '12ch' }}>
                Получите деньги тогда, когда это действительно нужно
              </h1>
              <p style={{ fontSize: '1.0625rem', color: 'rgba(216,227,251,0.82)', lineHeight: 1.8, marginBottom: '0.75rem', maxWidth: '52ch' }}>
                Простые и прозрачные займы для частных лиц и бизнеса в Европе — быстрое решение и безопасное оформление
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(154,164,182,0.9)', lineHeight: 1.75, marginBottom: '1.75rem', maxWidth: '54ch' }}>
                Неожиданные расходы или срочные возможности не должны вас останавливать. Сервис помогает быстро получить финансирование — без сложных процедур и скрытых условий.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <Link href="/apply" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
                  Получить займ <ArrowRight size={16} />
                </Link>
                <Link href="/how-it-works" className="btn btn-secondary btn-lg">
                  Как это работает
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['Без залога', 'Быстрое одобрение', 'Выплата на банковский счёт'].map((item) => (
                  <div key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 0.75rem', borderRadius: '999px', background: 'rgba(18,18,20,0.5)', border: '1px solid rgba(140,144,159,0.18)' }}>
                    <CheckCircle2 size={14} color="#6EE7B7" />
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(216,227,251,0.84)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-calc anim-fade-up-1" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="bento-dark aurora-blue" style={{ padding: '1rem 1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <LoanCalculator dark />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>Условия</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.9rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Основные условия</h2>
            <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, fontSize: '0.9375rem', maxWidth: '50ch', margin: '0 auto' }}>
              Итоговые условия зависят от результатов проверки клиента и предоставленных данных.
            </p>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
            {conditions.map((item, index) => (
              <div key={item.label} className={`surface-card aurora-${item.tone === 'blue' ? 'blue' : item.tone === 'violet' ? 'violet' : item.tone === 'emerald' ? 'emerald' : 'amber'} reveal reveal-${index + 1}`} style={{ backgroundImage: toneGlow(item.tone), backgroundColor: 'transparent' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.75rem' }}>{item.label}</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.45 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <HomeClient section="conditions" />
      </section>

      <section style={{ padding: '56px 24px', background: 'linear-gradient(180deg, rgba(11,15,25,0.18) 0%, rgba(18,18,20,0.32) 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1.15fr)', gap: '2rem', alignItems: 'end', marginBottom: '2rem' }} className="grid-2-resp">
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>Применение</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.8rem)', color: '#F8FAFC', letterSpacing: '-0.03em', lineHeight: 1.08 }}>Когда деньги нужны сейчас</h2>
            </div>
            <p style={{ color: 'rgba(154,164,182,0.9)', lineHeight: 1.75, fontSize: '0.95rem' }}>
              Не все финансовые вопросы можно отложить. Иногда важно принять решение быстро — без сложных процедур и ожиданий.
            </p>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
            {useCases.map(({ icon: Icon, title, description, tone }, index) => (
              <div key={title} className={`surface-card aurora-${tone === 'blue' ? 'blue' : tone === 'violet' ? 'violet' : tone === 'emerald' ? 'emerald' : 'amber'} reveal reveal-${(index % 4) + 1}`}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,41,59,0.72)', border: '1px solid rgba(140,144,159,0.18)', marginBottom: '1rem' }}>
                  <Icon size={20} color={tone === 'violet' ? '#C4B5FD' : tone === 'emerald' ? '#6EE7B7' : tone === 'amber' ? '#FCD34D' : '#93C5FD'} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.45rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(154,164,182,0.88)', lineHeight: 1.65 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Observer for .reveal cards in this section */}
        <HomeClient section="usecases" />
      </section>

      <section style={{ padding: '40px 24px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>Процесс</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.8rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Как всё происходит</h2>
            <p style={{ color: 'rgba(154,164,182,0.92)', lineHeight: 1.75, maxWidth: '60ch', margin: '0 auto' }}>
              Оформление займа занимает всего несколько минут и полностью проходит онлайн, без визитов в офис и сложных процедур.
            </p>
          </div>
          <div className="grid-3-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
            {processSteps.map((item, index) => (
              <div key={item.step} className={`surface-card reveal reveal-${index + 1}`}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#60A5FA', marginBottom: '0.85rem' }}>{item.step}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.45rem' }}>{item.title}</h3>
                <p style={{ color: 'rgba(154,164,182,0.9)', lineHeight: 1.65, fontSize: '0.9rem' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Observer for .reveal cards in this section */}
        <HomeClient section="process" />
      </section>

      <section style={{ padding: '56px 24px', background: 'linear-gradient(180deg, rgba(18,18,20,0.3) 0%, rgba(11,15,25,0.16) 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="card aurora-blue" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>Прозрачность</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.6rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Вы заранее знаете все условия</h2>
              <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75 }}>
                Полная стоимость займа видна до оформления, а ключевые условия не прячутся в дополнительных шагах.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '0.9rem' }}>
              {transparencyPoints.map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '0.7rem', alignItems: 'start' }}>
                  <CheckCircle2 size={16} color="#6EE7B7" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: '#F8FAFC', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.45, marginBottom: '0.2rem' }}>{item.title}</p>
                    <p style={{ color: 'rgba(154,164,182,0.88)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.05fr)', gap: '2rem', alignItems: 'center' }}>
            <div className="surface-card aurora-emerald">
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6EE7B7', marginBottom: '0.65rem' }}>Кредитная история</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.6rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.85rem' }}>
                Займ — это не только деньги сейчас
              </h2>
              <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Своевременное погашение займа помогает улучшить кредитный рейтинг и открывает доступ к более выгодным условиям в будущем.
              </p>
              <div style={{ display: 'grid', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {[
                  'Возможность начать с небольшой суммы',
                  'Формирование положительной кредитной истории',
                  'Формирование положительной кредитной истории',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <CheckCircle2 size={14} color="#6EE7B7" />
                    <span style={{ color: '#E2E8F0', fontSize: '0.875rem' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/apply" className="btn btn-primary" style={{ gap: '8px' }}>
                Начать с небольшого займа <ArrowRight size={15} />
              </Link>
            </div>
            <div className="surface-card aurora-violet">
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4B5FD', marginBottom: '0.65rem' }}>О компании</p>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.6rem,2.4vw,2.3rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.85rem' }}>О LumenBridge Finance Ltd</h3>
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                {companyParagraphs.map((paragraph) => (
                  <p key={paragraph} style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75 }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '44px 24px 48px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="surface-card aurora-violet" style={{ padding: 'clamp(1.5rem,3vw,2.25rem)' }}>
            <div
              className="grid-2-resp"
              style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '2rem', alignItems: 'center' }}
            >
              {/* Left column — content */}
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4B5FD', marginBottom: '0.65rem' }}>Для бизнеса</p>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.8rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.85rem' }}>
                  Финансирование для бизнеса
                </h2>
                <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                  Решения для компаний и предпринимателей, которым важна скорость и предсказуемость.
                </p>
                <div style={{ display: 'grid', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  {[
                    'Займы от 30,000 до 500,000 EUR',
                    'Срок: от 1 до 12 месяцев',
                    'Без залога',
                    'Быстрое рассмотрение',
                    'Подходит для малого и среднего бизнеса',
                  ].map((item) => (
                    <div key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <CheckCircle2 size={14} color="#C4B5FD" />
                      <span style={{ color: '#E2E8F0', fontSize: '0.875rem' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.95rem 1rem', borderRadius: '16px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.22)', marginBottom: '1.25rem' }}>
                  <p style={{ color: 'rgba(216,227,251,0.9)', lineHeight: 1.65, fontSize: '0.875rem' }}>
                    На данный момент заявки принимаются через форму обратной связи. Онлайн-кабинет для бизнеса будет доступен позже.
                  </p>
                </div>
                <Link href="/contacts" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
                  Оставить заявку <ArrowRight size={16} />
                </Link>
              </div>

              {/* Right column — PremiumFintechEuroCoin (hidden on mobile) */}
              <div
                className="business-coin-col"
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(11,15,25,0.7)',
                  border: '1px solid rgba(139,92,246,0.2)',
                }}
              >
                <PremiumFintechEuroCoin className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px', background: 'linear-gradient(180deg, rgba(18,18,20,0.32) 0%, rgba(11,15,25,0.18) 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'var(--f-display)', fontSize: 'clamp(1.8rem,2.8vw,2.5rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '2rem' }}>
            Работаем прозрачно и в рамках закона
          </h2>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem' }}>
            {trustPoints.map(({ icon: Icon, title }, index) => (
              <div key={title} className={`surface-card reveal reveal-${(index % 4) + 1}`}>
                <div style={{ width: '42px', height: '42px', background: 'rgba(30,41,59,0.72)', border: '1px solid rgba(140,144,159,0.18)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <Icon size={18} color="#93C5FD" />
                </div>
                <p style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: '0.35rem', fontSize: '0.95rem' }}>{title}</p>
              </div>
            ))}
          </div>
        </div>
        <HomeClient section="compliance" />
      </section>

      <HomeClient section="faq" />

      <section style={{ padding: '28px 24px 56px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div className="card aurora-red" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={24} color="#FCA5A5" />
              </div>
            </div>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.5rem)', color: '#F8FAFC', marginBottom: '0.9rem', letterSpacing: '-0.03em' }}>
              Безопасность клиентов
            </h2>
            <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, marginBottom: '0.75rem', fontSize: '0.94rem' }}>
              Мы уделяем особое внимание защите данных и безопасности наших клиентов. Все операции выполняются через защищённые каналы, а обработка информации осуществляется в соответствии с применимым европейским законодательством.
            </p>
            <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, marginBottom: '0.75rem', fontSize: '0.94rem' }}>
              Мы не требуем предоплату и не запрашиваем конфиденциальные данные.
            </p>
            <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, fontSize: '0.94rem' }}>
              Используйте только официальный сайт и проверенные контактные данные компании при взаимодействии с сервисом.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px 56px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.95fr)', gap: '2rem' }}>
            <div className="surface-card aurora-blue">
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>Обратная связь</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.5rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Свяжитесь с нами</h2>
              <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Если у вас есть вопросы или вам нужна помощь — наша команда готова помочь.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div><label className="input-label">Имя</label><input className="input" type="text" placeholder="Иван" /></div>
                  <div><label className="input-label">Email</label><input className="input" type="email" placeholder="ivan@example.com" /></div>
                </div>
                <div><label className="input-label">Телефон</label><input className="input" type="tel" placeholder="+353 1 531 8420" /></div>
                <div><label className="input-label">Сообщение</label><textarea className="input" rows={4} placeholder="Ваш вопрос..." style={{ resize: 'vertical' }} /></div>
                <div><label className="input-label">Прикрепление файла</label><input type="file" style={{ fontSize: '0.875rem', color: 'rgba(154,164,182,0.84)', marginTop: '2px' }} /></div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input type="checkbox" id="hconsent" style={{ marginTop: '3px', accentColor: '#3B82F6', width: '15px', height: '15px' }} />
                  <label htmlFor="hconsent" style={{ fontSize: '0.8125rem', color: 'rgba(154,164,182,0.88)', cursor: 'pointer', lineHeight: 1.6 }}>
                    Согласен с обработкой персональных данных в соответствии с{' '}
                    <a href="/privacy" style={{ color: '#93C5FD', textDecoration: 'underline', textUnderlineOffset: '2px' }}>политикой конфиденциальности</a>
                  </label>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>Отправить <ArrowRight size={15} /></button>
                </div>
              </form>
            </div>

            <div className="surface-card aurora-violet">
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4B5FD', marginBottom: '0.65rem' }}>Контакты</p>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.6rem,2.4vw,2.25rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
                Контактная информация
              </h3>
              <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, marginBottom: '0.75rem', fontSize: '0.94rem' }}>
                Вы можете связаться с нами по любым вопросам, связанным с оформлением займа, условиями или обслуживанием.
              </p>
              <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Служба поддержки работает в рабочие часы. Онлайн-заявки принимаются круглосуточно и обрабатываются автоматически.
              </p>
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {[
                  { icon: MapPin, label: 'Адрес', value: '18 Lower Baggot Street, Dublin 2, Ireland' },
                  { icon: Mail, label: 'Email', value: 'support@lumenbridge.example' },
                  { icon: Phone, label: 'Телефон', value: '+353 1 531 8420' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '0.9rem', padding: '0.95rem 0', borderBottom: '1px solid rgba(140,144,159,0.16)', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(30,41,59,0.72)', borderRadius: '12px', border: '1px solid rgba(140,144,159,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color="#93C5FD" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(154,164,182,0.84)', fontWeight: 700, marginBottom: '0.15rem' }}>{label}</p>
                      <p style={{ color: '#F8FAFC', fontWeight: 500, fontSize: '0.9375rem' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
