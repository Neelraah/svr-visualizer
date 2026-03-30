export default function StepViewer({ step }) {
  if (!step) {
    return (
      <div className="card">
        <h3>Training State</h3>
        <p>No step loaded</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Training State</h3>

      <p><strong>Iteration:</strong> {step.iter ?? 0}</p>
      <p><strong>Loss:</strong> {step.loss ? step.loss.toFixed(3) : 0}</p>

      <h4>Model Weights</h4>
      <p>Slope: {step.slope?.toFixed?.(4) ?? "N/A"}</p>
      <p>Intercept: {step.intercept?.toFixed?.(4) ?? "N/A"}</p>

      <p>
        <strong>Support Vectors:</strong>{" "}
        {step.supportVectors ? step.supportVectors.length : 0}
      </p>

      <h4>What is happening?</h4>

<p>
  {step.iter === 0 && "The model starts with an initial guess of the function."}

  {step.iter > 0 && step.iter < 10 &&
    "The model is adjusting itself to reduce prediction error."}

  {step.iter >= 10 && step.iter < 20 &&
    "Support vectors are influencing the model more strongly now."}

  {step.iter >= 20 &&
    "The model is stabilizing and converging to a final solution."}
</p>
    </div>
  );
}

