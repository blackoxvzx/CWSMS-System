import { useState, useEffect } from 'react';
import { cars } from '../api';

export default function Car() {
  const [form, setForm] = useState({ PlateNumber: '', CarType: '', CarSize: '', DriverName: '', PhoneNumber: '' });
  const [list, setList] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    cars.list().then((res) => setList(res.data)).catch(() => setList([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    cars.create(form)
      .then(() => {
        setMessage({ type: 'success', text: 'Car registered successfully.' });
        setForm({ PlateNumber: '', CarType: '', CarSize: '', DriverName: '', PhoneNumber: '' });
        return cars.list();
      })
      .then((res) => setList(res.data))
      .catch((err) => setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to register car.' }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Car</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Register Car</h2>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plate Number *</label>
              <input
                value={form.PlateNumber}
                onChange={(e) => setForm((f) => ({ ...f, PlateNumber: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Car Type *</label>
              <input
                value={form.CarType}
                onChange={(e) => setForm((f) => ({ ...f, CarType: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Car Size *</label>
              <input
                value={form.CarSize}
                onChange={(e) => setForm((f) => ({ ...f, CarSize: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                placeholder="e.g. Small, Medium, SUV"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Driver Name *</label>
              <input
                value={form.DriverName}
                onChange={(e) => setForm((f) => ({ ...f, DriverName: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
              <input
                value={form.PhoneNumber}
                onChange={(e) => setForm((f) => ({ ...f, PhoneNumber: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700">
              Register Car
            </button>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Registered Cars</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-600">
                  <th className="py-2 pr-2">Plate</th>
                  <th className="py-2 pr-2">Type</th>
                  <th className="py-2 pr-2">Size</th>
                  <th className="py-2 pr-2">Driver</th>
                  <th className="py-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.PlateNumber} className="border-b">
                    <td className="py-2 pr-2">{c.PlateNumber}</td>
                    <td className="py-2 pr-2">{c.CarType}</td>
                    <td className="py-2 pr-2">{c.CarSize}</td>
                    <td className="py-2 pr-2">{c.DriverName}</td>
                    <td className="py-2">{c.PhoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="text-slate-500 py-4">No cars registered yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
