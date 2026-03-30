import { generateSampleData } from "../utils/data";
import Papa from "papaparse";

export default function DataInput({ setData }) {

  const handleFile = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const parsed = results.data
          .filter(d => d.x !== undefined && d.y !== undefined)
          .map(d => ({ x: d.x, y: d.y }));

        setData(parsed);
      }
    });
  };

  return (
    <div className="card">
      <h3>Dataset</h3>

      <button onClick={() => setData(generateSampleData())}>
        Load Sample Data
      </button>

      <div style={{ marginTop: "10px" }}>
        <input type="file" accept=".csv" onChange={handleFile} />
      </div>

      <p style={{ fontSize: "12px", color: "#aaa" }}>
        CSV format: columns must be <strong>x</strong> and <strong>y</strong>
      </p>
    </div>
  );
}