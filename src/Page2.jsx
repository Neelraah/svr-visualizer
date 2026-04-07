import { motion } from "framer-motion";

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

export default function Page2() {
  return (
    <motion.div
  className="app-shell"
  initial="hidden"
  animate="visible"
  variants={stagger}
>

      {/* HEADER */}
      <motion.div className="card" variants={fadeUp}>
        <h1>How to Use the SVR Playground</h1>
        <p>
          This interactive playground allows you to experiment with Support
          Vector Regression by providing your own data, tuning parameters, and
          observing how the model learns step by step.
        </p>
      </motion.div>

      {/* STEP 1 */}
      <motion.div className="card step-block" variants={fadeUp}>
        <h2>1. Input Your Data</h2>
        <p>
          Begin by entering your dataset manually or uploading a file. The data
          should consist of input values (x) and corresponding outputs (y).
        </p>
        <p>
          The quality and distribution of your data directly influence how well
          the model performs.
        </p>
      </motion.div>

      {/* STEP 2 */}
      <motion.div className="card step-block" variants={fadeUp}>
        <h2>2. Adjust Parameters</h2>
        <p>
          Modify key parameters such as <strong>epsilon (ε)</strong> and select
          the kernel type.
        </p>
        <ul>
          <li><strong>Epsilon:</strong> Controls tolerance for error</li>
          <li><strong>Kernel:</strong> Defines how the model fits the data</li>
        </ul>
      </motion.div>

      {/* STEP 3 */}
      <motion.div className="card step-block" variants={fadeUp}>
        <h2>3. Train the Model</h2>
        <p>
          Click on <strong>Train Model</strong> to begin the learning process.
          The algorithm will compute the best-fit function based on your data
          and parameters.
        </p>
      </motion.div>

      {/* STEP 4 */}
      <motion.div className="card step-block" variants={fadeUp}>
        <h2>4. Visualize Learning</h2>
        <p>
          Observe how the regression curve evolves step by step. You can play,
          pause, or manually navigate through each step to understand how SVR
          converges.
        </p>
      </motion.div>

      {/* STEP 5 */}
      <motion.div className="card step-block" variants={fadeUp}>
        <h2>5. Analyze Results</h2>
        <p>
          Once training is complete, review performance metrics such as
          <strong> MSE</strong> and <strong>R² Score</strong>.
        </p>
        <p>
          These values indicate how accurately the model fits your data.
        </p>
      </motion.div>

      {/* STEP 6 */}
      <motion.div className="card step-block" variants={fadeUp}>
        <h2>6. Export Results</h2>
        <p>
          You can export the predicted values as a CSV file for further analysis
          or reporting.
        </p>
      </motion.div>

    </motion.div>
  );
}