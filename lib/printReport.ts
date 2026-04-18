import { Proposal } from './db';

export const printProposalReport = (proposal: any) => {
  let dateStr = new Date().toLocaleDateString();
  if (proposal.createdAt) {
    if (typeof proposal.createdAt.toMillis === 'function') {
      dateStr = new Date(proposal.createdAt.toMillis()).toLocaleDateString();
    } else if (typeof proposal.createdAt === 'string' || typeof proposal.createdAt === 'number') {
      dateStr = new Date(proposal.createdAt).toLocaleDateString();
    }
  }

  const productsHtml = (proposal.recommendedProducts || []).map((p: any, index: number) => `
    <div class="item-card">
      <div class="item-card-title">Item ${index + 1}: ${p.product}</div>
      <div class="item-tags">
        <span class="tag">Quantity: ${p.quantity}</span>
        <span class="tag">Cost: $${(p.cost || 0).toLocaleString()}</span>
      </div>
      <div class="item-reasoning">
        <div class="rationale-header">Environmental Rationale</div>
        ${p.environmentalRationale || p.reasoning || "Selected based on client category preferences and strict sustainability criteria."}
      </div>
    </div>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${proposal.clientName || 'Proposal'} - Ecozy Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          color: #0f172a;
          line-height: 1.6;
          max-width: 850px;
          margin: 0 auto;
          padding: 40px;
          background: #fff;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 4px solid #10b981;
          padding-bottom: 24px;
        }

        .logo-section {
          display: flex;
          items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          color: #10b981;
        }

        .logo-text {
          font-size: 32px;
          font-weight: 800;
          color: #064e3b;
          letter-spacing: -0.05em;
        }
        
        .meta-section {
          text-align: right;
        }

        .meta-info {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .meta-value {
          font-weight: 600;
          color: #0f172a;
        }

        .hero-box {
          background-color: #064e3b;
          color: white;
          border-radius: 24px;
          padding: 48px 24px;
          text-align: center;
          margin: 32px 0;
          box-shadow: 0 10px 30px rgba(6, 78, 59, 0.15);
        }

        .hero-box .main-stat {
          font-size: 72px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1;
        }

        .hero-box .sub-stat {
          font-size: 20px;
          color: #34d399;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .hero-box .detail-stat {
          font-size: 16px;
          color: #d1fae5;
          opacity: 0.8;
        }

        .section-heading {
          font-size: 24px;
          font-weight: 800;
          color: #064e3b;
          margin: 48px 0 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-heading::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .text-content {
          font-size: 16px;
          color: #334155;
          margin-bottom: 24px;
          padding: 24px;
          background: #f8fafc;
          border-left: 4px solid #10b981;
          border-radius: 0 16px 16px 0;
        }

        .item-card {
          background-color: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          page-break-inside: avoid;
        }

        .item-card-title {
          font-weight: 800;
          font-size: 20px;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .item-tags {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .tag {
          background-color: #ecfdf5;
          color: #065f46;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #d1fae5;
        }

        .item-reasoning {
          padding-top: 20px;
          border-top: 1px dashed #e2e8f0;
          font-size: 15px;
          color: #475569;
        }

        .rationale-header {
          font-size: 12px;
          font-weight: 700;
          color: #10b981;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .footer {
          margin-top: 80px;
          padding-top: 40px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }

        .footer-logo {
          font-size: 18px;
          font-weight: 800;
          color: #064e3b;
          margin-bottom: 12px;
        }

        .footer-contact {
          font-size: 13px;
          color: #94a3b8;
          line-height: 2;
        }

        .no-print {
          display: block;
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          background: #f1f5f9;
          border-radius: 12px;
        }

        .close-btn {
          background: #064e3b;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
          .hero-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .tag { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .text-content { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C10 14.5 10.5 13.84 12 11c1 2 1.5 3.5 4 3.5 4.5 0 6 2.1 6 4.5"/><path d="M11 20c-5 0-9-5-9-10 0-3.5 3-6.5 6-6.5 2 0 3.5 1.5 4 4.5"/></svg>
          <span class="logo-text">Ecozy</span>
        </div>
        <div class="meta-section">
          <div class="meta-info">Proposal ID: <span class="meta-value">EC-${Math.random().toString(36).substring(2, 8).toUpperCase()}</span></div>
          <div class="meta-info">Date: <span class="meta-value">${dateStr}</span></div>
          <div class="meta-info">Client: <span class="meta-value">${proposal.clientName || 'N/A'}</span></div>
        </div>
      </div>

      <div class="hero-box">
        <div class="sub-stat">B2B Sustainable Procurement</div>
        <div class="main-stat">$${(proposal.totalCost || 0).toLocaleString()}</div>
        <div class="detail-stat">Total Investment Opportunity • Budget Rooted in Efficiency</div>
      </div>

      <div class="section-heading">Executive Sustainability Summary</div>
      <div class="text-content">
        ${proposal.impactSummary || 'This proposal outlines a strategic shift towards eco-conscious sourcing, prioritizing materials with lower carbon footprints and high recyclability.'}
      </div>

      <div class="section-heading">Product Recommendations & Rationale</div>
      
      ${productsHtml}

      <div class="footer">
        <div class="footer-logo">Ecozy Sustainable Commerce</div>
        <div class="footer-contact">
          Ecozy Sustainability Dept. • 123 Green Ave, Eco City, EC 94103<br/>
          contact@ecozy.sustainable • www.ecozy.com<br/>
          © ${new Date().getFullYear()} Ecozy platform. All rights reserved.
        </div>
      </div>

      <div class="no-print">
        <p>If the print dialog is closed, you can close this tab.</p>
        <button class="close-btn" onclick="window.close()">Close Document</button>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Auto-trigger print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

