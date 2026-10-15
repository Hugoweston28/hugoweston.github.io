import { useEffect, useRef, useState } from 'react';
import './Echo.css';

// 六个音取自 C 大调五声音阶（C D E G A + 高八度 C）。
// 五声音阶的任意排列都不会难听，所以"回声"里每一段随机旋律都像随口哼出来的调子；
// 音高全部由 Web Audio 现场合成，不引任何音频文件（站点里零外域请求是硬要求）。
const KEYS = [
  { freq: 261.63, note: 'C', label: '1' },
  { freq: 293.66, note: 'D', label: '2' },
  { freq: 329.63, note: 'E', label: '3' },
  { freq: 392.0, note: 'G', label: '4' },
  { freq: 440.0, note: 'A', label: '5' },
  { freq: 523.25, note: 'C', label: '6', high: true },
];

const START_LENGTH = 3;  // 第一段 3 个音，之后每答对一次多一个
const STEP_MS = 600;     // 播放时相邻两个音的间隔
const FLASH_MS = 330;    // 单个音亮起的时长
const BEST_KEY = 'hugoweston-echo-best';

// 没有 Web Audio 的内核（极老的 X5）直接降级成纯视觉版：照样能玩，只是没声音。
const AUDIO_OK = typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext);

const randomNote = () => Math.floor(Math.random() * KEYS.length);

