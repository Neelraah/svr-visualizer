export function generateSampleData() {
  const data = [];

  for (let x = -5; x <= 5; x += 0.5) {
    const y = Math.sin(x) + Math.random() * 0.4;
    data.push({ x, y });
  }

  return data;
}