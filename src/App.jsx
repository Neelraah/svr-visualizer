import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DataInput from "./components/DataInput";
import Controls from "./components/Controls";
import Visualization from "./components/Visualization";
import StepViewer from "./components/StepViewer";
import LossGraph from "./components/LossGraph";
import { trainSVR } from "./utils/svr";
import m1 from "./assets/mememe.jpeg";
import m2 from "./assets/i1.jpg";
import m3 from "./assets/Shruti.jpeg";
import m4 from "./assets/prof.jpeg";
import "./index.css";
import { Routes, Route, Link } from "react-router-dom";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import Page4 from "./Page4";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

// 🔥 Animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 }
};

export default function App() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [params, setParams] = useState({ epsilon: 0.5 });
  const [model, setModel] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [steps, setSteps] = useState([]);
  const [lossHistory, setLossHistory] = useState([]);
  const [index, setIndex] = useState(0);
  const [metrics, setMetrics] = useState(null);

  const currentStep = steps[index];

  const handleTrain = () => {
    const { steps, model, metrics, lossHistory } = trainSVR(data, params);
    setSteps(steps);
    setModel(model);
    setMetrics(metrics);
    setLossHistory(lossHistory);
    setIndex(0);
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

  const exportCSV = () => {
    if (!model || !data.length) return;

    const rows = data.map(d => {
      let pred = 0;
      try {
        pred = model.predictOne([d.x]);
      } catch {
        pred = 0;
      }

      return {
        x: d.x,
        actual: d.y,
        predicted: Number(pred.toFixed(4))
      };
    });

    const csv = [
      ["x", "actual", "predicted"],
      ...rows.map(r => [r.x, r.actual, r.predicted])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "svr_output.csv";
    a.click();
  };


  return (
  <motion.div
    className="app-shell"
    initial="hidden"
    animate="visible"
    variants={stagger}
  >

    {/* ✅ NAVBAR (ONLY ADDITION) */}
    <motion.nav className="nav-bar">
  <NavLink to="/" className="nav-btn">Home</NavLink>
  <NavLink to="/page1" className="nav-btn">Theory</NavLink>
  <NavLink to="/page2" className="nav-btn">Guide</NavLink>
  <NavLink to="/page3" className="nav-btn">Resources</NavLink>
  <NavLink to="/page4" className="nav-btn">Team</NavLink>
</motion.nav>

    {/* ✅ ROUTES (DOES NOT TOUCH YOUR UI) */}
    <AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>

      {/* YOUR EXISTING PAGE */}
      <Route path="/" element={
        <>

          {/* HERO */}
          <motion.header className="hero card" variants={fadeUp}>
            <span className="eyebrow">Machine Learning Playground</span>
            <h1>SVR Visualizer</h1>
            <p>
              Explore how Support Vector Regression learns by iteratively fitting a
              prediction curve, discovering support vectors, and reducing loss.
            </p>
          </motion.header>

          {/* INFO */}
          <motion.section className="card info-grid" variants={stagger}>
            <motion.article variants={fadeUp}>
              <h2>What is SVR?</h2>
              <p>
                Support Vector Regression predicts continuous values while allowing
                small errors within an <strong>epsilon (ε)</strong> margin.
              </p>
              <ul>
                <li><strong>Epsilon Tube:</strong> ignores small errors</li>
                <li><strong>Support Vectors:</strong> critical points</li>
                <li><strong>Kernel Trick:</strong> handles non-linearity</li>
              </ul>
            </motion.article>

            <motion.article variants={fadeUp}>
              <h2>Concept Video</h2>
              <div className="video-container">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/kPw1IGUAoY8"
                  title="SVR Explanation"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </motion.article>
          </motion.section>

          {/* INPUT */}
          <motion.section className="panel-grid input-grid" variants={stagger}>
            <motion.div className="card" variants={scaleIn}>
              <DataInput setData={setData} />
            </motion.div>

            <motion.div className="card" variants={scaleIn}>
              <Controls params={params} setParams={setParams} />
            </motion.div>
          </motion.section>

          {/* CONTROLS */}
          <motion.section className="card control-panel" variants={fadeUp}>
            <div className="panel-header">
              <h3>Training Controls</h3>
              <span className="step-pill">
                Step: {steps.length ? index + 1 : 0} / {steps.length}
              </span>
            </div>

            <div className="controls-row">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                className="btn btn-primary" onClick={handleTrain}>
                Train Model
              </motion.button>

              <div>
                <label>Kernel:</label>
                <select
                  value={params.kernel}
                  onChange={(e) =>
                    setParams({ ...params, kernel: e.target.value })
                  }
                >
                  <option value="RBF">RBF</option>
                  <option value="LINEAR">Linear</option>
                </select>
              </div>

              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                className="btn btn-success"
                onClick={() => setPlaying(true)}
                disabled={playing || steps.length === 0}
              >
                ▶ Play
              </motion.button>

              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                className="btn btn-muted"
                onClick={() => setPlaying(false)}
                disabled={!playing}
              >
                ⏸ Pause
              </motion.button>
            </div>

            <div className="controls-row">
              <motion.button whileHover={{ scale: 1.05 }}
                className="btn"
                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              >
                ⬅ Prev
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }}
                className="btn"
                onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
              >
                Next ➡
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }}
                className="btn"
                onClick={exportCSV}
              >
                Export CSV
              </motion.button>
            </div>

            <div className="progress-track">
              <motion.div
                className="progress-fill"
                animate={{
                  width: `${steps.length ? ((index + 1) / steps.length) * 100 : 0}%`
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.section>

          {/* VISUALIZATION */}
          <motion.section className="panel-grid viz-grid" variants={stagger}>
            <motion.div className="card viz-card" variants={fadeUp}>
              <Visualization data={data} step={currentStep} />
            </motion.div>

            <motion.div className="card step-card" variants={fadeUp}>
              <StepViewer step={currentStep} lossHistory={lossHistory} />
            </motion.div>
          </motion.section>

          {/* METRICS */}
          {metrics && (
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3>Model Performance</h3>
              <p><strong>MSE:</strong> {metrics.mse.toFixed(4)}</p>
              <p><strong>R² Score:</strong> {metrics.r2.toFixed(4)}</p>
              <LossGraph lossHistory={lossHistory} />
            </motion.div>
          )}

          {/* TEAM */}
          <motion.section className="card credits-section" variants={fadeUp}>
            <h2>Project Acknowledgement</h2>

            <div className="team-grid">
              {[{img:m1,name:"Harleen"},
                {img:m2,name:"Ivan Varghese George"},
                {img:m3,name:"Shruti Mishra"},
                {img:m4,name:"Prof. A Swaminathan"}].map((m,i)=>(
                  <motion.div
                    key={i}
                    className="team-card"
                    whileHover={{ scale: 1.1, rotate: 1 }}
                  >
                    <img src={m.img} alt="member"/>
                    <p>{m.name}</p>
                  </motion.div>
              ))}
            </div>
          </motion.section>

        </>
      } />

      {/* OTHER PAGES */}
      <Route path="/page1" element={<Page1 />} />
      <Route path="/page2" element={<Page2 />} />
      <Route path="/page3" element={<Page3 />} />
      <Route path="/page4" element={<Page4 />} />
      
    </Routes>
</AnimatePresence>
  </motion.div>
  );
}