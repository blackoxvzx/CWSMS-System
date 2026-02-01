import { useState, useEffect } from 'react';
import { servicePackages } from '../api';

export default function Bill({ recordId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recordId) return;
    servicePackages.get(recordId).then((res) => setData(res.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [recordId]);

  const handlePrint = () => window.print();

  if (!recordId) return null;
  if (loading) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-4 rounded">Loading...</div></div>;
  if (!data) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-4 rounded">Record not found.</div><button onClick={onClose} className="ml-2 px-3 py-1 bg-slate-200 rounded">Close</button></div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:bg-white print:block print:p-0">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 print:shadow-none print:max-w-none">
        <div className="flex justify-between items-start mb-6 print:mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">SmartPark</h1>
            <p className="text-slate-500 text-sm">Car Washing - Bill</p>
          </div>
          <div className="text-right text-sm">
            <p>Record # {data.RecordNumber}</p>
            <p>Date: {data.ServiceDate?.slice(0, 10)}</p>
          </div>
        </div>
        <div className="border-t border-b py-4 space-y-2 text-sm">
          <p><span className="text-slate-500">Plate:</span> {data.PlateNumber}</p>
          <p><span className="text-slate-500">Driver:</span> {data.DriverName}</p>
          <p><span className="text-slate-500">Car:</span> {data.CarType} / {data.CarSize}</p>
          <p><span className="text-slate-500">Phone:</span> {data.PhoneNumber}</p>
        </div>
        <div className="py-4">
          <p className="font-medium text-slate-700">{data.PackageName}</p>
          <p className="text-slate-600 text-sm">{data.PackageDescription}</p>
          <p className="text-lg font-bold text-primary-700 mt-2">{Number(data.PackagePrice).toLocaleString()} RWF</p>
        </div>
        <div className="flex gap-2 mt-6 print:hidden">
          <button type="button" onClick={handlePrint} className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700">Print Bill</button>
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}
