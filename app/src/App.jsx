import { useEffect, useRef, useState } from 'react';
import DepthCarousel from './DepthCarousel.jsx';
import GuessNumber from './GuessNumber.jsx';
import CyberRain from './CyberRain.jsx';
import useSiteFx from './useSiteFx.js';
import CountUp from './CountUp.jsx';
import Clock from './Clock.jsx';
import Typewriter from './Typewriter.jsx';

// public/ 下的静态资源不会经过 Vite 的路径重写，部署到 GitHub Pages 子路径时
// 必须自己补上 base 前缀，否则 /photography/x.jpg 会 404。
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const projects = [
  {
    number: '01',
    category: 'LANGUAGE / IN PROGRESS',
    title: '多门外语学习',
    description: '从日常积累开始，练习用新的语言理解不同的表达与文化。',
    images: [asset('/projects/language-1.svg'), asset('/projects/language-2.svg'), asset('/projects/language-3.svg')],
    alt: '语言学习',
    className: 'project-language',
  },
  {
    number: '02',
    category: 'MUSIC / PRACTICE',
    title: '钢琴与音乐练习',
    description: '把长期练习中的节奏、耐心与情绪，慢慢变成自己的表达。',
    images: [asset('/projects/music-1.svg'), asset('/projects/music-2.svg'), asset('/projects/music-3.svg')],
    href: '#music',
    actionLabel: '听我的演奏',
    alt: '钢琴键与琴谱',
    className: 'project-music',
  },
  {
    number: '03',
    category: 'PYTHON / MINI GAME',
    title: '猜数字小游戏',
    description: '一个用 Python 编写的命令行小游戏：猜测 1–100 的随机数，根据大小提示继续尝试，并统计猜测次数。',
    images: [asset('/projects/python-1.svg'), asset('/projects/python-2.svg'), asset('/projects/python-3.svg')],
    href: '#play',
    sourceHref: asset('/games/guess-number/game.py'),
    alt: '桌面上的电脑与创作工具',
    className: 'project-digital',
  },
];

const strengths = [
  {
    index: 'A',
    title: '长期投入',
    text: '十余年的钢琴学习，让坚持不只是口号，而是一种熟悉的日常。',
    detail: 'PATIENCE / 01',
  },
  {
    index: 'B',
    title: '跨界好奇',
    text: '在语言、音乐、绘画与技术之间探索，乐于从不同角度发现问题。',
    detail: 'CURIOSITY / 02',
  },
  {
    index: 'C',
    title: '持续学习',
    text: '保持开放，也接受从基础开始；把想法拆成可以完成的小步骤。',
    detail: 'GROWTH / 03',
  },
];

const artworkItems = [
  { image: asset('/artworks/furina-sketch-01.jpg'), alt: '手持玫瑰的人物线稿', title: '玫瑰与线稿', subtitle: 'PENCIL STUDY / 01' },
  { image: asset('/artworks/girl-sketch-02.jpg'), alt: '彩色人物头像线稿', title: '人物肖像', subtitle: 'PORTRAIT STUDY / 02' },
  { image: asset('/artworks/artworks3.jpg'), alt: '画作三', title: '画作 · 三', subtitle: 'ARTWORK / 03' },
  { image: asset('/artworks/artworks4.jpg'), alt: '画作四', title: '画作 · 四', subtitle: 'ARTWORK / 04' },
];

const photographyItems = [
  { image: asset('/photography/photo1.jpg'), alt: '摄影作品一', title: '摄影作品 · 01', subtitle: 'PHOTO / 01' },
  { image: asset('/photography/photo2.jpg'), alt: '摄影作品二', title: '摄影作品 · 02', subtitle: 'PHOTO / 02' },
  { image: asset('/photography/photo3.jpg'), alt: '摄影作品三', title: '摄影作品 · 03', subtitle: 'PHOTO / 03' },
  { image: asset('/photography/photo4.jpg'), alt: '摄影作品四', title: '摄影作品 · 04', subtitle: 'PHOTO / 04' },
  { image: asset('/photography/photo5.jpg'), alt: '摄影作品五', title: '摄影作品 · 05', subtitle: 'PHOTO / 05' },
];

