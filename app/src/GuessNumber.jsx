import { useState } from 'react';
import './GuessNumber.css';

const createAnswer = () => Math.floor(Math.random() * 100) + 1;

function GuessNumber() {
  const [answer, setAnswer] = useState(createAnswer);
  const [attempts, setAttempts] = useState(0);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState({ index: 'READY', message: '等你来猜', state: '' });
  const [history, setHistory] = useState([]);

  const submit = (event) => {
    event.preventDefault();
    if (finished) return;
    const guess = Number(value);
    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      setFeedback({ index: 'INPUT ERROR', message: '请输入 1–100 之间的整数', state: 'error' });
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    let recordClass = '';
    let fb;
    if (guess > answer) {
      recordClass = 'is-high';
      fb = { index: 'TOO HIGH', message: '大了，再试试', state: '' };
    } else if (guess < answer) {
      recordClass = 'is-low';
      fb = { index: 'TOO LOW', message: '小了，再试试', state: '' };
    } else {
      recordClass = 'is-correct';
      fb = { index: 'CORRECT', message: `猜对了，答案就是 ${answer}`, state: 'correct' };
    }
    setFeedback(fb);
    setHistory((prev) => [...prev, { value: String(guess).padStart(2, '0'), className: recordClass }]);
    setValue('');
    if (guess === answer) setFinished(true);
  };

  const restart = () => {
    setAnswer(createAnswer());
    setAttempts(0);
    setRound((r) => r + 1);
    setFinished(false);
    setValue('');
    setFeedback({ index: 'READY', message: '等你来猜', state: '' });
    setHistory([]);
  };

  return (
    <section className="game-section section-pad" id="play">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow"><span>03</span> PLAYGROUND / INTERACTIVE</p>
            <h2 className="section-title">先玩一下<span className="red-dot">.</span></h2>
          </div>
          <p className="heading-note">一个用 Python 写的小游戏，这里可以直接试玩。</p>
        </div>

        <div className="game-grid" data-reveal>
          <div className="game-copy">
            <p className="game-kicker">猜个数字<i>.</i></p>
            <p className="game-intro">我已经想好一个 1 到 100 之间的数字。试着猜中它，看看你需要几次。</p>
            <div className="range-markers" aria-label="数字范围"><span>01</span><span className="range-line" /><span>100</span></div>

            <form className="game-form" onSubmit={submit} noValidate>
              <label htmlFor="guess-input">输入你的猜测</label>
              <div className="input-row">
                <input
                  id="guess-input"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  inputMode="numeric"
                  placeholder="?"
                  autoComplete="off"
                  value={value}
                  disabled={finished}
                  onChange={(event) => setValue(event.target.value)}
                />
                <button className="submit-button" type="submit" disabled={finished}>
                  <span>{finished ? '已猜中' : '确认'}</span><b aria-hidden="true">→</b>
                </button>
              </div>
            </form>
          </div>

          <div className="game-panel" data-nosplit>
            <div className="panel-top"><span>GUESS / INPUT</span><span>ROUND {String(round).padStart(2, '0')}</span></div>
            <div className={`feedback ${feedback.state ? `is-${feedback.state}` : ''}`.trim()} role="status" aria-live="polite">
              <span className="feedback-index">{feedback.index}</span>
              <strong>{feedback.message}</strong>
            </div>
            <div className="panel-bottom">
              <div className="attempt-counter"><strong>{String(attempts).padStart(2, '0')}</strong><span>次尝试</span></div>
              <button className="restart-button" type="button" onClick={restart}>重新开始 <span aria-hidden="true">↻</span></button>
            </div>
            <div className="history-heading"><span>猜测记录</span><span>{attempts} {attempts === 1 ? 'GUESS' : 'GUESSES'}</span></div>
            {history.length === 0
              ? <p className="history-empty">你的每一次猜测都会出现在这里。</p>
              : <ol className="guess-history">
                  {history.map((item, i) => (
                    <li key={`${item.value}-${i}`} className={item.className}>{item.value}</li>
                  ))}
                </ol>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GuessNumber;
