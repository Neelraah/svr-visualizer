import { useState, useEffect } from "react";
import DataInput from "./components/DataInput";
import Controls from "./components/Controls";
import Visualization from "./components/Visualization";
import StepViewer from "./components/StepViewer";
import { trainSVR } from "./utils/svr";

export default function App() {
  const [data, setData] = useState([]);
  const [params, setParams] = useState({ epsilon: 0.5 });

  const [playing, setPlaying] = useState(false);
  const [steps, setSteps] = useState([]);
  const [lossHistory, setLossHistory] = useState([]);
  const [index, setIndex] = useState(0);

  const currentStep = steps[index];

  const handleTrain = () => {
    const { steps, lossHistory } = trainSVR(data, params);
    setSteps(steps);
    setLossHistory(lossHistory);
    setIndex(0);
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing || steps.length === 0) return;

    const interval = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          clearInterval(interval);
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [playing, steps]);

  return (
    <div className="app-shell">
      <header className="hero card">
        <span className="eyebrow">Machine Learning Playground</span>
        <h1>SVR Visualizer</h1>
        <p>
          Explore how Support Vector Regression learns by iteratively fitting a
          prediction curve, discovering support vectors, and reducing loss.
        </p>
      </header>

      <section className="card info-grid">
        <article>
          <h2>What is SVR?</h2>
          <p>
            Support Vector Regression predicts continuous values while allowing
            small errors within an <strong>epsilon (ε)</strong> margin.
          </p>
          <ul>
            <li>
              <strong>Epsilon Tube:</strong> area where small deviations are
              ignored
            </li>
            <li>
              <strong>Support Vectors:</strong> key points outside the margin
            </li>
            <li>
              <strong>Kernel Trick:</strong> captures nonlinear patterns
            </li>
          </ul>
        </article>

        <article>
          <h2>Concept Video</h2>
          <div className="video-container">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/T5pnH5XnG2A"
              title="SVR Explanation"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </article>
      </section>

      <section className="panel-grid input-grid">
        <div className="card">
          <DataInput setData={setData} />
        </div>
        <div className="card">
          <Controls params={params} setParams={setParams} />
        </div>
      </section>

      <section className="card control-panel">
        <div className="panel-header">
          <h3>Training Controls</h3>
          <span className="step-pill">
            Step: {steps.length ? index + 1 : 0} / {steps.length}
          </span>
        </div>

        <div className="controls-row">
          <button className="btn btn-primary" onClick={handleTrain}>
            Train Model
          </button>
          <button
            className="btn btn-success"
            onClick={() => setPlaying(true)}
            disabled={playing || steps.length === 0}
          >
            ▶ Play
          </button>
          <button
            className="btn btn-muted"
            onClick={() => setPlaying(false)}
            disabled={!playing}
          >
            ⏸ Pause
          </button>
        </div>

        <div className="controls-row">
          <button
            className="btn"
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0 || steps.length === 0}
          >
            ⬅ Prev
          </button>
          <button
            className="btn"
            onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
            disabled={index === steps.length - 1 || steps.length === 0}
          >
            Next ➡
          </button>
        </div>

        <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length || 1} aria-valuenow={steps.length ? index + 1 : 0}>
          <div
            className="progress-fill"
            style={{
              width: `${steps.length ? ((index + 1) / steps.length) * 100 : 0}%`,
            }}
          />
        </div>
      </section>

      <section className="panel-grid viz-grid">
        <div className="card viz-card">
          <Visualization data={data} step={currentStep} />
        </div>
        <div className="card step-card">
          <StepViewer step={currentStep} lossHistory={lossHistory} />
        </div>
      </section>
    </div>
  );
}