const musicWorks = [
  { src: asset('/music/piano-performance.mp4'), title: '钢琴演奏 · 01', subtitle: 'PIANO / PERFORMANCE 01' },
  { src: asset('/music/piano-performance2.mp4'), title: '钢琴演奏 · 02', subtitle: 'PIANO / PERFORMANCE 02' },
  { src: asset('/music/piano-performance3.mp4'), title: '钢琴演奏 · 03', subtitle: 'PIANO / PERFORMANCE 03' },
];

const entrySlides = [
  {
    label: 'ABOUT / 01',
    title: '正在展开的\n生活轨迹',
    description: '来自沈阳，外国语专业还在慢慢理解自己。',
    tags: ['沈阳', '外国语', '持续成长'],
  },
  {
    label: 'INTERESTS / 02',
    title: '在不同的\n表达之间探索',
    description: '十余年钢琴学习，也持续接触多门外语、绘画、剪辑与数字工具。',
    tags: ['钢琴', '多门外语', '视觉创作'],
  },
  {
    label: 'EXPLORATIONS / 03',
    title: '让兴趣慢慢\n变成作品',
    description: '从语言笔记到 Python 小练习，把每一次尝试都留在自己的成长档案里。',
    tags: ['学习记录', '数字创作', '持续更新'],
  },
  {
    label: 'CONTACT / 04',
    title: '故事从一次\n交流开始',
    description: '欢迎聊聊语言、音乐、创作，或者任何值得继续探索的新想法。',
    tags: ['邮箱联系', 'GitHub', '保持联络'],
  },
];

