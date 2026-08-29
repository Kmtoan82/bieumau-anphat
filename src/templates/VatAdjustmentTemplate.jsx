import React from 'react';

const formatDateVN = (dateString) => {
  if (!dateString) return '....../....../..........';
  const d = new Date(dateString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getDayMonthYear = (dateString) => {
  if (!dateString) return { day: '....', month: '....', year: '..........' };
  const d = new Date(dateString);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: (d.getMonth() + 1).toString().padStart(2, '0'),
    year: d.getFullYear()
  };
};

export default function VatAdjustmentTemplate({ data, settings }) {
  const recordDate = getDayMonthYear(data.recordDate);

  return (
    <div className="doc-template">
      <div className="doc-header" style={{ display: 'block', textAlign: 'center' }}>
        <h4>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
        <h4 style={{ textDecoration: 'underline' }}>Độc lập – Tự do – Hạnh phúc</h4>
      </div>

      <div className="doc-title">
        BIÊN BẢN THỎA THUẬN LẬP ĐIỀU CHỈNH HÓA ĐƠN
        <div style={{ fontSize: '13pt', fontWeight: 'normal', fontStyle: 'italic', marginTop: '4px' }}>
          (Số: <span className="text-red">{data.recordNumber || '…………'}</span>)
        </div>
      </div>

      <div style={{ textAlign: 'justify', marginBottom: '16px' }}>
        <p>Căn cứ vào đơn mua hàng trên shopee số đơn hàng: <span className="text-red">{data.orderId || '……………'}</span> ngày giao thành công <span className="text-red">{formatDateVN(data.deliveryDate)}</span>.</p>
        {settings?.lawsText?.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <span className="doc-italic">
          Hôm nay, ngày <span className="text-red">{recordDate.day}</span> tháng <span className="text-red">{recordDate.month}</span> năm <span className="text-red">{recordDate.year}</span> hai bên chúng tôi gồm có:
        </span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p className="doc-bold" style={{ textDecoration: 'underline' }}>Đơn vị bán hàng: {settings?.sellerName || 'Công ty Cổ Phần Thương Mại Máy Tính An Phát'}</p>
        <p>Mã số thuế: {settings?.sellerTaxCode || '0108940873'}</p>
        <p>Địa chỉ: {settings?.sellerAddress || 'Tầng 5, số 49 Phố Thái Hà, Phường Đống Đa, Thành Phố Hà Nội, Việt Nam'}</p>
        <p>Đại diện: {settings?.sellerRep || 'Nguyễn Thu Trang'}</p>
        <p>Chức vụ: {settings?.sellerRole || 'Kế toán trưởng'}</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p className="doc-bold" style={{ textDecoration: 'underline' }}>Đơn vị mua hàng: <span className="text-red">{data.buyerName || '………………………'}</span></p>
        <p>Mã số thuế: <span className="text-red">{data.buyerTaxCode || '……………'}</span></p>
        <p>Địa chỉ: <span className="text-red">{data.buyerAddress || '……………………………'}</span></p>
        <p>Đại diện: <span className="text-red">{data.buyerRep || '……………………..'}</span></p>
        <p>Chức vụ: <span className="text-red">{data.buyerRole || '………………….'}</span></p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p>Hai bên thống nhất điều chỉnh hóa đơn Mẫu số <span className="text-red">{data.oldTemplateCode || '………….'}</span> số <span className="text-red">{data.oldInvoiceNumber || '………….'}</span> ngày <span className="text-red">{formatDateVN(data.oldInvoiceDate)}</span></p>
        <p>Lý do thay thế: <span className="text-red">{data.reason || '…………………………..'}</span></p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p className="doc-bold">1. Hai bên thống nhất như sau:</p>
        <p style={{ textIndent: '20px' }}>
          Bên bán sẽ xuất hóa đơn mới vào ngày <span className="text-red">{formatDateVN(data.newInvoiceDate)}</span> để thay thế cho hóa đơn cũ Mẫu số <span className="text-red">{data.oldTemplateCode || '………..'}</span> số <span className="text-red">{data.oldInvoiceNumber || '………….'}</span> ngày <span className="text-red">{formatDateVN(data.oldInvoiceDate)}</span> lý do: <span className="text-red">{data.reason || '…………………………..'}</span>
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p className="doc-italic">Biên bản được lập thành 02 (hai) bản, mỗi bên giữ 01 (một) bản, có giá trị pháp lý như nhau.</p>
      </div>

      <div className="doc-signature-section">
        <div className="doc-signature-box">
           <p className="doc-bold">ĐẠI DIỆN BÊN MUA</p>
           <p className="doc-italic">(Ký điện tử/ ký, đóng dấu, ghi rõ họ tên)</p>
           {/* Space for signature */}
           <div style={{ height: '80px' }}></div>
        </div>
        <div className="doc-signature-box">
           <p className="doc-bold">ĐẠI DIỆN BÊN BÁN</p>
           <p className="doc-italic">(Ký điện tử/ ký, đóng dấu, ghi rõ họ tên)</p>
           {/* Space for signature */}
           <div style={{ height: '80px' }}></div>
        </div>
      </div>
    </div>
  );
}
