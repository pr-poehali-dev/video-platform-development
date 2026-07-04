import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const THUMB_A = 'https://cdn.poehali.dev/projects/66925adf-f438-4335-a266-f7e32878417f/files/89f4e237-813e-42b4-8fa0-b7122e45707c.jpg';
const THUMB_B = 'https://cdn.poehali.dev/projects/66925adf-f438-4335-a266-f7e32878417f/files/64bd9702-6c26-4747-8954-951e7f543f43.jpg';

type Screen = 'auth' | 'home' | 'discover' | 'channel' | 'upload' | 'watch';

interface Video {
  id: number;
  title: string;
  channel: string;
  views: string;
  time: string;
  thumb: string;
  color: string;
  premiere?: boolean;
}

const videos: Video[] = [
  { id: 1, title: 'Как я снял короткометражку за 24 часа', channel: 'Артур Космос', views: '128K', time: '2 дня назад', thumb: THUMB_A, color: '82 84% 55%' },
  { id: 2, title: 'Неоновый город: тайм-лапс ночного мегаполиса', channel: 'NightVision', views: '54K', time: '5 часов назад', thumb: THUMB_B, color: '322 90% 60%', premiere: true },
  { id: 3, title: 'Секреты цветокоррекции для новичков', channel: 'ColorLab', views: '31K', time: '1 неделя назад', thumb: THUMB_A, color: '265 85% 62%' },
  { id: 4, title: 'Дрон над горами: закат в 4K', channel: 'SkyHunter', views: '212K', time: '3 дня назад', thumb: THUMB_B, color: '82 84% 55%' },
  { id: 5, title: 'Монтаж без воды — только по делу', channel: 'CutFast', views: '9K', time: 'вчера', thumb: THUMB_A, color: '322 90% 60%' },
  { id: 6, title: 'Первое видео на канале! Знакомимся', channel: 'НовыйГолос', views: '1.2K', time: '3 часа назад', thumb: THUMB_B, color: '265 85% 62%' },
];

const channels = [
  { name: 'Артур Космос', subs: '128K', letter: 'А', color: '82 84% 55%' },
  { name: 'NightVision', subs: '54K', letter: 'N', color: '322 90% 60%' },
  { name: 'ColorLab', subs: '31K', letter: 'C', color: '265 85% 62%' },
  { name: 'НовыйГолос', subs: '1.2K', letter: 'Н', color: '82 84% 55%' },
];

export default function Index() {
  const [screen, setScreen] = useState<Screen>('auth');
  const [isLogin, setIsLogin] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video>(videos[0]);

  const nav = [
    { id: 'home', label: 'Главная', icon: 'House' },
    { id: 'discover', label: 'Новое', icon: 'Compass' },
    { id: 'channel', label: 'Мой канал', icon: 'User' },
    { id: 'upload', label: 'Загрузить', icon: 'Upload' },
  ] as const;

  if (screen === 'auth') return <Auth isLogin={isLogin} setIsLogin={setIsLogin} onEnter={() => setScreen('channel')} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header screen={screen} setScreen={setScreen} nav={nav} onLogout={() => setScreen('auth')} />
      <main className="flex-1">
        {screen === 'home' && <Home openVideo={(v) => { setActiveVideo(v); setScreen('watch'); }} goChannel={() => setScreen('channel')} />}
        {screen === 'discover' && <Discover openVideo={(v) => { setActiveVideo(v); setScreen('watch'); }} />}
        {screen === 'channel' && <Channel goUpload={() => setScreen('upload')} openVideo={(v) => { setActiveVideo(v); setScreen('watch'); }} />}
        {screen === 'upload' && <Upload onDone={() => setScreen('channel')} />}
        {screen === 'watch' && (
          <Watch video={activeVideo} subscribed={subscribed} setSubscribed={setSubscribed} liked={liked} setLiked={setLiked} openVideo={(v) => { setActiveVideo(v); window.scrollTo(0, 0); }} />
        )}
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        VOLNA — платформа для творцов · сделано с любовью к видео
      </footer>
    </div>
  );
}

function Logo({ size = 'text-2xl' }: { size?: string }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="grain w-9 h-9 rounded-xl bg-primary flex items-center justify-center glow-lime">
        <Icon name="Play" className="text-primary-foreground" size={18} fallback="Play" />
      </div>
      <span className={`font-display font-700 tracking-tight ${size}`}>
        VOL<span className="text-gradient">NA</span>
      </span>
    </div>
  );
}

