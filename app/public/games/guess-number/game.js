(() => {
  const form = document.querySelector('#guess-form');
  const input = document.querySelector('#guess-input');
  const feedback = document.querySelector('#feedback');
  const feedbackIndex = feedback.querySelector('.feedback-index');
  const feedbackText = feedback.querySelector('strong');
  const attemptCount = document.querySelector('#attempt-count');
  const history = document.querySelector('#guess-history');
  const historyEmpty = document.querySelector('#history-empty');
  const historyTotal = document.querySelector('#history-total');
  const restartButton = document.querySelector('#restart-button');
  const roundLabel = document.querySelector('#round-label');

  let answer = createAnswer();
  let attempts = 0;
  let round = 1;
  let finished = false;

  function createAnswer() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function setFeedback(index, message, state = '') {
    feedbackIndex.textContent = index;
    feedbackText.textContent = message;
    feedback.classList.toggle('is-correct', state === 'correct');
    feedback.classList.toggle('is-error', state === 'error');
  }

  function submitGuess(event) {
    event.preventDefault();
    if (finished) return;

    const guess = Number(input.value);
    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      setFeedback('INPUT ERROR', '请输入 1–100 之间的整数', 'error');
      input.focus();
      return;
    }

    attempts += 1;
    attemptCount.textContent = String(attempts).padStart(2, '0');
    historyEmpty.hidden = true;

    const record = document.createElement('li');
    record.textContent = String(guess).padStart(2, '0');
    if (guess > answer) {
      record.className = 'is-high';
      setFeedback('TOO HIGH', '大了，再试试');
    } else if (guess < answer) {
      record.className = 'is-low';
      setFeedback('TOO LOW', '小了，再试试');
    } else {
      record.className = 'is-correct';
      setFeedback('CORRECT', `猜对了，答案就是 ${answer}`, 'correct');
      finished = true;
      input.disabled = true;
      form.querySelector('.submit-button span').textContent = '已猜中';
      restartButton.focus();
    }

    history.append(record);
    historyTotal.textContent = `${attempts} ${attempts === 1 ? 'GUESS' : 'GUESSES'}`;
    input.value = '';
    if (!finished) input.focus();
  }

  function restart() {
    answer = createAnswer();
    attempts = 0;
    round += 1;
    finished = false;
    input.disabled = false;
    input.value = '';
    attemptCount.textContent = '00';
    history.replaceChildren();
    historyEmpty.hidden = false;
    historyTotal.textContent = '0 GUESSES';
    roundLabel.textContent = `ROUND ${String(round).padStart(2, '0')}`;
    form.querySelector('.submit-button span').textContent = '确认';
    setFeedback('READY', '等你来猜');
    input.focus();
  }

  form.addEventListener('submit', submitGuess);
  restartButton.addEventListener('click', restart);
  input.focus({ preventScroll: true });
})();
