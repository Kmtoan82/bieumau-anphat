import React from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';

export default function InvoiceTableEditor({ title, items, onChange, onCopyFrom }) {
  const taxRates = ['8', '10', '5', '0', 'KCT', 'KKKNT', 'KHAC'];

  const handleAdd = () => {
    onChange([...items, { 
      id: Date.now(), 
      stt: items.length + 1, 
      name: '', 
      unit: 'Chiếc', 
      qty: 1, 
      priceVat: 0, 
      price: 0, 
      taxRate: '8' 
    }]);
  };

  const calculatePriceExclusive = (priceVat, taxRateStr) => {
    const pVat = Number(priceVat) || 0;
    if (taxRateStr === '8') return Math.round(pVat / 1.08);
    if (taxRateStr === '10') return Math.round(pVat / 1.10);
    if (taxRateStr === '5') return Math.round(pVat / 1.05);
    return pVat; // For 0, KCT, KKKNT, KHAC, exclusive = inclusive (no tax added mathematically)
  };

  const handleUpdate = (id, field, value) => {
    onChange(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // If they change priceVat or taxRate, recalculate price (exclusive)
        if (field === 'priceVat' || field === 'taxRate') {
          updatedItem.price = calculatePriceExclusive(updatedItem.priceVat, updatedItem.taxRate);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleRemove = (id) => {
    onChange(items.filter(item => item.id !== id));
  };

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('vi-VN');
  };

  return (
    <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, color: 'var(--primary)' }}>{title}</h4>
        <div>
          {onCopyFrom && (
            <button className="btn btn-outline" onClick={onCopyFrom} style={{ padding: '6px 12px', fontSize: '13px', marginRight: '8px' }}>
              <Copy size={14} style={{ marginRight: '4px' }} /> Copy từ bảng cũ
            </button>
          )}
          <button className="btn btn-outline" onClick={handleAdd} style={{ padding: '6px 12px', fontSize: '13px' }}>
            <Plus size={14} style={{ marginRight: '4px' }} /> Thêm dòng
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>Chưa có hàng hóa nào. Bấm "Thêm dòng" để bắt đầu.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--surface-border)' }}>
                <th style={{ padding: '8px', width: '50px', textAlign: 'center' }}>STT</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Tên hàng hóa, dịch vụ</th>
                <th style={{ padding: '8px', width: '80px' }}>ĐVT</th>
                <th style={{ padding: '8px', width: '80px', textAlign: 'right' }}>SL</th>
                <th style={{ padding: '8px', width: '80px', textAlign: 'center' }}>% Thuế</th>
                <th style={{ padding: '8px', width: '130px', textAlign: 'right' }}>Đơn giá (SAU Thuế)</th>
                <th style={{ padding: '8px', width: '100px', textAlign: 'right' }}>Đơn giá (CHƯA Thuế)</th>
                <th style={{ padding: '8px', width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    <td style={{ padding: '4px' }}>
                      <input type="text" className="form-control" style={{ padding: '6px', textAlign: 'center' }} value={item.stt || ''} onChange={(e) => handleUpdate(item.id, 'stt', e.target.value)} />
                    </td>
                    <td style={{ padding: '4px' }}>
                      <input type="text" className="form-control" style={{ padding: '6px' }} value={item.name} onChange={(e) => handleUpdate(item.id, 'name', e.target.value)} placeholder="Nhập tên..." />
                    </td>
                    <td style={{ padding: '4px' }}>
                      <input type="text" className="form-control" style={{ padding: '6px' }} value={item.unit} onChange={(e) => handleUpdate(item.id, 'unit', e.target.value)} />
                    </td>
                    <td style={{ padding: '4px' }}>
                      <input type="number" className="form-control" style={{ padding: '6px', textAlign: 'right' }} value={item.qty} onChange={(e) => handleUpdate(item.id, 'qty', e.target.value)} />
                    </td>
                    <td style={{ padding: '4px' }}>
                      <select className="form-control" style={{ padding: '6px' }} value={item.taxRate} onChange={(e) => handleUpdate(item.id, 'taxRate', e.target.value)}>
                        {taxRates.map(r => <option key={r} value={r}>{r === 'KCT' || r === 'KKKNT' || r === 'KHAC' ? r : r + '%'}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '4px' }}>
                      <input type="number" className="form-control" style={{ padding: '6px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }} value={item.priceVat || ''} onChange={(e) => handleUpdate(item.id, 'priceVat', e.target.value)} placeholder="Nhập giá sau thuế" />
                    </td>
                    <td style={{ padding: '4px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {formatCurrency(item.price)}
                    </td>
                    <td style={{ padding: '4px', textAlign: 'center' }}>
                      <button onClick={() => handleRemove(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
