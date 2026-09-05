import React from 'react';
import InvoiceTableRenderer from '../components/InvoiceTableRenderer';

const getDayMonthYear = (dateString) => {
  if (!dateString) return { day: '....', month: '....', year: '2026' };
  const d = new Date(dateString);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: (d.getMonth() + 1).toString().padStart(2, '0'),
    year: d.getFullYear()
  };
};

export default function WrongInfoTemplate({ data, settings }) {
  const recordDate = getDayMonthYear(data.recordDate);
  const deliveryDate = getDayMonthYear(data.deliveryDate);
  const oldInvoiceDate = getDayMonthYear(data.oldInvoiceDate);
  const newInvoiceDate = getDayMonthYear(data.newInvoiceDate);

  const isLineItemAdjustment = data.adjustmentType === 'line_items';

  return (
    <div className="doc-template">
      <div className="doc-header" style={{ display: 'block', textAlign: 'center' }}>
        <h4>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
        <h4 style={{ textDecoration: 'underline' }}>Độc lập – Tự do – Hạnh phúc</h4>
        <div style={{ marginTop: '4px' }}>------------------</div>
      </div>

      <div className="doc-title" style={{ marginTop: '24px' }}>
        BIÊN BẢN THỎA THUẬN LẬP HÓA ĐƠN ĐIỆN TỬ THAY THẾ<br/>
        CHO HÓA ĐƠN ĐIỆN TỬ CÓ SAI SÓT
      </div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }} className="doc-italic">
        (Số: <span className="text-red">{data.recordNumber || '…………'}</span>)
      </div>

      <div style={{ marginBottom: '16px', textAlign: 'justify' }}>
        <div>- Căn cứ vào đơn mua hàng trên shopee số đơn hàng: <span className="text-red">{data.orderId || '…………'}</span> ngày giao thành công <span className="text-red">{deliveryDate.day}/{deliveryDate.month}/{deliveryDate.year}</span>.</div>
        {settings?.lawsText ? (
           settings.lawsText.split('\n').map((line, i) => (
             <div key={i}>- {line}</div>
           ))
        ) : (
          <>
            <div>- Căn cứ Luật Quản lý thuế ngày 13 tháng 06 năm 2019;</div>
            <div>- Căn cứ Nghị định 123/2020/NĐ-CP ngày 19 tháng 10 năm 2020 quy định về hoá đơn, chứng từ;</div>
          </>
        )}
      </div>

      <div style={{ marginBottom: '16px', textIndent: '20px' }}>
        Hôm nay, ngày <span className="text-red">{recordDate.day}</span> tháng <span className="text-red">{recordDate.month}</span> năm <span className="text-red">{recordDate.year}</span>. Chúng tôi gồm có:
      </div>

      <div className="doc-bold" style={{ marginBottom: '8px' }}>Bên bán (Bên A): {settings?.sellerName || 'Công ty Cổ Phần Thương Mại Máy Tính An Phát'}</div>
      <table style={{ width: '100%', marginBottom: '16px' }}>
        <tbody>
          <tr><td style={{ width: '120px' }}>Mã số thuế:</td><td className="doc-bold">{settings?.sellerTaxCode || '0108940873'}</td></tr>
          <tr><td>Địa chỉ:</td><td>{settings?.sellerAddress || 'Tầng 5, số 49 Phố Thái Hà, Phường Đống Đa, Thành Phố Hà Nội, Việt Nam'}</td></tr>
          <tr><td>Đại diện:</td><td className="doc-bold">{settings?.sellerRep || 'Nguyễn Thu Trang'}</td></tr>
          <tr><td>Chức vụ:</td><td>{settings?.sellerRole || 'Kế toán trưởng'}</td></tr>
        </tbody>
      </table>

      <div className="doc-bold" style={{ marginBottom: '8px' }}>Bên mua (Bên B): <span className="text-red">{data.buyerName || '...................................................'}</span></div>
      <table style={{ width: '100%', marginBottom: '16px' }}>
        <tbody>
          <tr><td style={{ width: '120px' }}>Mã số thuế:</td><td className="text-red">{data.buyerTaxCode || '...................................................'}</td></tr>
          <tr><td>Địa chỉ:</td><td className="text-red">{data.buyerAddress || '...................................................'}</td></tr>
          <tr><td>Đại diện:</td><td className="text-red">{data.buyerRep || '...................................................'}</td></tr>
          <tr><td>Chức vụ:</td><td className="text-red">{data.buyerRole || 'Giám đốc'}</td></tr>
        </tbody>
      </table>

      <div style={{ marginBottom: '16px', textAlign: 'justify' }}>
        Hai bên thống nhất lập Biên bản điều chỉnh về việc thay thế Hóa đơn điện tử có sai sót, cụ thể như sau:
      </div>
      <div style={{ marginBottom: '16px', textAlign: 'justify' }}>
        1. Thay thế hóa đơn mẫu số: <span className="text-red">{data.oldTemplateCode || '1C26TBB'}</span> Số hóa đơn: <span className="text-red">{data.oldInvoiceNumber || '…………'}</span> Ngày <span className="text-red">{oldInvoiceDate.day}</span> tháng <span className="text-red">{oldInvoiceDate.month}</span> năm <span className="text-red">{oldInvoiceDate.year}</span>
      </div>
      <div style={{ marginBottom: '16px', textAlign: 'justify' }}>
        2. Lý do điều chỉnh: <span className="text-red">{data.reason || 'Sai thông tin'}</span>
      </div>

      <div style={{ marginBottom: '16px', textAlign: 'justify' }}>
        3. Nội dung điều chỉnh: 
      </div>
      
      {!isLineItemAdjustment ? (
        // Hiển thị nội dung sửa thông tin người mua (Mặc định)
        <>
          <div style={{ paddingLeft: '20px', marginBottom: '8px' }} className="doc-italic">
            <span className="doc-bold">Nội dung đã lập sai: </span> 
          </div>
          <table style={{ width: '100%', marginBottom: '16px', paddingLeft: '20px' }}>
            <tbody>
              <tr><td style={{ width: '150px' }}>Họ và tên người mua:</td><td className="text-red">{data.wrongBuyerName || '...................................................'}</td></tr>
              <tr><td>Tên đơn vị:</td><td className="text-red">{data.wrongCompanyName || '...................................................'}</td></tr>
              <tr><td>Mã số thuế:</td><td className="text-red">{data.wrongTaxCode || '...................................................'}</td></tr>
              <tr><td>Địa chỉ:</td><td className="text-red">{data.wrongAddress || '...................................................'}</td></tr>
            </tbody>
          </table>

          <div style={{ paddingLeft: '20px', marginBottom: '8px' }} className="doc-italic">
            <span className="doc-bold">Nay điều chỉnh thành: </span> 
          </div>
          <table style={{ width: '100%', marginBottom: '16px', paddingLeft: '20px' }}>
            <tbody>
              <tr><td style={{ width: '150px' }}>Họ và tên người mua:</td><td className="text-red">{data.correctBuyerName || '...................................................'}</td></tr>
              <tr><td>Tên đơn vị:</td><td className="text-red">{data.correctCompanyName || '...................................................'}</td></tr>
              <tr><td>Mã số thuế:</td><td className="text-red">{data.correctTaxCode || '...................................................'}</td></tr>
              <tr><td>Địa chỉ:</td><td className="text-red">{data.correctAddress || '...................................................'}</td></tr>
            </tbody>
          </table>
        </>
      ) : (
        // Hiển thị 2 bảng hàng hóa (Lựa chọn mới)
        <>
          <InvoiceTableRenderer title="a) Nội dung đã lập sai:" items={data.oldItems} />
          <InvoiceTableRenderer title="b) Nay điều chỉnh thành:" items={data.newItems} />
        </>
      )}

      <div style={{ marginBottom: '16px', textAlign: 'justify' }}>
        4. Hoá đơn thay thế mẫu số: ................ ký hiệu: ................ Số hóa đơn: ................ Ngày <span className="text-red">{newInvoiceDate.day}</span> tháng <span className="text-red">{newInvoiceDate.month}</span> năm <span className="text-red">{newInvoiceDate.year}</span>
      </div>

      <div style={{ marginBottom: '16px', textAlign: 'justify' }}>
        Hai bên cam kết các thông tin khai báo trên là chính xác. Biên bản này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị pháp lý như nhau.
      </div>

      <div className="doc-signature-section">
        <div>
          <p className="doc-bold">ĐẠI DIỆN BÊN MUA</p>
          <div style={{ height: '80px' }}></div>
        </div>
        <div>
          <p className="doc-bold">ĐẠI DIỆN BÊN BÁN</p>
          <div style={{ height: '80px' }}></div>
        </div>
      </div>
    </div>
  );
}
