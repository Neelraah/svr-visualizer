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
  };


  useEffect(() => {
  if (!playing || steps.length === 0) return;

  const interval = setInterval(() => {
    setIndex((i) => {
      if (i >= steps.length - 1) {
        clearInterval(interval);
        return i;
      }
      return i + 1;
    });
  }, 500);

  return () => clearInterval(interval);
}, [playing, steps]);


  return (
    <div className="container">

      <h1>SVR Visualizer</h1>

      <div className="card">
  <h2>What is Support Vector Regression (SVR)?</h2>

  <p>
    Support Vector Regression (SVR) is a machine learning algorithm used for predicting continuous values.
    Instead of fitting all data points exactly, SVR tries to fit a function within a margin of tolerance
    called <strong>epsilon (ε)</strong>.
  </p>

  <ul>
    <li><strong>Epsilon Tube:</strong> Region where errors are ignored</li>
    <li><strong>Support Vectors:</strong> Points outside the margin that influence the model</li>
    <li><strong>Kernel Trick:</strong> Allows modeling nonlinear relationships</li>
  </ul>

  <p>
    This visualizer shows how SVR learns step-by-step by adjusting the model,
    identifying support vectors, and minimizing error over iterations.
  </p>
</div>

<div className="card">
  <h2>Concept Explanation Video</h2>

  <div className="video-container">
    <iframe
      width="100%"
      height="400"
      src="https://www.youtube.com/embed/T5pnH5XnG2A"
      title="SVR Explanation"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  </div>
</div>

      <div className="row">
        <DataInput setData={setData} />
        <Controls params={params} setParams={setParams} />
      </div>

     <div className="card">
  <h3>Controls</h3>

  <div className="controls-row">
    <button onClick={handleTrain}>Train</button>

    <button
      onClick={() => setPlaying(true)}
      disabled={playing}
    >
      ▶ Play
    </button>

    <button
      onClick={() => setPlaying(false)}
      disabled={!playing}
    >
      ⏸ Pause
    </button>
  </div>

  <div className="controls-row">
    <button
      onClick={() => setIndex(i => Math.max(i - 1, 0))}
      disabled={index === 0}
    >
      ⬅ Prev
    </button>

    <button
      onClick={() =>
        setIndex(i => Math.min(i + 1, steps.length - 1))
      }
      disabled={index === steps.length - 1}
    >
      Next ➡
    </button>
  </div>

  <div className="progress">
    Step: {steps.length ? index + 1 : 0} / {steps.length}
  </div>
</div>

      <div className="row">
        <Visualization data={data} step={currentStep} />
        <StepViewer step={currentStep} />
      </div>

    </div>
  );
}