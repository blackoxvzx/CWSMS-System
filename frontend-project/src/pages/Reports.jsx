import { useState, useEffect } from 'react';
import { reports } from '../api';

export default function Reports() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    reports.daily(date).then((res) => setRows(res.data)).catch(() => setRows([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [date]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Reports</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Daily Report</h2>
        <p className="text-slate-600 text-sm mb-4">PlateNumber, PackageName, PackageDescription, AmountPaid, PaymentDate</p>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
            />
          </label>
          <button type="button" onClick={load} disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-600 bg-slate-50">
                <th className="py-3 pr-4">Plate Number</th>
                <th className="py-3 pr-4">Package Name</th>
                <th className="py-3 pr-4">Package Description</th>
                <th className="py-3 pr-4">Amount Paid (RWF)</th>
                <th className="py-3">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 pr-4">{row.PlateNumber}</td>
                  <td className="py-3 pr-4">{row.PackageName}</td>
                  <td className="py-3 pr-4">{row.PackageDescription}</td>
                  <td className="py-3 pr-4">{Number(row.AmountPaid).toLocaleString()}</td>
                  <td className="py-3">{row.PaymentDate?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && !loading && <p className="text-slate-500 py-6">No payments for this date.</p>}
        </div>
      </div>
    </div>
  );
}