function Auth({ isLogin, setIsLogin, onEnter }: { isLogin: boolean; setIsLogin: (v: boolean) => void; onEnter: () => void }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden grain" style={{ background: 'linear-gradient(160deg, hsl(265 85% 20%), hsl(240 15% 6%))' }}>
        <Logo size="text-3xl" />
        <div className="space-y-6 max-w-md">
          <h1 className="font-display font-700 text-6xl leading-[0.95] uppercase">
            Твоя<br /><span className="text-gradient">волна</span><br />начинается тут
          </h1>
          <p className="text-lg text-muted-foreground">
            Загружай видео, собирай подписчиков и запускай премьеры. Рекомендации подстроятся под тебя.
          </p>
        </div>
        <div className="flex gap-8">
          {[['12M+', 'зрителей'], ['480K', 'авторов'], ['3.1M', 'видео']].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-3xl text-primary">{n}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 animate-float-up">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10"><Logo /></div>
          <div className="inline-flex rounded-full bg-muted p-1 mb-8">
            <button onClick={() => setIsLogin(false)} className={`px-6 py-2 rounded-full text-sm font-600 transition-all ${!isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Регистрация</button>
            <button onClick={() => setIsLogin(true)} className={`px-6 py-2 rounded-full text-sm font-600 transition-all ${isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Вход</button>
          </div>

          <h2 className="font-display text-4xl font-600 mb-2 uppercase">{isLogin ? 'С возвращением' : 'Создай канал'}</h2>
          <p className="text-muted-foreground mb-8">{isLogin ? 'Войди, чтобы продолжить творить' : 'Пара шагов — и ты в эфире'}</p>

          <div className="space-y-4">
            {!isLogin && (
              <Field icon="AtSign" placeholder="Название канала" />
            )}
            <Field icon="Mail" placeholder="Электронная почта" type="email" />
            <Field icon="Lock" placeholder="Пароль" type="password" />
          </div>

          <Button onClick={onEnter} className="w-full mt-8 py-6 text-base font-600 rounded-xl glow-lime">
            {isLogin ? 'Войти в канал' : 'Создать канал'}
            <Icon name="ArrowRight" size={18} className="ml-1" />
          </Button>

          <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> или через <div className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-border"><Icon name="Chrome" size={18} className="mr-2" />Google</Button>
            <Button variant="outline" className="h-12 rounded-xl border-border"><Icon name="Send" size={18} className="mr-2" />Telegram</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, ...props }: { icon: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon name={icon} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input {...props} className="py-6 pl-11 rounded-xl bg-muted border-border focus-visible:ring-primary" />
    </div>
  );
}

function Header({ screen, setScreen, nav, onLogout }: { screen: Screen; setScreen: (s: Screen) => void; nav: readonly { id: string; label: string; icon: string }[]; onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container flex items-center gap-6 h-16">
        <button onClick={() => setScreen('home')}><Logo /></button>
        <div className="relative flex-1 max-w-md hidden md:block">
          <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Поиск видео и каналов..." className="h-10 pl-11 rounded-full bg-muted border-transparent" />
        </div>
        <nav className="flex items-center gap-1 ml-auto">
          {nav.map((n) => (
            <button key={n.id} onClick={() => setScreen(n.id as Screen)} className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-500 transition-all ${screen === n.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <Icon name={n.icon} size={18} />
              <span className="hidden lg:inline">{n.label}</span>
            </button>
          ))}
          <button onClick={onLogout} className="ml-2 w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-600">Я</button>
        </nav>
      </div>
    </header>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <h2 className="font-display text-3xl sm:text-4xl font-600 uppercase tracking-tight">{children}</h2>
      {sub && <span className="text-sm text-muted-foreground">{sub}</span>}
    </div>
  );
}

function VideoCard({ v, onClick, index = 0 }: { v: Video; onClick: () => void; index?: number }) {
  return (
    <button onClick={onClick} className="group text-left animate-float-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
        <img src={v.thumb} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {v.premiere ? (
          <span className="absolute top-3 left-3 flex items-center gap-1 text-xs font-600 px-2 py-1 rounded-full bg-accent text-accent-foreground">
            <Icon name="Radio" size={12} /> Премьера
          </span>
        ) : (
          <span className="absolute bottom-3 right-3 text-xs font-600 px-2 py-0.5 rounded-md bg-black/70 text-white">12:04</span>
        )}
      </div>
      <div className="flex gap-3 mt-3">
        <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-600 text-sm" style={{ background: `hsl(${v.color})`, color: '#111' }}>{v.channel[0]}</div>
        <div>
          <h3 className="font-600 leading-snug line-clamp-2 group-hover:text-primary transition-colors">{v.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{v.channel}</p>
          <p className="text-xs text-muted-foreground">{v.views} просмотров · {v.time}</p>
        </div>
      </div>
    </button>
  );
}

function Home({ openVideo, goChannel }: { openVideo: (v: Video) => void; goChannel: () => void }) {
  return (
    <div className="container py-8">
      <section className="relative rounded-3xl overflow-hidden grain mb-12 animate-float-up cursor-pointer" onClick={() => openVideo(videos[3])}>
        <img src={THUMB_B} alt="hero" className="w-full h-[42vh] min-h-[280px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-14 max-w-2xl">
          <span className="text-sm font-600 text-primary uppercase tracking-widest mb-3">Рекомендуем сегодня</span>
          <h1 className="font-display text-4xl sm:text-6xl font-700 uppercase leading-[0.95] mb-4">Дрон над горами: закат в 4K</h1>
          <p className="text-muted-foreground mb-6">Подобрано по твоей истории просмотров — ты любишь съёмки природы.</p>
          <Button className="w-fit h-12 px-7 rounded-full font-600 glow-lime"><Icon name="Play" size={18} className="mr-1" />Смотреть</Button>
        </div>
      </section>

      <SectionTitle sub="на основе твоей истории">Рекомендации для тебя</SectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {videos.slice(0, 3).map((v, i) => <VideoCard key={v.id} v={v} index={i} onClick={() => openVideo(v)} />)}
      </div>

      <SectionTitle sub="все свежие ролики">Смотрят прямо сейчас</SectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.slice(3).map((v, i) => <VideoCard key={v.id} v={v} index={i} onClick={() => openVideo(v)} />)}
      </div>

      <div className="mt-14 rounded-3xl border border-border p-8 flex flex-col sm:flex-row items-center justify-between gap-4 grain" style={{ background: 'linear-gradient(120deg, hsl(265 85% 15%), transparent)' }}>
        <div>
          <h3 className="font-display text-2xl font-600 uppercase">Готов снимать?</h3>
          <p className="text-muted-foreground">Загрузи первое видео на свой канал за минуту</p>
        </div>
        <Button onClick={goChannel} className="h-12 px-7 rounded-full font-600"><Icon name="Upload" size={18} className="mr-2" />К моему каналу</Button>
      </div>
    </div>
  );
}

function Discover({ openVideo }: { openVideo: (v: Video) => void }) {
  return (
    <div className="container py-8">
      <div className="mb-10 animate-float-up">
        <span className="text-sm font-600 text-accent uppercase tracking-widest">Витрина новичков</span>
        <h1 className="font-display text-4xl sm:text-5xl font-700 uppercase mt-1">Новые каналы и видео</h1>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-12 -mx-2 px-2">
        {channels.map((c, i) => (
          <div key={c.name} className="shrink-0 w-44 rounded-3xl border border-border p-5 text-center grain animate-float-up hover:border-primary transition-colors" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center font-display text-2xl font-600" style={{ background: `hsl(${c.color})`, color: '#111' }}>{c.letter}</div>
            <h3 className="font-600 mt-3 truncate">{c.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{c.subs} подписчиков</p>
            <Button size="sm" className="w-full rounded-full font-600">Подписаться</Button>
          </div>
        ))}
      </div>

      <SectionTitle sub="только что опубликовано">Свежие видео новичков</SectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((v, i) => <VideoCard key={v.id} v={v} index={i} onClick={() => openVideo(v)} />)}
      </div>
    </div>
  );
}

function Channel({ goUpload, openVideo }: { goUpload: () => void; openVideo: (v: Video) => void }) {
  const stats = [
    { label: 'Подписчики', value: '128K', icon: 'Users' },
    { label: 'Подписки', value: '340', icon: 'UserPlus' },
    { label: 'Лайки', value: '1.4M', icon: 'Heart' },
    { label: 'Видео', value: '84', icon: 'Video' },
  ];
  const [tab, setTab] = useState('Видео');
  return (
    <div>
      <div className="h-48 sm:h-60 grain relative" style={{ background: 'linear-gradient(120deg, hsl(82 84% 45%), hsl(322 90% 55%), hsl(265 85% 55%))' }} />
      <div className="container -mt-16 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 animate-float-up">
          <div className="w-28 h-28 rounded-3xl bg-primary border-4 border-background flex items-center justify-center font-display text-5xl font-700 text-primary-foreground shrink-0">Я</div>
          <div className="flex-1">
            <h1 className="font-display text-4xl font-700 uppercase">Мой канал</h1>
            <p className="text-muted-foreground">@my_channel · 128K подписчиков · 84 видео</p>
          </div>
          <Button onClick={goUpload} className="h-12 px-6 rounded-full font-600 glow-lime"><Icon name="Upload" size={18} className="mr-2" />Загрузить видео</Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {stats.map((s, i) => (
            <div key={s.label} className="rounded-2xl border border-border p-5 animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
              <Icon name={s.icon} size={20} className="text-primary mb-2" />
              <div className="font-display text-3xl font-600">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mt-10 border-b border-border overflow-x-auto">
          {['Видео', 'Подписки', 'Подписчики', 'О канале'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 font-600 text-sm relative whitespace-nowrap ${tab === t ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t}
              {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {tab === 'Видео' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pb-8">
            {videos.map((v, i) => <VideoCard key={v.id} v={v} index={i} onClick={() => openVideo(v)} />)}
          </div>
        )}
        {tab === 'Подписки' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pb-8">
            {channels.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-2xl border border-border p-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-600" style={{ background: `hsl(${c.color})`, color: '#111' }}>{c.letter}</div>
                <div className="flex-1 min-w-0"><p className="font-600 truncate">{c.name}</p><p className="text-xs text-muted-foreground">{c.subs}</p></div>
                <Button size="sm" variant="outline" className="rounded-full">Вы подписаны</Button>
              </div>
            ))}
          </div>
        )}
        {tab === 'Подписчики' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pb-8">
            {channels.concat(channels).map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-border p-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-600" style={{ background: `hsl(${c.color})`, color: '#111' }}>{c.letter}</div>
                <div className="flex-1 min-w-0"><p className="font-600 truncate">{c.name}</p><p className="text-xs text-muted-foreground">{c.subs}</p></div>
              </div>
            ))}
          </div>
        )}
        {tab === 'О канале' && (
          <div className="mt-8 pb-8 max-w-2xl text-muted-foreground leading-relaxed">
            Привет! Здесь я делюсь съёмками природы, монтажом и творческими экспериментами. Новые видео — каждую неделю. Спасибо, что ты со мной на одной волне.
          </div>
        )}
      </div>
    </div>
  );
}

function Upload({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<'now' | 'schedule' | 'premiere'>('now');
  return (
    <div className="container py-8 max-w-3xl">
      <div className="animate-float-up">
        <span className="text-sm font-600 text-primary uppercase tracking-widest">Новое видео</span>
        <h1 className="font-display text-4xl sm:text-5xl font-700 uppercase mt-1 mb-8">Загрузка видео</h1>
      </div>

      <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center grain hover:border-primary transition-colors cursor-pointer animate-float-up">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
          <Icon name="CloudUpload" size={28} className="text-primary" />
        </div>
        <p className="font-600 text-lg">Перетащи файл видео сюда</p>
        <p className="text-sm text-muted-foreground mb-4">или выбери с устройства · MP4, MOV до 2 ГБ</p>
        <Button variant="outline" className="rounded-full"><Icon name="FileVideo" size={16} className="mr-2" />Выбрать файл</Button>
      </div>

      <div className="grid sm:grid-cols-[200px_1fr] gap-6 mt-8">
        <div>
          <label className="text-sm font-600 mb-2 block">Миниатюра</label>
          <div className="aspect-video rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary transition-colors cursor-pointer">
            <Icon name="Image" size={24} />
            <span className="text-xs mt-1">Загрузить</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-600 mb-2 block">Название видео</label>
            <Input placeholder="Придумай цепляющий заголовок" className="h-12 rounded-xl bg-muted border-border" />
          </div>
          <div>
            <label className="text-sm font-600 mb-2 block">Описание</label>
            <Textarea placeholder="Расскажи, о чём это видео..." className="min-h-28 rounded-xl bg-muted border-border resize-none" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-600 mb-3 block">Публикация</label>
        <div className="grid sm:grid-cols-3 gap-3">
          {([
            { id: 'now', icon: 'Zap', title: 'Сразу', desc: 'Опубликовать немедленно' },
            { id: 'schedule', icon: 'Calendar', title: 'По расписанию', desc: 'Выбрать дату и время' },
            { id: 'premiere', icon: 'Radio', title: 'Премьера', desc: 'Обратный отсчёт для зрителей' },
          ] as const).map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)} className={`text-left rounded-2xl border p-4 transition-all ${mode === m.id ? 'border-primary bg-primary/10' : 'border-border'}`}>
              <Icon name={m.icon} size={20} className={mode === m.id ? 'text-primary' : 'text-muted-foreground'} />
              <div className="font-600 mt-2">{m.title}</div>
              <div className="text-xs text-muted-foreground">{m.desc}</div>
            </button>
          ))}
        </div>
        {mode !== 'now' && (
          <div className="grid grid-cols-2 gap-3 mt-4 animate-float-up">
            <Input type="date" className="h-12 rounded-xl bg-muted border-border" />
            <Input type="time" className="h-12 rounded-xl bg-muted border-border" />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-10">
        <Button onClick={onDone} className="flex-1 py-6 rounded-xl font-600 glow-lime">
          {mode === 'premiere' ? 'Запланировать премьеру' : mode === 'schedule' ? 'Запланировать публикацию' : 'Опубликовать сейчас'}
        </Button>
        <Button variant="outline" onClick={onDone} className="py-6 px-6 rounded-xl">Отмена</Button>
      </div>
    </div>
  );
}

function Watch({ video, subscribed, setSubscribed, liked, setLiked, openVideo }: {
  video: Video; subscribed: boolean; setSubscribed: (v: boolean) => void; liked: boolean; setLiked: (v: boolean) => void; openVideo: (v: Video) => void;
}) {
  const related = videos.filter((v) => v.id !== video.id);
  return (
    <div className="container py-8 grid lg:grid-cols-[1fr_360px] gap-8">
      <div className="animate-float-up">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-black grain group">
          <img src={video.thumb} alt={video.title} className="w-full h-full object-cover opacity-70" />
          <button className="absolute inset-0 flex items-center justify-center">
            <span className="w-20 h-20 rounded-full bg-primary flex items-center justify-center glow-lime transition-transform group-hover:scale-110">
              <Icon name="Play" size={32} className="text-primary-foreground ml-1" />
            </span>
          </button>
          {video.premiere && (
            <span className="absolute top-4 left-4 flex items-center gap-1 text-sm font-600 px-3 py-1 rounded-full bg-accent text-accent-foreground">
              <Icon name="Radio" size={14} /> Премьера · старт через 02:41:18
            </span>
          )}
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-600 mt-5 leading-tight">{video.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{video.views} просмотров · {video.time}</p>

        <div className="flex flex-wrap items-center gap-3 mt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-600" style={{ background: `hsl(${video.color})`, color: '#111' }}>{video.channel[0]}</div>
            <div>
              <p className="font-600">{video.channel}</p>
              <p className="text-xs text-muted-foreground">128K подписчиков</p>
            </div>
            <Button onClick={() => setSubscribed(!subscribed)} className={`ml-2 rounded-full font-600 ${subscribed ? 'bg-muted text-foreground hover:bg-muted' : ''}`}>
              {subscribed ? <><Icon name="Check" size={16} className="mr-1" />Вы подписаны</> : 'Подписаться'}
            </Button>
          </div>
          <button onClick={() => setLiked(!liked)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-600 text-sm transition-all ${liked ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
            <Icon name="Heart" size={18} className={liked ? 'fill-current' : ''} /> {liked ? '1.4M' : 'Нравится'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full font-600 text-sm bg-muted">
            <Icon name="Share2" size={18} /> Поделиться
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full font-600 text-sm bg-muted">
            <Icon name="Bookmark" size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed">
          Спасибо, что смотришь! В этом видео я показываю весь процесс от идеи до финального монтажа. Ставь лайк и подписывайся, если было полезно — это очень помогает каналу.
        </div>
      </div>

      <aside>
        <h2 className="font-display text-xl font-600 uppercase mb-4">Смотрите также</h2>
        <div className="space-y-4">
          {related.map((v) => (
            <button key={v.id} onClick={() => openVideo(v)} className="flex gap-3 text-left group w-full">
              <div className="relative w-40 shrink-0 aspect-video rounded-xl overflow-hidden bg-muted">
                <img src={v.thumb} alt={v.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-600 line-clamp-2 group-hover:text-primary transition-colors">{v.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{v.channel}</p>
                <p className="text-xs text-muted-foreground">{v.views} · {v.time}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
