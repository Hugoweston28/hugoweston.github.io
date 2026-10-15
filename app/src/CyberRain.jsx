const buildColumns = (count) => {
  const columns = [];
  for (let i = 0; i < count; i += 1) {
    const r1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const r2 = (Math.sin(i * 78.233) * 12345.6789) % 1;
    const r3 = (Math.sin(i * 39.425) * 9876.54321) % 1;
    const r4 = (Math.sin(i * 15.963) * 24680.13579) % 1;
    const abs = (n) => Math.abs(n);
    const left = abs(r1) * 96;
    const height = 30 + abs(r2) * 55;
    const duration = 7 + abs(r3) * 8;
    const delay = abs(r4) * 9;
    const colorSeed = abs(r1 * 3 + r2 * 7);
    const color = colorSeed < 0.5 ? 'red' : colorSeed < 0.8 ? 'white' : 'gold';
    const digitCount = 6 + Math.floor(abs(r3) * 6);
    const digits = [];
    for (let d = 0; d < digitCount; d += 1) {
      const rd = abs(Math.sin((i * 31.7 + d * 17.3) * 10000));
      digits.push({ value: Math.floor(rd * 11), opacity: 0.25 + abs(Math.sin(d * 3.1)) * 0.6 });
    }
    columns.push({ id: i, left, height, duration, delay, color, digits });
  }
  return columns;
};

export default function CyberRain({ count = 20 }) {
  const columns = buildColumns(count);
  return (
    <div className="cyber-rain" aria-hidden="true">
      {columns.map((col) => (
        <span
          key={col.id}
          className={`cyber-column cyber-column--${col.color}`}
          style={{
            left: `${col.left}%`,
            height: `${col.height}%`,
            animationDuration: `${col.duration}s`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {col.digits.map((digit, index) => (
            <b key={index} style={{ opacity: digit.opacity }}>{digit.value}</b>
          ))}
        </span>
      ))}
    </div>
  );
}
