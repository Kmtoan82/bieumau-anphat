import React, { useState, useRef } from 'react';
import { Mail, Download, Check, ChevronRight, ChevronLeft, Settings } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import VatAdjustmentTemplate from './templates/VatAdjustmentTemplate';
import WrongInfoTemplate from './templates/WrongInfoTemplate';
import NoticeErrorTemplate from './templates/NoticeErrorTemplate';

const DEFAULT_SETTINGS = {
  sellerName: 'Công ty Cổ Phần Thương Mại Máy Tính An Phát',
  sellerTaxCode: '0108940873',
  sellerAddress: 'Tầng 5, số 49 Phố Thái Hà, Phường Đống Đa, Thành Phố Hà Nội, Việt Nam',
  sellerRep: 'Nguyễn Thu Trang',
  sellerRole: 'Kế toán trưởng',
  lawsText: `Căn cứ Luật Quản lý thuế ngày 13 tháng 06 năm 2019;
Căn cứ Nghị định 123/2020/NĐ-CP ngày 19 tháng 10 năm 2020 quy định về hoá đơn, chứng từ;
Căn cứ Nghị định 70/2025/NĐ-CP ngày 20 tháng 3 năm 2025 sửa đổi, bổ sung một số điều của Nghị định 123/2020/NĐ-CP quy định về hóa đơn, chứng từ;
Căn cứ Thông tư 32/2025/TT-BTC ngày 31 tháng 5 năm hướng dẫn thực hiện Luật Quản lý thuế, Nghị định 123/2020/NĐ-CP quy định về hóa đơn, chứng từ, Nghị định 70/2025/NĐ-CP sửa đổi Nghị định 123/2020/NĐ-CP.`
};

const TEMPLATES = [
  {
    id: 'vat-adjustment-return',
    name: '1. Biên bản điều chỉnh hóa đơn VAT',
    desc: 'Trường hợp hoàn trả hàng do lỗi',
    steps: [
      { title: 'Thông tin chung', keys: ['recordNumber', 'orderId', 'deliveryDate', 'recordDate'] },
      { title: 'Bên mua hàng', keys: ['buyerName', 'buyerTaxCode', 'buyerAddress', 'buyerRep', 'buyerRole'] },
      { title: 'Hóa đơn cũ', keys: ['oldTemplateCode', 'oldInvoiceNumber', 'oldInvoiceDate', 'reason'] },
      { title: 'Hóa đơn mới', keys: ['newInvoiceDate'] }
    ]
  },
  {
    id: 'wrong-info-notice',
    name: '2. Biên bản điều chỉnh hóa đơn (sai tên / địa chỉ/ MST)',
    desc: 'Mẫu lập hóa đơn thay thế khi có sai sót',
    steps: [
      { title: 'Thông tin chung', keys: ['recordNumber', 'orderId', 'deliveryDate', 'recordDate'] },
      { title: 'Bên mua hàng', keys: ['buyerName', 'buyerTaxCode', 'buyerAddress', 'buyerRep', 'buyerRole'] },
      { title: 'Hóa đơn cũ', keys: ['oldTemplateCode', 'oldInvoiceNumber', 'oldInvoiceDate', 'reason'] },
      { title: 'Nội dung điều chỉnh', keys: ['wrongBuyerName', 'correctBuyerName'] },
      { title: 'Hóa đơn mới', keys: ['newInvoiceDate'] }
    ]
  },
  {
    id: 'notice-error',
    name: '3. THÔNG BÁO VỀ HÓA ĐƠN ĐIỆN TỬ CÓ SAI SÓT',
    desc: 'Mẫu thông báo phát hiện sai sót (NĐ 254/2026)',
    steps: [
      { title: 'Ngày lập Thông báo', keys: ['recordNumber', 'recordDate'] },
      { title: 'Hóa đơn đã xuất', keys: ['oldTemplateCode', 'oldInvoiceNumber', 'oldInvoiceDate'] },
      { title: 'Chi tiết Địa chỉ sai sót', keys: ['wrongAddress', 'correctAddress', 'discoverDate'] }
    ]
  }
];

