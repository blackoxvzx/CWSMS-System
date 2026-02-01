import { useState, useEffect } from 'react';
import { payments, servicePackages } from '../api';

export default function Payment() {
  const [form, setForm] = useState({ RecordNumber: '', AmountPaid: '', PaymentDate: new Date().toISOString().slice(0, 10) });
  const [list, setList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    payments.list().then((res) => setList(res.data)).catch(() => setList([]));
    servicePackages.list().then((res) => setServiceList(res.data)).catch(() => setServiceList([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    payments.create({
      RecordNumber: Number(form.RecordNumber),
      AmountPaid: Number(form.AmountPaid),
      PaymentDate: form.PaymentDate
    })
      .then(() => {
        setMessage({ type: 'success', text: 'Payment recorded.' });
        setForm({ RecordNumber: '', AmountPaid: '', PaymentDate: new Date().toISOString().slice(0, 10) });
        return payments.list();
      })
      .then((res) => setList(res.data))
      .catch((err) => setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to record payment.' }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Payment</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Record Payment</h2>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service Record Number *</label>
              <select
                value={form.RecordNumber}
                onChange={(e) => setForm((f) => ({ ...f, RecordNumber: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select service record</option>
                {serviceList.map((s) => (
                  <option key={s.RecordNumber} value={s.RecordNumber}>
                    #{s.RecordNumber} - {s.PlateNumber} - {s.PackageName} - {s.ServiceDate?.slice(0, 10)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount Paid (RWF) *</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.AmountPaid}
                onChange={(e) => setForm((f) => ({ ...f, AmountPaid: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date *</label>
              <input
                type="date"
                value={form.PaymentDate}
                onChange={(e) => setForm((f) => ({ ...f, PaymentDate: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700">
              Record Payment
            </button>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Payments</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-600">
                  <th className="py-2 pr-2">Payment #</th>
                  <th className="py-2 pr-2">Record #</th>
                  <th className="py-2 pr-2">Amount (RWF)</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.PaymentNumber} className="border-b">
                    <td className="py-2 pr-2">{p.PaymentNumber}</td>
                    <td className="py-2 pr-2">{p.RecordNumber}</td>
                    <td className="py-2 pr-2">{Number(p.AmountPaid).toLocaleString()}</td>
                    <td className="py-2">{p.PaymentDate?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="text-slate-500 py-4">No payments yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
