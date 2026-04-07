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

export default function Page1() {
  return (
    <motion.div
  className="app-shell"
  initial="hidden"
  animate="visible"
  variants={stagger}
>

      {/* HEADER */}
      <motion.div className="card" variants={fadeUp}>
        <h1>Support Vector Regression (SVR)</h1>
        <p>
          Support Vector Regression is a supervised machine learning algorithm
          used to predict continuous values. Unlike traditional regression,
          SVR focuses on maintaining a margin of tolerance while minimizing
          prediction error.
        </p>
      </motion.div>

      {/* CORE IDEA */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Core Idea</h2>
        <p>
          Instead of minimizing the total error directly, SVR attempts to fit a
          function such that most data points lie within a defined margin called
          the <strong>epsilon (ε) tube</strong>. Errors within this margin are
          ignored, while errors outside it are penalized.
        </p>
      </motion.div>

      {/* KEY COMPONENTS */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Key Components</h2>

        <ul>
          <li>
            <strong>Epsilon (ε):</strong> Defines the margin within which errors
            are ignored.
          </li>
          <li>
            <strong>Support Vectors:</strong> Data points outside the epsilon
            margin that influence the model.
          </li>
          <li>
            <strong>Kernel Function:</strong> Transforms data into higher
            dimensions to handle non-linear relationships.
          </li>
        </ul>
      </motion.div>

      {/* MATHEMATICAL INTUITION */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Mathematical Intuition</h2>
        <p>
          SVR tries to minimize a loss function that balances model complexity
          and prediction error. The objective is to keep the model as flat as
          possible while ensuring deviations larger than ε are minimized.
        </p>

        <p>
          This is controlled using a regularization parameter <strong>C</strong>,
          which determines how much the model penalizes errors beyond the margin.
        </p>
      </motion.div>

      {/* KERNELS */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Kernel Trick</h2>
        <p>
          SVR can model non-linear relationships using kernel functions. Instead
          of explicitly transforming data, kernels compute similarity in higher
          dimensions.
        </p>

        <ul>
          <li><strong>Linear:</strong> For simple relationships</li>
          <li><strong>RBF (Gaussian):</strong> For complex, curved patterns</li>
          <li><strong>Polynomial:</strong> For structured non-linear trends</li>
        </ul>
      </motion.div>

      {/* ADVANTAGES */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Advantages</h2>
        <ul>
          <li>Effective in high-dimensional spaces</li>
          <li>Works well with non-linear data</li>
          <li>Robust to outliers (due to epsilon margin)</li>
        </ul>
      </motion.div>

      {/* LIMITATIONS */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Limitations</h2>
        <ul>
          <li>Choosing correct kernel and parameters is difficult</li>
          <li>Computationally expensive for large datasets</li>
          <li>Less interpretable than simple linear regression</li>
        </ul>
      </motion.div>

      {/* REAL WORLD */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Real-World Applications</h2>
        <ul>
          <li>Stock price prediction</li>
          <li>Energy consumption forecasting</li>
          <li>Demand prediction in businesses</li>
          <li>Time-series regression problems</li>
        </ul>
      </motion.div>

    </motion.div>
  );
}