export default function App() {
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0].id);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const documentRef = useRef();

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const activeTemplateConfig = TEMPLATES.find(t => t.id === activeTemplate);
  const currentSteps = activeTemplateConfig ? activeTemplateConfig.steps : [];

  const [formData, setFormData] = useState({
    recordNumber: '01/BBĐC',
    orderId: '',
    deliveryDate: '',
    recordDate: new Date().toISOString().split('T')[0],
    buyerName: '',
    buyerTaxCode: '',
    buyerAddress: '',
    buyerRep: '',
    buyerRole: 'Giám đốc',
    oldTemplateCode: '1C26TBB',
    oldInvoiceNumber: '',
    oldInvoiceDate: '',
    reason: 'Sai sót thông tin',
    wrongBuyerName: '',
    wrongCompanyName: '',
    wrongTaxCode: '',
    wrongAddress: '',
    correctBuyerName: '',
    correctCompanyName: '',
    correctTaxCode: '',
    correctAddress: '',
    newInvoiceDate: '',
    discoverDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => {
      const newSettings = { ...prev, [name]: value };
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const nextStep = () => {
    if (currentStep < currentSteps.length - 1) setCurrentStep(c => c + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const handleTemplateChange = (id) => {
    setActiveTemplate(id);
    setCurrentStep(0);
  };

  const resetSettings = () => {
    if(window.confirm("Bạn muốn khôi phục toàn bộ Cài đặt về mặc định ban đầu?")) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('appSettings', JSON.stringify(DEFAULT_SETTINGS));
    }
  };

  const handleExportPDF = async () => {
    if (!documentRef.current || !activeTemplateConfig) return;
    setIsGenerating(true);
    
    let logs = JSON.parse(localStorage.getItem('formLogs') || '[]');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    logs = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);
    
    logs.push({
      id: Date.now(),
      templateId: activeTemplate,
      date: new Date().toISOString(),
      recordNumber: formData.recordNumber,
      formData: { ...formData }
    });
    localStorage.setItem('formLogs', JSON.stringify(logs));

    const element = documentRef.current;
    element.classList.add('exporting-pdf');
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${activeTemplateConfig.name.replace(/ /g, '_')}_${formData.recordNumber.replace(/\//g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi tạo PDF");
    } finally {
      if (documentRef.current) {
        documentRef.current.classList.remove('exporting-pdf');
      }
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar glass-panel" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0 }}>
        <h2>Biểu mẫu Doanh nghiệp</h2>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TEMPLATES.map(tpl => (
            <div 
              key={tpl.id}
              className={`template-item ${activeTemplate === tpl.id ? 'active' : ''}`}
              onClick={() => handleTemplateChange(tpl.id)}
            >
              <h3>{tpl.name}</h3>
              <p>{tpl.desc}</p>
            </div>
          ))}
          
          <div style={{ margin: '16px 0', borderTop: '1px solid var(--surface-border)' }}></div>

          <div 
              className={`template-item ${activeTemplate === 'settings' ? 'active' : ''}`}
              onClick={() => handleTemplateChange('settings')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <Settings size={20} />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Cài đặt Mẫu</h3>
                <p style={{ fontSize: '0.75rem', marginTop: '2px' }}>Chỉnh sửa thông tin cố định</p>
              </div>
          </div>
        </div>
        
        <div className="recent-logs" style={{ marginTop: 'auto', borderTop: '1px solid var(--surface-border)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Lịch sử (30 ngày qua)</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {JSON.parse(localStorage.getItem('formLogs') || '[]')
              .filter(log => new Date(log.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
              .slice(-10).reverse().map((log, i) => (
              <div 
                key={log.id || i} 
                className="log-item"
                title="Nhấn để tải lại dữ liệu này"
                onClick={() => {
                  if(window.confirm("Bạn muốn tải lại dữ liệu của biên bản này để chỉnh sửa?")) {
                    setFormData(log.formData);
                    setActiveTemplate(log.templateId);
                    setCurrentStep(0);
                  }
                }}
              >
                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{log.recordNumber}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                  {new Date(log.date).toLocaleString('vi-VN')} - {TEMPLATES.find(t => t.id === log.templateId)?.name?.split('.')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="main-content">
        
        {activeTemplate === 'settings' ? (
          // SETTINGS VIEW
          <div className="glass-panel" style={{ padding: '32px', width: '100%', maxWidth: '800px', margin: '0 auto', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 className="section-title">Cài đặt Nội dung Cố định</h1>
                <p style={{ color: 'var(--text-muted)' }}>Các thông tin này sẽ được lưu và áp dụng cho tất cả các lần xuất PDF sau.</p>
              </div>
              <button className="btn btn-outline" onClick={resetSettings}>Khôi phục Mặc định</button>
            </div>

            <h3 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Thông tin Đơn vị Bán hàng (Bên Bán)</h3>
            <div className="form-group">
              <label>Tên Công ty</label>
              <input type="text" className="form-control" name="sellerName" value={settings.sellerName} onChange={handleSettingChange} />
            </div>
            <div className="form-group">
              <label>Mã số thuế</label>
              <input type="text" className="form-control" name="sellerTaxCode" value={settings.sellerTaxCode} onChange={handleSettingChange} />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input type="text" className="form-control" name="sellerAddress" value={settings.sellerAddress} onChange={handleSettingChange} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Người đại diện</label>
                <input type="text" className="form-control" name="sellerRep" value={settings.sellerRep} onChange={handleSettingChange} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Chức vụ</label>
                <input type="text" className="form-control" name="sellerRole" value={settings.sellerRole} onChange={handleSettingChange} />
              </div>
            </div>

            <h3 style={{ color: 'var(--primary)', margin: '24px 0 16px' }}>Các Căn cứ Pháp lý (Dùng chung)</h3>
            <div className="form-group">
              <label>Danh sách các căn cứ (Mỗi dòng 1 thẻ p)</label>
              <textarea className="form-control" name="lawsText" value={settings.lawsText} onChange={handleSettingChange} rows="8"></textarea>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '8px' }}>
              <Check size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> 
              Mọi thay đổi đã được hệ thống tự động lưu lại!
            </div>
          </div>
        ) : (
          // WIZARD VIEW
          <>
            <div className="form-section glass-panel" style={{ padding: '32px' }}>
              <div>
                <h1 className="section-title">Nhập liệu Biểu mẫu</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Điền thông tin theo từng bước để tạo tài liệu</p>
              </div>

              {activeTemplateConfig && (
                <>
                  <div className="wizard-header">
                    <h3 style={{ fontWeight: 500 }}>Bước {currentStep + 1}: {currentSteps[currentStep].title}</h3>
                    <div className="wizard-steps">
                      {currentSteps.map((_, idx) => (
                        <div key={idx} className={`step-indicator ${idx === currentStep ? 'active' : idx < currentStep ? 'completed' : ''}`} />
                      ))}
                    </div>
                  </div>

                  <div className="wizard-body" style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                    
                    {currentSteps[currentStep].title === 'Thông tin chung' && (
                        <>
                          <div className="form-group">
                            <label>Số Biên bản</label>
                            <input type="text" className="form-control" name="recordNumber" value={formData.recordNumber} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Số đơn hàng Shopee</label>
                            <input type="text" className="form-control" name="orderId" value={formData.orderId} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Ngày giao thành công</label>
                            <input type="date" className="form-control" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Ngày lập biên bản</label>
                            <input type="date" className="form-control" name="recordDate" value={formData.recordDate} onChange={handleInputChange} />
                          </div>
                        </>
                    )}

                    {currentSteps[currentStep].title === 'Ngày lập Thông báo' && (
                        <>
                          <div className="form-group">
                            <label>Số Lưu trữ (Dùng đặt tên file PDF)</label>
                            <input type="text" className="form-control" name="recordNumber" value={formData.recordNumber} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Ngày lập Thông báo</label>
                            <input type="date" className="form-control" name="recordDate" value={formData.recordDate} onChange={handleInputChange} />
                          </div>
                        </>
                    )}
                    
                    {currentSteps[currentStep].title === 'Bên mua hàng' && (
                        <>
                          <div className="form-group">
                            <label>Tên đơn vị mua hàng</label>
                            <input type="text" className="form-control" name="buyerName" value={formData.buyerName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Mã số thuế</label>
                            <input type="text" className="form-control" name="buyerTaxCode" value={formData.buyerTaxCode} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Địa chỉ</label>
                            <input type="text" className="form-control" name="buyerAddress" value={formData.buyerAddress} onChange={handleInputChange} />
                          </div>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Người đại diện</label>
                              <input type="text" className="form-control" name="buyerRep" value={formData.buyerRep} onChange={handleInputChange} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Chức vụ</label>
                              <input type="text" className="form-control" name="buyerRole" value={formData.buyerRole} onChange={handleInputChange} />
                            </div>
                          </div>
                        </>
                    )}

                    {(currentSteps[currentStep].title === 'Hóa đơn cũ' || currentSteps[currentStep].title === 'Hóa đơn đã xuất') && (
                        <>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Ký hiệu / Mẫu số HĐ</label>
                              <input type="text" className="form-control" name="oldTemplateCode" value={formData.oldTemplateCode} onChange={handleInputChange} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Số Hóa đơn</label>
                              <input type="text" className="form-control" name="oldInvoiceNumber" value={formData.oldInvoiceNumber} onChange={handleInputChange} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Ngày xuất Hóa đơn cũ</label>
                            <input type="date" className="form-control" name="oldInvoiceDate" value={formData.oldInvoiceDate} onChange={handleInputChange} />
                          </div>
                          {currentSteps[currentStep].title === 'Hóa đơn cũ' && (
                            <div className="form-group">
                              <label>Lý do thay thế</label>
                              <textarea className="form-control" name="reason" value={formData.reason} onChange={handleInputChange} rows="3"></textarea>
                            </div>
                          )}
                        </>
                    )}

                    {currentSteps[currentStep].title === 'Nội dung điều chỉnh' && (
                        <>
                          <h4 style={{marginBottom: '16px', color: 'var(--danger)'}}>Thông tin CŨ (Đã ghi sai)</h4>
                          <div className="form-group">
                            <label>Họ và tên người mua</label>
                            <input type="text" className="form-control" name="wrongBuyerName" value={formData.wrongBuyerName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Tên đơn vị</label>
                            <input type="text" className="form-control" name="wrongCompanyName" value={formData.wrongCompanyName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Mã số thuế</label>
                            <input type="text" className="form-control" name="wrongTaxCode" value={formData.wrongTaxCode} onChange={handleInputChange} />
                          </div>
                          <div className="form-group" style={{marginBottom: '32px'}}>
                            <label>Địa chỉ</label>
                            <input type="text" className="form-control" name="wrongAddress" value={formData.wrongAddress} onChange={handleInputChange} />
                          </div>

                          <h4 style={{marginBottom: '16px', color: 'var(--secondary)'}}>Thông tin MỚI (Đúng chuẩn)</h4>
                          <div className="form-group">
                            <label>Họ và tên người mua</label>
                            <input type="text" className="form-control" name="correctBuyerName" value={formData.correctBuyerName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Tên đơn vị</label>
                            <input type="text" className="form-control" name="correctCompanyName" value={formData.correctCompanyName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Mã số thuế</label>
                            <input type="text" className="form-control" name="correctTaxCode" value={formData.correctTaxCode} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Địa chỉ</label>
                            <input type="text" className="form-control" name="correctAddress" value={formData.correctAddress} onChange={handleInputChange} />
                          </div>
                        </>
                    )}

                    {currentSteps[currentStep].title === 'Chi tiết Địa chỉ sai sót' && (
                        <>
                          <div className="form-group">
                            <label>Ngày phát hiện sai sót</label>
                            <input type="date" className="form-control" name="discoverDate" value={formData.discoverDate} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Địa chỉ Ghi SAI (trên HĐ cũ)</label>
                            <input type="text" className="form-control" name="wrongAddress" value={formData.wrongAddress} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Địa chỉ ĐÚNG (thực tế)</label>
                            <input type="text" className="form-control" name="correctAddress" value={formData.correctAddress} onChange={handleInputChange} />
                          </div>
                        </>
                    )}

                    {currentSteps[currentStep].title === 'Hóa đơn mới' && (
                        <>
                          <div className="form-group">
                            <label>Ngày xuất HĐ mới</label>
                            <input type="date" className="form-control" name="newInvoiceDate" value={formData.newInvoiceDate} onChange={handleInputChange} />
                          </div>
                        </>
                    )}
                  </div>

                  <div className="wizard-actions">
                    <button className="btn btn-outline" onClick={prevStep} disabled={currentStep === 0}>
                      <ChevronLeft size={18} /> Quay lại
                    </button>
                    {currentStep < currentSteps.length - 1 ? (
                      <button className="btn btn-primary" onClick={nextStep}>
                        Tiếp tục <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button className="btn btn-success" onClick={handleExportPDF} disabled={isGenerating}>
                        {isGenerating ? 'Đang tạo...' : <><Download size={18} /> Xuất PDF</>}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Live Preview */}
            <div className="preview-section glass-panel" style={{ padding: '0', background: 'var(--background)' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between' }}>
                <h2 className="section-title" style={{ margin: 0, fontSize: '1.25rem' }}>Bản xem trước</h2>
              </div>
              <div className="preview-container">
                <div className="document-wrapper">
                  <div ref={documentRef}>
                      {activeTemplate === 'vat-adjustment-return' && <VatAdjustmentTemplate data={formData} settings={settings} />}
                      {activeTemplate === 'wrong-info-notice' && <WrongInfoTemplate data={formData} settings={settings} />}
                      {activeTemplate === 'notice-error' && <NoticeErrorTemplate data={formData} settings={settings} />}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