function Arrow({ diagonal = false }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function EntryGate({ onEnter }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const slide = entrySlides[activeSlide];

  useEffect(() => {
    if (progress >= 100) return undefined;
    const id = window.setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.ceil((100 - p) * 0.12) + 2));
    }, 90);
    return () => window.clearInterval(id);
  }, [progress]);

  function enterSite() {
    setIsLeaving(true);
    window.setTimeout(onEnter, 720);
  }

  return (
    <div className={`entry-screen${isLeaving ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-labelledby="entry-title">
      <div className="entry-grain" />
      <div className="entry-load" aria-hidden="true"><span style={{ width: `${progress}%` }} /><b>{String(progress).padStart(3, '0')}%</b></div>
      <div className="entry-top page-width">
        <a className="wordmark" href="#top" aria-label="Hugoweston 首页"><span className="wordmark-symbol">H<span className="wordmark-dot">.</span></span><span>HUGOWESTON</span></a>
        <span className="entry-edition">PERSONAL ARCHIVE <i /> SHENYANG · 2026</span>
      </div>
      <div className="entry-layout page-width">
        <div className="entry-copy">
          <p className="eyebrow"><span>WELCOME</span> / A PERSONAL SPACE</p>
          <h1 id="entry-title">HUGO<span>WESTON.</span></h1>
          <p className="entry-tagline">学习，创作，向前。</p>
          <p className="entry-intro">我是 Hugoweston。这里记录我在沈阳，如何在语言、音乐与创作之间，慢慢找到自己的节奏。<br />New freshman here. My major? Still trying to understand it.</p>
          <button className="entry-button" onClick={enterSite} type="button"><span>进入我的主页</span><i><Arrow /></i></button>
        </div>
        <section className="entry-preview" aria-live="polite" key={activeSlide}>
          <div className="entry-preview-top"><span>{slide.label}</span><span>0{activeSlide + 1} / 04</span></div>
          <h2>{slide.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
          <p>{slide.description}</p>
          <div className="entry-tags">{slide.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="entry-wave" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ '--bar': `${12 + ((index * 17) % 34)}px` }} />)}</div>
        </section>
      </div>
      <div className="entry-bottom page-width">
        <div className="entry-tabs" role="tablist" aria-label="主页内容预览">
          {entrySlides.map((item, index) => (
            <button key={item.label} type="button" role="tab" aria-selected={activeSlide === index} onClick={() => setActiveSlide(index)}>
              <span>0{index + 1}</span>{item.label.split(' / ')[0]}
            </button>
          ))}
        </div>
        <span className="entry-hint">选择一个章节，或直接进入 <span>↓</span></span>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Hugoweston 首页">
        <span className="wordmark-symbol">H<span className="wordmark-dot">.</span></span>
        <span>HUGOWESTON</span>
      </a>
      <nav className="main-nav" aria-label="主导航">
        <a href="#about">关于</a>
        <a href="#projects">探索</a>
        <a href="#music">音乐</a>
        <a href="#artworks">美术</a>
        <a href="#photography">摄影</a>
        <a href="#strengths">优势</a>
      </nav>
      <a className="nav-contact" href="#contact">联系我 <Arrow diagonal /></a>
    </header>
  );
}

function CharacterWave({ text, className, delayOffset = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="char-wave"
          style={{ '--char-index': index + delayOffset, '--char-delay': `${(index + delayOffset) * 0.08}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster={asset('/hero-poster.svg')} style={{ backgroundImage: `url(${asset('/hero-poster.svg')})` }} aria-hidden="true">
        {/* 自托管背景视频：原来的 videos.pexels.com 是境外 CDN，微信/QQ 内置浏览器（腾讯 X5）加载失败；
            换成本地文件后与图片同域，国内网络也能播，加载中/失败时由 hero-poster.svg 兜底。 */}
        <source src={asset('/hero-video.mp4')} type="video/mp4" />
      </video>
      <div className="hero-shade" />
      <Header />
      <div className="hero-inner page-width">
        <div className="hero-label"><span className="live-dot" /> SHENYANG / CHINA <span className="label-divider">—</span> BASED IN SHENYANG</div>
        <p className="hero-greeting">Hello, I'm</p>
        <h1 className="hero-name glitch" id="hero-title" data-text="HUGOWESTON">
          <CharacterWave text="HUGO" className="hero-name-part" delayOffset={0} />
          <CharacterWave text="WESTON" className="hero-name-part hero-name-accent" delayOffset={4} />
          <i>.</i>
        </h1>
        <p className="hero-slogan">学习，创作，向前。</p>
        <div className="hero-bottom">
          <div className="hero-intro-stack">
            <span className="hero-intro-line" data-nosplit><Typewriter phrases={[
              { text: 'No expert yet, just curious and keep going.' },
              { text: 'Under construction, but open for visit.' },
              { text: 'Lost in languages, but enjoying the trip.' },
              { text: 'Still figuring out this world' },
            ]} /></span>
            <CharacterWave text="在语言、音乐与数字创作之间，慢慢找到自己的方向。" className="hero-intro-line line-soft" delayOffset={10} />
          </div>
          <a className="round-link" href="#about" aria-label="向下了解我"><span>向下探索</span><i><Arrow /></i></a>
        </div>
        <a className="scroll-hint" href="#about" aria-label="向下滚动"><span>SCROLL</span><i aria-hidden="true" /></a>
      </div>
      <div className="hero-index"><span>01</span> / 07</div>
      <div className="hero-side-note">PERSONAL ARCHIVE&nbsp; · &nbsp;2026</div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section section-pad" id="about">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <p className="eyebrow"><span>01</span> ABOUT ME</p>
          <p className="heading-note">从兴趣出发，慢慢建立自己的坐标。</p>
        </div>
        <div className="about-grid">
          <div className="portrait-panel" data-reveal>
            <div className="portrait-lines" />
            <div className="portrait-monogram">H<span className="portrait-dot">.</span></div>
            <div className="portrait-caption"><span>HUGOWESTON</span><span>SHENYANG / PRESENT</span></div>
            <div className="portrait-orbit orbit-one" />
            <div className="portrait-orbit orbit-two" />
          </div>
          <div className="about-copy" data-reveal>
            <p className="eyebrow muted-eyebrow">A LITTLE ABOUT MYSELF</p>
            <h2>把好奇心，<br />带到更远的地方。</h2>
            <p className="about-description">
              <span className="about-typewriter" data-nosplit><Typewriter /></span>
              <span className="copy-soft">外国语专业还在慢慢理解自己。钢琴陪伴我走过十余年，绘画、剪辑与 Python 则不断带我接触新的表达方式。现在的我还在探索，但每一步都算数。</span>
            </p>
            <div className="about-facts">
              <div><span>位置</span><strong>沈阳</strong></div>
              <div><span>专业</span><strong>外国语</strong></div>
              <div><span>状态</span><strong>持续成长</strong></div>
            </div>
            <a className="text-link" href="mailto:2916434975@qq.com">发邮件认识我 <Arrow diagonal /></a>
            <a className="text-link" href="https://github.com/Hugoweston28" target="_blank" rel="noreferrer">GitHub · Hugoweston28 <Arrow diagonal /></a>
          </div>
        </div>
        <div className="metrics-row" aria-label="个人经历数据" data-reveal>
          <div className="metric"><strong><CountUp to={10} /><span>+</span></strong><span>年钢琴学习</span></div>
          <div className="metric"><strong><CountUp to={4} /></strong><span>持续探索的方向</span></div>
          <div className="metric"><strong><CountUp to={1} /></strong><span>正在展开的生活探索</span></div>
          <div className="metric-aside">不是完成品，<br />是进行时。</div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="projects-section section-pad" id="projects">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow"><span>02</span> SELECTED EXPLORATIONS</p><h2 className="section-title">正在发生的事<span className="red-dot">.</span></h2></div>
          <p className="heading-note">把兴趣里的微小尝试，慢慢变成自己的作品。</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className={`project-card ${project.className}`} key={project.number} data-reveal>
              <div className="project-image" role="img" aria-label={project.alt}>
                {project.images.map((src, i) => (
                  <img key={src} className="project-slide" src={src} alt="" loading="lazy" decoding="async" style={{ '--i': i }} />
                ))}
                <span className="project-number">{project.number} / 03</span>
                <span className="project-open"><Arrow diagonal /></span>
              </div>
              <div className="project-meta"><span>{project.category}</span><span>{project.href ? 'PLAYABLE' : 'IN PROGRESS'}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.href && <div className="project-actions"><a href={project.href} target={/^https?:/.test(project.href) ? '_blank' : undefined} rel={/^https?:/.test(project.href) ? 'noreferrer' : undefined}>{project.actionLabel || '试玩'} <Arrow diagonal /></a>{project.sourceHref && <a href={project.sourceHref} download>Python 源码 <Arrow diagonal /></a>}</div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MusicShowcase() {
  return (
    <section className="music-section section-pad" id="music">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow"><span>03</span> PIANO / LIVE RECORDINGS</p><h2 className="section-title">音乐作品<span className="red-dot">.</span></h2></div>
          <p className="heading-note">三段钢琴演奏记录，按下播放即可收听。</p>
        </div>
        <div className="music-grid">
          {musicWorks.map((work, index) => (
            <article className="music-card" key={work.src} data-reveal>
              <div className="music-card-top"><span>0{index + 1} / 03</span><span>{work.subtitle}</span></div>
              <div className="music-player-frame">
                <video src={work.src} controls playsInline preload="metadata" aria-label={work.title} />
              </div>
              <h3>{work.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArtworkShowcase() {
  return (
    <section className="artworks-section section-pad" id="artworks">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow"><span>03</span> ORIGINAL ARTWORKS</p><h2 className="section-title">美术作品<span className="red-dot">.</span></h2></div>
          <p className="heading-note">记录笔触与灵感的一组画作。</p>
        </div>
        <div className="artwork-gallery" data-reveal>
          <div className="artwork-fx" aria-hidden="true">
            <span className="artwork-glow artwork-glow--left" />
            <span className="artwork-glow artwork-glow--right" />
            <span className="artwork-vtext artwork-vtext--left">ORIGINAL · SKETCHES · 2026</span>
            <span className="artwork-vtext artwork-vtext--right">PENCIL / DIGITAL / STUDY</span>
            <span className="artwork-mark artwork-mark--tl1">HW://ARCHIVE</span>
            <span className="artwork-mark artwork-mark--tl2">EST. 2026</span>
            <span className="artwork-mark artwork-mark--br1">H.WESTON</span>
            <span className="artwork-mark artwork-mark--br2">SYS / 01</span>
            <span className="artwork-corner artwork-corner--tl" />
            <span className="artwork-corner artwork-corner--tr" />
            <span className="artwork-corner artwork-corner--bl" />
            <span className="artwork-corner artwork-corner--br" />
            <span className="artwork-mote artwork-mote--1" />
            <span className="artwork-mote artwork-mote--2" />
            <span className="artwork-mote artwork-mote--3" />
            <span className="artwork-mote artwork-mote--4" />
            <span className="artwork-mote artwork-mote--5" />
            <span className="artwork-mote artwork-mote--6" />
            <span className="artwork-mote artwork-mote--7" />
            <span className="artwork-mote artwork-mote--8" />
            <span className="artwork-mote artwork-mote--9" />
            <span className="artwork-mote artwork-mote--10" />
            <span className="artwork-mote artwork-mote--11" />
            <span className="artwork-mote artwork-mote--12" />
            <span className="artwork-mote artwork-mote--13" />
            <span className="artwork-mote artwork-mote--14" />
          </div>
          <DepthCarousel
            items={artworkItems}
            cardWidth={350}
            cardHeight={430}
            depth={210}
            spread={94}
            tilt={18}
            perspective={1400}
            visibleCards={1.5}
            falloff={0.24}
            blur={2}
            loop
            showControls
            showIndicators
          />
          <p className="artwork-credit">HUGOWESTON <span>·</span> ORIGINAL SKETCHES</p>
        </div>
      </div>
    </section>
  );
}

function PhotographyShowcase() {
  return (
    <section className="photography-section section-pad" id="photography">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow"><span>05</span> PHOTOGRAPHY</p><h2 className="section-title">摄影作品<span className="red-dot">.</span></h2></div>
          <p className="heading-note">用镜头记录光线、空间和日常片刻。</p>
        </div>
        <div className="artwork-gallery" data-reveal>
          <DepthCarousel
            items={photographyItems}
            cardWidth={300}
            cardHeight={380}
            depth={190}
            spread={78}
            tilt={17}
            perspective={1400}
            visibleCards={2}
            falloff={0.2}
            blur={3}
            loop
            showControls
            showIndicators
          />
          <p className="artwork-credit">HUGOWESTON <span>·</span> PHOTO ARCHIVE</p>
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="strengths-section section-pad" id="strengths">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow"><span>06</span> WHAT I BRING</p><h2 className="section-title">我的个人优势<span className="red-dot">.</span></h2></div>
          <p className="heading-note">能力不是标签，是一次次练习留下的痕迹。</p>
        </div>
        <div className="strength-grid">
          {strengths.map((item) => (
            <article className="strength-card" key={item.index} data-reveal>
              <div className="strength-top"><span>{item.index}</span><span className="strength-cross">+</span></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="strength-detail">{item.detail}</div>
            </article>
          ))}
        </div>
        <div className="skill-strip" data-reveal><span>IN MY TOOLKIT</span><div><b>外语学习</b><i />钢琴<i />绘画与数位板<i />视频剪辑<i />Python</div></div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const email = '2916434975@qq.com';

  const copyEmail = (event) => {
    event.preventDefault();
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done).catch(done);
    } else {
      done();
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-grid-pattern" />
      <CyberRain />
      <div className="page-width contact-inner" data-reveal>
        <p className="eyebrow"><span>07</span> KEEP IN TOUCH</p>
        <p className="contact-pretitle">每一次交流，都是新的开始。<Clock label=" · SHENYANG " /></p>
        <h2>下一段<span className="hl-red">故事</span>，<br /><span className="hl-soft">从认识</span><span className="hl-red">开始。</span></h2>
        <a className="contact-email" href={`mailto:${email}`} onClick={copyEmail}>{email} <Arrow diagonal /></a>
        <div className="contact-bottom">
          <span>沈阳</span>
          <a href="https://github.com/Hugoweston28" target="_blank" rel="noreferrer">GITHUB <Arrow diagonal /></a>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </div>
      <div className="contact-watermark">H.</div>
      <div className={`copy-toast${copied ? ' is-show' : ''}`} role="status" aria-live="polite">已复制邮箱 · {email}</div>
    </section>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [particles, setParticles] = useState([]);
  const particleId = useRef(0);
  const lastSpawn = useRef(0);
  useSiteFx(entered);

  useEffect(() => {
    document.body.classList.toggle('entry-locked', !entered);
    return () => document.body.classList.remove('entry-locked');
  }, [entered]);

  useEffect(() => {
    if (!entered) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    let x = 0;
    let y = 0;
    const spawn = () => {
      frame = 0;
      const now = performance.now();
      if (now - lastSpawn.current < 18) return;
      lastSpawn.current = now;
      const id = particleId.current++;
      const drift = (Math.random() * 2 - 1) * 64;
      const fall = 70 + Math.random() * 110;
      const size = 4 + Math.random() * 5;
      const life = 900 + Math.random() * 700;
      setParticles((prev) => (prev.length > 140 ? prev : [...prev, { id, x, y, drift, fall, size, life }]));
    };
    const handleMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(spawn);
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [entered]);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const handlePointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', `${pointerX}px`);
        root.style.setProperty('--pointer-y', `${pointerY}px`);
        root.style.setProperty('--hero-drift-x', `${(pointerX / window.innerWidth - 0.5) * -12}px`);
        root.style.setProperty('--hero-drift-y', `${(pointerY / window.innerHeight - 0.5) * -8}px`);
        frame = 0;
      });
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!entered) return undefined;
    const splitRevealText = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent || parent.closest('[data-nosplit]')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const nodes = [];
      let current;
      while ((current = walker.nextNode())) nodes.push(current);
      let index = 0;
      nodes.forEach((node) => {
        const tokens = node.nodeValue.match(/[A-Za-z0-9@:/.·''-]+|\s+|[\s\S]/g) || [];
        const fragment = document.createDocumentFragment();
        tokens.forEach((token) => {
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
            return;
          }
          const span = document.createElement('span');
          span.className = 'reveal-char';
          span.setAttribute('data-nosplit', '');
          span.style.setProperty('--wi', String(index++));
          span.textContent = token;
          fragment.appendChild(span);
        });
        node.parentNode.replaceChild(fragment, node);
      });
    };
    document.querySelectorAll('[data-reveal]').forEach(splitRevealText);
    const revealItems = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
    return () => revealObserver.disconnect();
  }, [entered]);

  return <div className={`site-shell ${entered ? 'is-ready' : ''}`}>
    <div className="cursor-aura" aria-hidden="true" />
    <div className="cursor-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="cursor-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--drift': `${p.drift}px`,
            '--fall': `${p.fall}px`,
            animationDuration: `${p.life}ms`,
          }}
          onAnimationEnd={() => setParticles((prev) => prev.filter((item) => item.id !== p.id))}
        />
      ))}
    </div>
    <Hero />
    <main><About /><Projects /><GuessNumber /><MusicShowcase /><ArtworkShowcase /><PhotographyShowcase /><Strengths /></main>
    <Contact />
    {!entered && <EntryGate onEnter={() => setEntered(true)} />}
  </div>;
}
