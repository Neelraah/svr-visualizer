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

export default function Page3() {
  return (
    <motion.div
  className="app-shell"
  initial="hidden"
  animate="visible"
  variants={stagger}
>

      {/* HEADER */}
      <motion.div className="card" variants={fadeUp}>
        <h1>Resources & Downloads</h1>
        <p>
          Explore foundational research papers on Support Vector Regression and
          access the source code for this project.
        </p>
      </motion.div>

      {/* PAPERS */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Research Papers</h2>

        <div className="resource-list">

          <a
            href="https://link.springer.com/article/10.1023/A:1010933404324"
            target="_blank"
            rel="noreferrer"
            className="resource-item"
          >
            Support Vector Regression Machines (Smola & Schölkopf)
          </a>

          <a
            href="https://www.csie.ntu.edu.tw/~cjlin/papers/guide/guide.pdf"
            target="_blank"
            rel="noreferrer"
            className="resource-item"
          >
            A Practical Guide to Support Vector Classification
          </a>

          <a
            href="https://link.springer.com/chapter/10.1007/3-540-44673-7_12"
            target="_blank"
            rel="noreferrer"
            className="resource-item"
          >
            Introduction to Support Vector Machines and SVR
          </a>

        </div>
      </motion.div>

      {/* GITHUB */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Project Repository</h2>

        <a
          href="https://github.com/Neelraah/svr-visualizer"
          target="_blank"
          rel="noreferrer"
          className="resource-item github"
        >
          View Source Code on GitHub
        </a>
      </motion.div>

      {/* OPTIONAL EXTRA */}
      <motion.div className="card" variants={fadeUp}>
        <h2>Additional Resources</h2>

        <div className="resource-list">
          <a
            href="https://scikit-learn.org/stable/modules/svm.html"
            target="_blank"
            rel="noreferrer"
            className="resource-item"
          >
            Scikit-learn SVR Documentation
          </a>

          <a
            href="https://www.youtube.com/watch?v=kPw1IGUAoY8"
            target="_blank"
            rel="noreferrer"
            className="resource-item"
          >
            SVR Concept Video Explanation
          </a>
        </div>
      </motion.div>

    </motion.div>
  );
}