import React from 'react';

const getDayMonthYear = (dateString) => {
  if (!dateString) return { day: '....', month: '....', year: '2026' };
  const d = new Date(dateString);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: (d.getMonth() + 1).toString().padStart(2, '0'),
    year: d.getFullYear()
  };
};

export default function NoticeErrorTemplate({ data, settings }) {
  const recordDate = getDayMonthYear(data.recordDate);
  const oldInvoiceDate = getDayMonthYear(data.oldInvoiceDate);
  const discoverDate = getDayMonthYear(data.discoverDate);

  return (
    <div className="doc-template">
      <div className="doc-header" style={{ display: 'block', textAlign: 'center' }}>
        <h4>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
        <h4 style={{ textDecoration: 'underline' }}>Độc lập - Tự do - Hạnh phúc</h4>
      </div>

      <div className="doc-title" style={{ fontSize: '15pt', marginTop: '40px', marginBottom: '32px' }}>
        THÔNG BÁO VỀ HÓA ĐƠN ĐIỆN TỬ CÓ SAI SÓT
      </div>

      <div style={{ textAlign: 'justify', marginBottom: '16px' }}>
        <div style={{ display: 'flex' }}>
            <span style={{ marginRight: '8px' }}>-</span>
            <span>Căn cứ Nghị định 254/2026/NĐ-CP ngày 30/06/2026 của Chính phủ quy định về hóa đơn điện tử, chứng từ điên tử.</span>
        </div>
        <div style={{ display: 'flex' }}>
            <span style={{ marginRight: '8px' }}>-</span>
            <span>Căn cứ khoản a điểm 1 điều 10 Thông tư số 91/2026/TT-BTC ngày 30/06/2026 hướng dẫn Nghị định 254/2026/NĐ-CP của Chính phủ quy định về hóa đơn điện tử, chứng từ điện tử.</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px', textIndent: '20px', textAlign: 'justify' }}>
        Hôm nay, ngày <span className="text-red">{recordDate.day}</span> tháng <span className="text-red">{recordDate.month}</span> năm <span className="text-red">{recordDate.year}</span>, <b>{settings?.sellerName || 'Công ty CP TM Máy Tính An Phát'}</b> xin gửi thông báo đến Quý Khách hàng như sau:
      </div>

      <div style={{ marginBottom: '8px', textIndent: '20px', textAlign: 'justify' }}>
        Ngày <span className="text-red">{oldInvoiceDate.day}</span> tháng <span className="text-red">{oldInvoiceDate.month}</span> năm <span className="text-red">{oldInvoiceDate.year}</span>, Công ty Chúng tôi đã phát hành Hóa đơn điện tử có ký hiệu <span className="text-red">{data.oldTemplateCode || '……'}</span> số: <span className="text-red">{data.oldInvoiceNumber || '……'}</span> với thông tin của Công ty Quý Khách là:
      </div>
      <div style={{ marginBottom: '16px', paddingLeft: '40px' }}>
        {data.noticeErrorCompany && <div>- Tên đơn vị: <span className="text-red">{data.wrongCompanyName || '………………………………'}</span></div>}
        {data.noticeErrorTaxCode && <div>- Mã số thuế: <span className="text-red">{data.wrongTaxCode || '………………………………'}</span></div>}
        {data.noticeErrorAddress && <div>- Địa chỉ: <span className="text-red">{data.wrongAddress || '………………………………'}</span></div>}
        
        {!data.noticeErrorCompany && !data.noticeErrorTaxCode && !data.noticeErrorAddress && (
          <div>- Địa chỉ: <span className="text-red">{data.wrongAddress || '………………………………'}</span></div>
        )}
      </div>
 
      <div style={{ marginBottom: '8px', textIndent: '20px', textAlign: 'justify' }}>
        Tuy nhiên đến ngày <span className="text-red">{discoverDate.day}</span> tháng <span className="text-red">{discoverDate.month}</span> năm <span className="text-red">{discoverDate.year}</span> Chúng tôi phát hiện thông tin trên bị sai và thông tin đúng là:
      </div>
      <div style={{ marginBottom: '16px', paddingLeft: '40px' }}>
        {data.noticeErrorCompany && <div>- Tên đơn vị: <span className="text-red">{data.correctCompanyName || '………………………………'}</span></div>}
        {data.noticeErrorTaxCode && <div>- Mã số thuế: <span className="text-red">{data.correctTaxCode || '………………………………'}</span></div>}
        {data.noticeErrorAddress && <div>- Địa chỉ: <span className="text-red">{data.correctAddress || '………………………………'}</span></div>}
        
        {!data.noticeErrorCompany && !data.noticeErrorTaxCode && !data.noticeErrorAddress && (
          <div>- Địa chỉ: <span className="text-red">{data.correctAddress || '………………………………'}</span></div>
        )}
      </div>

      <div style={{ marginBottom: '16px', textIndent: '20px', textAlign: 'justify' }}>
        Vì vậy, Chúng tôi làm Thông báo này để cả hai bên cùng biết và thực hiên theo đúng quy định ở khoản a điểm 1 điều 10 Thông tư số 91/2026/TT-BTC
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="doc-italic" style={{ whiteSpace: 'nowrap' }}>Hà Nội, Ngày <span className="text-red">{recordDate.day}</span> tháng <span className="text-red">{recordDate.month}</span> năm <span className="text-red">{recordDate.year}</span></p>
          <p className="doc-bold" style={{ marginTop: '4px' }}>{settings?.sellerRole || 'Kế toán trưởng'}</p>
          {/* Chừa khoảng trống ký tên */}
          <div style={{ height: '80px' }}></div>
        </div>
      </div>
    </div>
  );
}
