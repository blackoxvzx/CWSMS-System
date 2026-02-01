import { useState, useEffect } from 'react';
import { servicePackages, cars, packages as packagesApi } from '../api';
import Bill from '../components/Bill';

export default function ServicePackage() {
  const [form, setForm] = useState({ PlateNumber: '', PackageNumber: '', ServiceDate: new Date().toISOString().slice(0, 10) });
  const [list, setList] = useState([]);
  const [carList, setCarList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editing, setEditing] = useState(null);
  const [billRecordId, setBillRecordId] = useState(null);

  useEffect(() => {
    servicePackages.list().then((res) => setList(res.data)).catch(() => setList([]));
    cars.list().then((res) => setCarList(res.data)).catch(() => setCarList([]));
    packagesApi.list().then((res) => setPackageList(res.data)).catch(() => setPackageList([]));
  }, []);

  const refresh = () => {
    servicePackages.list().then((res) => setList(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (editing) {
      servicePackages.update(editing.RecordNumber, form)
        .then(() => {
          setMessage({ type: 'success', text: 'Service record updated.' });
          setEditing(null);
          setForm({ PlateNumber: '', PackageNumber: '', ServiceDate: new Date().toISOString().slice(0, 10) });
          refresh();
        })
        .catch((err) => setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed.' }));
    } else {
      servicePackages.create(form)
        .then(() => {
          setMessage({ type: 'success', text: 'Service record created.' });
          setForm({ PlateNumber: '', PackageNumber: '', ServiceDate: new Date().toISOString().slice(0, 10) });
          refresh();
        })
        .catch((err) => setMessage({ type: 'error', text: err.response?.data?.error || 'Create failed.' }));
    }
  };

  const handleEdit = (row) => {
    setEditing(row);
    setForm({
      PlateNumber: row.PlateNumber,
      PackageNumber: row.PackageNumber,
      ServiceDate: row.ServiceDate?.slice(0, 10) || new Date().toISOString().slice(0, 10)
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this service record?')) return;
    servicePackages.delete(id).then(() => refresh()).catch((err) => setMessage({ type: 'error', text: err.response?.data?.error || 'Delete failed.' }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">ServicePackage</h1>
      {billRecordId && <Bill recordId={billRecordId} onClose={() => setBillRecordId(null)} />}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">{editing ? 'Edit Service Record' : 'New Service Record'}</h2>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Car (Plate Number) *</label>
              <select
                value={form.PlateNumber}
                onChange={(e) => setForm((f) => ({ ...f, PlateNumber: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select car</option>
                {carList.map((c) => (
                  <option key={c.PlateNumber} value={c.PlateNumber}>{c.PlateNumber} - {c.DriverName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Package *</label>
              <select
                value={form.PackageNumber}
                onChange={(e) => setForm((f) => ({ ...f, PackageNumber: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select package</option>
                {packageList.map((p) => (
                  <option key={p.PackageNumber} value={p.PackageNumber}>{p.PackageName} - {Number(p.PackagePrice).toLocaleString()} RWF</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service Date *</label>
              <input
                type="date"
                value={form.ServiceDate}
                onChange={(e) => setForm((f) => ({ ...f, ServiceDate: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700">
                {editing ? 'Update' : 'Create'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ PlateNumber: '', PackageNumber: '', ServiceDate: new Date().toISOString().slice(0, 10) }); }} className="px-4 py-2 border border-slate-300 rounded-lg">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Service Records (Update / Delete / Retrieve)</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-600">
                  <th className="py-2 pr-2">Record #</th>
                  <th className="py-2 pr-2">Plate</th>
                  <th className="py-2 pr-2">Package</th>
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr key={row.RecordNumber} className="border-b">
                    <td className="py-2 pr-2">{row.RecordNumber}</td>
                    <td className="py-2 pr-2">{row.PlateNumber}</td>
                    <td className="py-2 pr-2">{row.PackageName}</td>
                    <td className="py-2 pr-2">{row.ServiceDate?.slice(0, 10)}</td>
                    <td className="py-2 flex gap-2 flex-wrap">
                      <button type="button" onClick={() => setBillRecordId(row.RecordNumber)} className="text-primary-600 hover:underline">Bill</button>
                      <button type="button" onClick={() => handleEdit(row)} className="text-blue-600 hover:underline">Edit</button>
                      <button type="button" onClick={() => handleDelete(row.RecordNumber)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="text-slate-500 py-4">No service records yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
