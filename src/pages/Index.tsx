import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

const videos: Video[] = [];
const channels: { name: string; subs: string; letter: string; color: string }[] = [];

export default function Index() {
  const [screen, setScreen] = useState<Screen>('auth');
  const [isLogin, setIsLogin] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const nav = [
    { id: 'home', label: 'Главная', icon: 'House' },
    { id: 'discover', label: 'Новое', icon: 'Compass' },
    { id: 'channel', label: 'Мой канал', icon: 'User' },
    { id: 'upload', label: 'Загрузить', icon: 'Upload' },
  ] as const;

  const openVideo = (v: Video) => { setActiveVideo(v); setScreen('watch'); window.scrollTo(0, 0); };

  if (screen === 'auth') return <Auth isLogin={isLogin} setIsLogin={setIsLogin} onEnter={() => setScreen('channel')} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header screen={screen} setScreen={setScreen} nav={nav} onLogout={() => setScreen('auth')} />
      <main className="flex-1">
        {screen === 'home' && <Home goUpload={() => setScreen('upload')} />}
        {screen === 'discover' && <Discover />}
        {screen === 'channel' && <Channel goUpload={() => setScreen('upload')} />}
        {screen === 'upload' && <Upload onDone={() => setScreen('channel')} />}
        {screen === 'watch' && activeVideo && (
          <Watch video={activeVideo} subscribed={subscribed} setSubscribed={setSubscribed} liked={liked} setLiked={setLiked} openVideo={openVideo} />
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

function EmptyState({ icon, title, text, action }: { icon: string; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 animate-float-up">
      <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-5 grain">
        <Icon name={icon} size={32} className="text-muted-foreground" />
      </div>
      <h3 className="font-display text-2xl font-600 uppercase">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm">{text}</p>
      {action && <div className="mt-6">{action}</div>}
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
          {[['0', 'зрителей'], ['0', 'авторов'], ['0', 'видео']].map(([n, l]) => (
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
        {v.premiere && (
          <span className="absolute top-3 left-3 flex items-center gap-1 text-xs font-600 px-2 py-1 rounded-full bg-accent text-accent-foreground">
            <Icon name="Radio" size={12} /> Премьера
          </span>
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

function Home({ goUpload }: { goUpload: () => void }) {
  return (
    <div className="container py-8">
      <div className="mb-8 animate-float-up">
        <span className="text-sm font-600 text-primary uppercase tracking-widest">Главная</span>
        <h1 className="font-display text-4xl sm:text-5xl font-700 uppercase mt-1">Лента рекомендаций</h1>
      </div>

      {videos.length === 0 ? (
        <EmptyState
          icon="Sparkles"
          title="Пока пусто"
          text="Здесь появятся видео, подобранные под твои интересы. Загрузи первое видео, чтобы начать."
          action={<Button onClick={goUpload} className="h-12 px-7 rounded-full font-600 glow-lime"><Icon name="Upload" size={18} className="mr-2" />Загрузить видео</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, i) => <VideoCard key={v.id} v={v} index={i} onClick={() => {}} />)}
        </div>
      )}
    </div>
  );
}

function Discover() {
  return (
    <div className="container py-8">
      <div className="mb-10 animate-float-up">
        <span className="text-sm font-600 text-accent uppercase tracking-widest">Витрина новичков</span>
        <h1 className="font-display text-4xl sm:text-5xl font-700 uppercase mt-1">Новые каналы и видео</h1>
      </div>

      {channels.length === 0 && videos.length === 0 ? (
        <EmptyState
          icon="Compass"
          title="Новых пока нет"
          text="Как только появятся новые авторы и их первые видео — они будут здесь."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((v, i) => <VideoCard key={v.id} v={v} index={i} onClick={() => {}} />)}
        </div>
      )}
    </div>
  );
}

function Channel({ goUpload }: { goUpload: () => void }) {
  const stats = [
    { label: 'Подписчики', value: '0', icon: 'Users' },
    { label: 'Подписки', value: '0', icon: 'UserPlus' },
    { label: 'Лайки', value: '0', icon: 'Heart' },
    { label: 'Видео', value: '0', icon: 'Video' },
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
            <p className="text-muted-foreground">@my_channel · 0 подписчиков · 0 видео</p>
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

        <div className="pb-8">
          {tab === 'Видео' && (
            <EmptyState icon="Video" title="Нет видео" text="Загрузи своё первое видео — оно появится здесь."
              action={<Button onClick={goUpload} className="h-12 px-7 rounded-full font-600"><Icon name="Upload" size={18} className="mr-2" />Загрузить</Button>} />
          )}
          {tab === 'Подписки' && <EmptyState icon="UserPlus" title="Нет подписок" text="Ты ещё ни на кого не подписан. Загляни в раздел «Новое»." />}
          {tab === 'Подписчики' && <EmptyState icon="Users" title="Нет подписчиков" text="Публикуй видео — и зрители начнут подписываться." />}
          {tab === 'О канале' && (
            <div className="mt-8 max-w-2xl text-muted-foreground leading-relaxed">
              Расскажи о своём канале — этот текст увидят зрители. Пока описание не заполнено.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilePicker({ accept, icon, title, hint, className }: { accept: string; icon: string; title: string; hint: string; className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) setFileName(files[0].name);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      className={`cursor-pointer transition-colors ${dragOver ? 'border-primary bg-primary/10' : 'border-border'} ${className}`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      {fileName ? (
        <>
          <Icon name="CircleCheck" size={28} className="text-primary" />
          <p className="font-600 mt-2 truncate max-w-full px-2">{fileName}</p>
          <p className="text-xs text-muted-foreground">Нажми, чтобы заменить</p>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-2">
            <Icon name={icon} size={26} className="text-primary" />
          </div>
          <p className="font-600">{title}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </>
      )}
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

      <FilePicker
        accept="video/*"
        icon="CloudUpload"
        title="Перетащи файл видео сюда или нажми, чтобы выбрать"
        hint="MP4, MOV до 2 ГБ"
        className="rounded-3xl border-2 border-dashed p-12 text-center grain flex flex-col items-center justify-center animate-float-up"
      />

      <div className="grid sm:grid-cols-[200px_1fr] gap-6 mt-8">
        <div>
          <label className="text-sm font-600 mb-2 block">Миниатюра</label>
          <FilePicker
            accept="image/*"
            icon="Image"
            title="Загрузить"
            hint="JPG, PNG"
            className="aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center"
          />
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
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-600 mt-5 leading-tight">{video.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{video.views} просмотров · {video.time}</p>

        <div className="flex flex-wrap items-center gap-3 mt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-600" style={{ background: `hsl(${video.color})`, color: '#111' }}>{video.channel[0]}</div>
            <div>
              <p className="font-600">{video.channel}</p>
              <p className="text-xs text-muted-foreground">0 подписчиков</p>
            </div>
            <Button onClick={() => setSubscribed(!subscribed)} className={`ml-2 rounded-full font-600 ${subscribed ? 'bg-muted text-foreground hover:bg-muted' : ''}`}>
              {subscribed ? <><Icon name="Check" size={16} className="mr-1" />Вы подписаны</> : 'Подписаться'}
            </Button>
          </div>
          <button onClick={() => setLiked(!liked)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-600 text-sm transition-all ${liked ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
            <Icon name="Heart" size={18} className={liked ? 'fill-current' : ''} /> {liked ? '1' : 'Нравится'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full font-600 text-sm bg-muted">
            <Icon name="Share2" size={18} /> Поделиться
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full font-600 text-sm bg-muted">
            <Icon name="Bookmark" size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed">
          Описание видео появится здесь.
        </div>
      </div>

      <aside>
        <h2 className="font-display text-xl font-600 uppercase mb-4">Смотрите также</h2>
        {related.length === 0 ? (
          <p className="text-sm text-muted-foreground">Пока нет других видео.</p>
        ) : (
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
        )}
      </aside>
    </div>
  );
}
