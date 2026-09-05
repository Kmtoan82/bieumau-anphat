import React from 'react';

export default function InvoiceTableRenderer({ items, title }) {
  if (!items || items.length === 0) return null;

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('vi-VN');
  };

  const getTaxRateNum = (rateStr) => {
    if (rateStr === 'KCT' || rateStr === 'KKKNT' || rateStr === 'KHAC') return 0;
    return Number(rateStr) || 0;
  };

  const isTaxableRate = (rateStr) => {
    return ['0', '5', '8', '10'].includes(rateStr);
  };

  const processedItems = items.map((item) => {
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;
    const amount = qty * price;
    const taxRateNum = getTaxRateNum(item.taxRate);
    
    // Only calculate tax if it's a numeric rate (0, 5, 8, 10). If KCT, KKKNT, KHAC, usually tax is 0 or handled differently.
    const taxAmount = isTaxableRate(item.taxRate) ? Math.round(amount * (taxRateNum / 100)) : 0;
    const total = amount + taxAmount;

    return { ...item, amount, taxRateNum, taxAmount, total };
  });

  return (
    <div style={{ marginTop: '16px', marginBottom: '24px' }}>
      {title && <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12pt' }}>{title}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11pt', border: '1px solid #000' }}>
        <thead>
          <tr style={{ border: '1px solid #000' }}>
            <th rowSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '30px' }}>STT</th>
            <th rowSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Tên hàng hóa, dịch vụ</th>
            <th rowSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '50px' }}>Đơn vị tính</th>
            <th rowSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '60px' }}>Số lượng</th>
            <th rowSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '80px' }}>Đơn giá</th>
            <th rowSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '90px' }}>Thành tiền<br/>trước thuế</th>
            <th colSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Thuế GTGT</th>
            <th rowSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '90px' }}>Tổng tiền thanh<br/>toán</th>
          </tr>
          <tr>
            <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '40px' }}>%</th>
            <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '80px' }}>Tiền thuế</th>
          </tr>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>1</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>2</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>3</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>4</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>5</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>6=4x5</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>7</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>8</td>
            <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>9=6+8</td>
          </tr>
        </thead>
        <tbody>
          {processedItems.map((item, index) => (
            <tr key={index} style={{ border: '1px solid #000' }}>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{item.stt}</td>
              <td style={{ border: '1px solid #000', padding: '4px' }}>{item.name}</td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{item.unit}</td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{item.qty}</td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{formatCurrency(item.price)}</td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{formatCurrency(item.amount)}</td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>
                {isTaxableRate(item.taxRate) ? item.taxRate + '%' : item.taxRate}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>
                {isTaxableRate(item.taxRate) && item.taxAmount > 0 ? formatCurrency(item.taxAmount) : (isTaxableRate(item.taxRate) ? '0' : '')}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
