import { generateSampleData } from "../utils/data";

export default function DataInput({ setData }) {
  return (
    <div className="card">
      <h3>Dataset</h3>
      <button onClick={() => setData(generateSampleData())}>
        Load Sample Data
      </button>
    </div>
  );
}