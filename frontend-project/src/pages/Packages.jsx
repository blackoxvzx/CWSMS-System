import { useState, useEffect } from 'react';
import { packages as packagesApi } from '../api';

export default function Packages() {
  const [form, setForm] = useState({ PackageName: '', PackageDescription: '', PackagePrice: '' });
  const [list, setList] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    packagesApi.list().then((res) => setList(res.data)).catch(() => setList([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    packagesApi.create(form)
      .then(() => {
        setMessage({ type: 'success', text: 'Package added successfully.' });
        setForm({ PackageName: '', PackageDescription: '', PackagePrice: '' });
        return packagesApi.list();
      })
      .then((res) => setList(res.data))
      .catch((err) => setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to add package.' }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Packages</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Add Package</h2>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Package Name *</label>
              <input
                value={form.PackageName}
                onChange={(e) => setForm((f) => ({ ...f, PackageName: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Package Description *</label>
              <input
                value={form.PackageDescription}
                onChange={(e) => setForm((f) => ({ ...f, PackageDescription: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Package Price (RWF) *</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.PackagePrice}
                onChange={(e) => setForm((f) => ({ ...f, PackagePrice: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700">
              Add Package
            </button>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Service Packages</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-600">
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 pr-2">Name</th>
                  <th className="py-2 pr-2">Description</th>
                  <th className="py-2">Price (RWF)</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.PackageNumber} className="border-b">
                    <td className="py-2 pr-2">{p.PackageNumber}</td>
                    <td className="py-2 pr-2">{p.PackageName}</td>
                    <td className="py-2 pr-2">{p.PackageDescription}</td>
                    <td className="py-2">{Number(p.PackagePrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="text-slate-500 py-4">No packages yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
