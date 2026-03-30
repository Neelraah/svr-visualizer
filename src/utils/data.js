export function generateSampleData() {
  const data = [];

  const noise = Math.random() * 0.5;
  const freq = 0.8 + Math.random() * 0.6;

  for (let x = -5; x <= 5; x += 0.3) {
    const y = Math.sin(freq * x) + (Math.random() - 0.5) * noise;
    data.push({ x, y });
  }

  return data;
}