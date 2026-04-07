import { motion } from "framer-motion";
import m1 from "./assets/mememe.jpeg";
import m2 from "./assets/i1.jpg";
import m3 from "./assets/Shruti.jpeg";
import m4 from "./assets/prof.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Page4() {
  return (
    <motion.div
  className="app-shell"
  initial="hidden"
  animate="visible"
  variants={stagger}
>

      {/* HEADER */}
      <motion.div className="card" variants={fadeUp}>
        <h1>Project Team</h1>
        <p>
          This project was developed collaboratively with contributions across
          machine learning, UI design, and system integration.
        </p>
      </motion.div>

      {/* TEAM MEMBERS */}
      <motion.div className="team-grid clean-team" variants={stagger}>
  {[
    { img: m1, name: "Harleen", role: "SVR Implementation & Logic" },
    { img: m2, name: "Ivan Varghese George", role: "Frontend Development & UI Design" },
    { img: m3, name: "Shruti Mishra", role: "Data Handling & Model Evaluation" }
  ].map((member, i) => (

    <motion.div
      key={i}
      className="team-item"
      variants={fadeUp}
      whileHover={{ scale: 1.04, y: -6 }}
    >
      <img src={member.img} alt={member.name} />

      <h3>{member.name}</h3>

      <p>{member.role}</p>
    </motion.div>

  ))}
</motion.div>

      {/* PROFESSOR SECTION */}
     <motion.div className="card" variants={fadeUp}>
  <h2>Guided By</h2>

  <motion.div
    className="prof-horizontal clean"
    whileHover={{ scale: 1.03, y: -6 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <img src={m4} alt="Professor" />

    <div className="prof-info">
      <h3>Prof. A Swaminathan</h3>
      <p>
        Provided guidance, feedback, and continuous support throughout the
        development of this project, helping bridge theoretical concepts with
        practical implementation.
      </p>
    </div>
  </motion.div>
</motion.div>

      {/* EXTRA (optional but strong for viva) */}
      <motion.div className="card" variants={fadeUp}>
        <h2>What We Learned</h2>
        <ul>
          <li>Practical implementation of Support Vector Regression</li>
          <li>Model visualization and interpretation</li>
          <li>UI/UX design for ML systems</li>
          <li>Team collaboration and modular development</li>
        </ul>
      </motion.div>

    </motion.div>
  );
}