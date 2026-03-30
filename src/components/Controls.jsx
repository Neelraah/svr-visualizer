export default function Controls({ params, setParams }) {
  return (
    <div className="card">
      <h3>Parameters</h3>

      <div>
        <label>Epsilon:</label>
        <input
          type="number"
          step="0.1"
          value={params.epsilon}
          onChange={(e) =>
            setParams({ ...params, epsilon: parseFloat(e.target.value) })
          }
        />
      </div>
    </div>
  );
}