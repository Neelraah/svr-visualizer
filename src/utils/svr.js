function rbfPredict(x, data, alpha, gamma = 0.5) {
  let sum = 0;

  data.forEach((d, i) => {
    const dist = x - d.x;
    sum += alpha[i] * Math.exp(-gamma * dist * dist);
  });

  return sum;
}


export function trainSVR(data, params) {
  let slope = 0;
  let intercept = 0;

  const steps = [];
  const lossHistory = [];
  let alpha = new Array(data.length).fill(0);

  for (let iter = 0; iter < 25; iter++) {
    let loss = 0;

    const predictions = data.map((d, i) => {
    const pred = rbfPredict(d.x, data, alpha);
    const error = d.y - pred;

    if (Math.abs(error) > params.epsilon) {
      loss += Math.abs(error);
      alpha[i] += 0.01 * error;
    }

    return { ...d, pred };
  });

    const supportVectors = predictions.filter(
      d => Math.abs(d.y - d.pred) > params.epsilon
    );

    lossHistory.push(loss);

    steps.push({
      iter,
      alpha,
      epsilon: params.epsilon,
      supportVectors,
      predictions,
      loss
    });
  }

  return { steps, lossHistory };
}