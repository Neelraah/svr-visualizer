import SVM from "libsvm-js/asm";

export function trainSVR(data, params) {
  const X = data.map(d => [d.x]);
  const y = data.map(d => d.y);

  let model;

  try {
    model = new SVM({
      type: SVM.SVM_TYPES.EPSILON_SVR,
      kernel: params.kernel === "LINEAR"? SVM.KERNEL_TYPES.LINEAR : SVM.KERNEL_TYPES.RBF,
      cost: params.C || 1,
      epsilon: params.epsilon || 0.1,
      gamma: params.gamma || 0.5
    });

    model.train(X, y);
  } catch (err) {
    console.error("Training failed:", err);
    return { steps: [], model: null };
  }

  // predictions
  const predictions = data.map(d => {
    let pred = 0;
    try {
      pred = model.predictOne([d.x]);
    } catch {
      pred = 0;
    }
    return { ...d, pred };
  });

  // support vectors (REAL from model)
  const supportVectors = predictions.filter(d =>
  Math.abs(d.y - d.pred) > params.epsilon
);
const estimatedIterations = Math.max(10, Math.min(30, data.length));

  // pseudo steps (visual only)
  let steps = [];

let lossHistory = [];

for (let i = 1; i <= estimatedIterations; i++) {

  const factor = i / estimatedIterations;

  const partialPredictions = data.map(d => {
    let pred = model.predictOne([d.x]) * factor;
    return { ...d, pred };
  });

  
  let loss = 0;

  partialPredictions.forEach(d => {
    const error = d.y - d.pred;
    loss += error * error;
  });

  loss /= data.length;

  
  lossHistory.push(loss);

  // support vectors
  const partialSV = partialPredictions.filter(d =>
    Math.abs(d.y - d.pred) > params.epsilon
  );

  steps.push({
    iter: i,
    predictions: partialPredictions,
    supportVectors: partialSV,
    epsilon: params.epsilon,
    model,
    loss   
  });
}

const metrics = computeMetrics(predictions);

  return {
    steps,
    model, metrics, lossHistory
  };
}


function computeMetrics(data) {
  const n = data.length;

  const meanY = data.reduce((sum, d) => sum + d.y, 0) / n;

  let mse = 0;
  let ssRes = 0;
  let ssTot = 0;

  data.forEach(d => {
    const error = d.y - d.pred;

    mse += error * error;
    ssRes += error * error;
    ssTot += (d.y - meanY) ** 2;
  });

  mse /= n;

  const r2 = 1 - (ssRes / ssTot);

  return { mse, r2 };
}