const readBest = () => {
  try { return Number(window.localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
};

const writeBest = (value) => {
  try { window.localStorage.setItem(BEST_KEY, String(value)); } catch { /* 隐私模式下写不进去，忽略 */ }
};

function Echo() {
  const [phase, setPhaseUi] = useState('idle');   // idle | demo（放旋律）| input（等你按）| over
  const [sequence, setSequenceUi] = useState([]);
  const [cursor, setCursorUi] = useState(0);      // 已经按对了几个音
  const [lit, setLit] = useState(-1);             // 正在亮起的键
  const [missed, setMissed] = useState(false);
  const [best, setBest] = useState(readBest);
  const silent = !AUDIO_OK;

  const timers = useRef([]);
  const audioRef = useRef(null);
  // 键盘监听挂在 window 上，是长生命周期回调，读不到最新 state，
  // 所以把"权威值"留一份在 ref 里：每次变更时和 state 一起写。
  const live = useRef({ phase: 'idle', sequence: [], cursor: 0 });
  const bestRef = useRef(best);
  const pressRef = useRef(() => {});

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  const later = (fn, delay) => {
    const id = window.setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  };

  const goPhase = (next) => { live.current.phase = next; setPhaseUi(next); };
  const goSequence = (next) => { live.current.sequence = next; setSequenceUi(next); };
  const goCursor = (next) => { live.current.cursor = next; setCursorUi(next); };

  // ── 声音 ──
  // AudioContext 必须在用户手势（点按钮 / 敲数字键）里创建或 resume：
  // 否则手机和微信、QQ 内置浏览器会一直停在 suspended 状态，一点声音都没有。
  const ensureAudio = () => {
    if (!AUDIO_OK) return null;
    if (!audioRef.current) {
      try {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return null;
        audioRef.current = new Ctor();
      } catch { return null; }
    }
    const ctx = audioRef.current;
    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      const promise = ctx.resume();
      if (promise && typeof promise.catch === 'function') promise.catch(() => {});
    }
    return ctx;
  };

  const tone = (index) => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const at = ctx.currentTime;
    const duration = 0.55;
    // 快起快落的包络 + 一个二倍频泛音：听起来像敲了一下琴键，而不是长长的电子音。
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.2, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(KEYS[index].freq, at);
    const overtone = ctx.createOscillator();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(KEYS[index].freq * 2, at);
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.06, at);
    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(ctx.destination);
    osc.start(at);
    overtone.start(at);
    osc.stop(at + duration + 0.02);
    overtone.stop(at + duration + 0.02);
  };

  const flash = (index) => {
    tone(index);
    setLit(index);
    later(() => setLit((current) => (current === index ? -1 : current)), FLASH_MS);
  };

  // 最高分落盘的副作用不能写在 setState 的 updater 里（StrictMode 会调用两次），
  // 所以先用 ref 比较，再依次更新 ref / state / localStorage。
  const noteReached = (length) => {
    if (length <= bestRef.current) return;
    bestRef.current = length;
    setBest(length);
    writeBest(length);
  };
  const playSequence = (seq) => {
    clearTimers();
    setMissed(false);
    goPhase('demo');
    goCursor(0);
    seq.forEach((note, index) => later(() => flash(note), index * STEP_MS + 160));
    later(() => goPhase('input'), seq.length * STEP_MS + 300);
  };

  const start = () => {
    ensureAudio(); // 借这次点击 / 按键把 AudioContext 唤醒
    const seq = Array.from({ length: START_LENGTH }, randomNote);
    goSequence(seq);
    playSequence(seq);
  };

  const extend = () => {
    const seq = [...live.current.sequence, randomNote()];
    goSequence(seq);
    playSequence(seq);
  };

  const press = (index) => {
    const state = live.current;
    if (state.phase === 'idle' || state.phase === 'over') { start(); return; }
    if (state.phase !== 'input') return; // 正在放旋律时按键不生效，避免乱按打乱节奏
    flash(index);
    const seq = state.sequence;
    const step = state.cursor;
    if (index !== seq[step]) {
      setMissed(true);
      goPhase('over');
      return;
    }
    const next = step + 1;
    goCursor(next);
    if (next === seq.length) {
      noteReached(seq.length);
      goPhase('demo');
      later(() => extend(), 800); // 整段都对：停一下，然后给出更长的一段
    }
  };

  useEffect(() => { pressRef.current = press; });

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const index = KEYS.findIndex((key) => key.label === event.key);
      if (index < 0) return;
      if (live.current.phase === 'input') event.preventDefault();
      pressRef.current(index);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => () => {
    clearTimers();
    const ctx = audioRef.current;
    if (ctx && typeof ctx.close === 'function') {
      const promise = ctx.close();
      if (promise && typeof promise.catch === 'function') promise.catch(() => {});
    }
    audioRef.current = null;
  }, []);
  // 反馈文案：文案本身随状态变化，所以整块面板都带 data-nosplit，
  // 避免被进场时的拆字逻辑替换掉文本节点。
  const feedback = (() => {
    if (phase === 'idle') return { index: 'READY', message: `按下开始，听一段 ${START_LENGTH} 个音的旋律`, state: '' };
    if (phase === 'demo') {
      return cursor === sequence.length && sequence.length > 0
        ? { index: 'PERFECT', message: '全对，下一段再多一个音', state: 'correct' }
        : { index: 'LISTEN', message: `正在播放 ${sequence.length} 个音`, state: '' };
    }
    if (phase === 'input') return { index: 'YOUR TURN', message: `按出第 ${cursor + 1} / ${sequence.length} 个音`, state: '' };
    return { index: 'MISSED', message: `记住了 ${sequence.length} 个音，再来一次`, state: 'error' };
  })();

  return (
    <section className="echo-section section-pad" id="echo">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow"><span>04</span> PLAYGROUND / EAR TRAINING</p>
            <h2 className="section-title">先听一遍<span className="red-dot">.</span></h2>
          </div>
          <p className="heading-note">六个音，一段越来越长的旋律：听清顺序，再按出来。</p>
        </div>

        <div className="echo-grid" data-reveal>
          <div className="echo-copy">
            <p className="game-kicker">回声<i>.</i></p>
            <p className="game-intro">我先弹一段旋律，你听完按同样的顺序复述出来。每答对一次，下一段就多一个音；听错一个音，这一轮就结束。</p>
            <ul className="game-rules">
              <li><span>01</span>播放时只用听，不必按键</li>
              <li><span>02</span>轮到你时，按顺序点这六个键</li>
              <li><span>03</span>电脑上也可以直接敲键盘 1–6</li>
            </ul>
            <div className="game-actions">
              <button className="submit-button" type="button" onClick={start}>
                <span>{phase === 'idle' ? '开始' : '重来'}</span><b aria-hidden="true">→</b>
              </button>
              <span className="game-note">
                {silent ? '当前浏览器没有可用的音频接口，这一版是无声的。' : '音高由浏览器现场合成，不加载任何音频文件。'}
              </span>
            </div>
          </div>

          <div className="game-panel echo-panel" data-nosplit>
            <div className="panel-top"><span>ECHO / LISTEN</span><span>MEMORY {String(sequence.length).padStart(2, '0')}</span></div>
            <div className={`feedback${feedback.state ? ` is-${feedback.state}` : ''}${missed && phase === 'over' ? ' is-error' : ''}`} role="status" aria-live="polite">
              <span className="feedback-index">{feedback.index}</span>
              <strong>{feedback.message}</strong>
            </div>

            <div className="echo-progress" aria-hidden="true">
              {sequence.map((note, index) => (
                <span key={`${note}-${index}`} className={index < cursor ? 'is-done' : ''} />
              ))}
            </div>

            <div className="echo-keys">
              {KEYS.map((key, index) => (
                <button
                  key={key.label}
                  type="button"
                  className={`echo-key${key.high ? ' is-high' : ''}${lit === index ? ' is-lit' : ''}`}
                  onClick={() => press(index)}
                  aria-label={`第 ${index + 1} 个音，${key.note}`}
                >
                  <b>{key.label}</b>
                  <i>{key.note}</i>
                </button>
              ))}
            </div>

            <div className="panel-bottom">
              <div className="attempt-counter"><strong>{String(best).padStart(2, '0')}</strong><span>最长记忆</span></div>
              <button className="restart-button" type="button" onClick={start}>重新开始 <span aria-hidden="true">↻</span></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Echo;
