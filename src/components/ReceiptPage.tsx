/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Printer, 
  CheckCircle, 
  ChevronLeft, 
  FileText,
  MapPin,
  Clock,
  Phone,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

export const ReceiptPage: React.FC = () => {
  const { activeOrder, setView, profile } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const downloadTextReceipt = () => {
    if (!activeOrder) return;
    const itemsText = activeOrder.items
      .map(
        (item) =>
          `- ${item.name.padEnd(25)} x${item.quantity.toString().padEnd(3)} Rs. ${item.price * item.quantity}`
      )
      .join('\n');

    const tax = Math.round(activeOrder.totalAmount * 0.05);
    const total = Math.round(activeOrder.totalAmount * 1.05);
    const dateFormatted = new Date(activeOrder.createdAt).toLocaleString();

    const isSelfDelivery = activeOrder.customerName === activeOrder.recipientName;
    const recipientDetails = isSelfDelivery
      ? `DELIVERED TO (SELF):
Name:    ${activeOrder.customerName}
Phone:   ${activeOrder.phone}
Email:   ${activeOrder.customerEmail}`
      : `ORDERED BY:
Name:    ${activeOrder.customerName}
Email:   ${activeOrder.customerEmail}

DELIVERED TO (RECIPIENT):
Name:    ${activeOrder.recipientName}
Phone:   ${activeOrder.recipientPhone || activeOrder.phone}
Email:   ${activeOrder.recipientEmail}`;

    const slip = `================================================
                CHUTNEY & CO.
       Premium Grill & Street Food Oasis
================================================
Invoice: #${activeOrder.id}
Date: ${dateFormatted}
================================================
CUSTOMER & DELIVERY DETAILS:
${recipientDetails}
Address: ${activeOrder.address}
Payment: ${activeOrder.paymentMethod === 'cash' ? 'Cash On Delivery' : 'Credit Card'}
================================================
SELECTED DISHES:
${itemsText}
================================================
Subtotal:              Rs. ${activeOrder.totalAmount}
GST Tax (5%):          Rs. ${tax}
Shipping Fare:         FREE
------------------------------------------------
TOTAL AMOUNT:          Rs. ${total}
================================================
     Thank you for choosing Chutney & Co.!
     For support: support@chutneyandco.com
       Call us at +92 (300) 123-4567
================================================
`;
    const blob = new Blob([slip], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chutney_Receipt_${activeOrder.id.substring(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadHTMLReceipt = () => {
    if (!activeOrder) return;
    const tax = Math.round(activeOrder.totalAmount * 0.05);
    const total = Math.round(activeOrder.totalAmount * 1.05);
    const dateStr = new Date(activeOrder.createdAt).toLocaleDateString();
    const timeStr = new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const isSelfDelivery = activeOrder.customerName === activeOrder.recipientName;
    const recipientDetailsHTML = isSelfDelivery ? `
      <div class="meta-box" style="width: 100%; margin-bottom: 4px;">
        <div class="meta-label">Customer / Recipient</div>
        <div class="meta-val" style="color: #0f172a; font-size: 15px;">${activeOrder.customerName}</div>
        <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px;">
          Phone: ${activeOrder.phone} <br/> Email: ${activeOrder.customerEmail}
        </div>
      </div>
    ` : `
      <div class="meta-box" style="width: 46%; border-right: 1px dashed #e2e8f0; padding-right: 10px; margin-bottom: 0;">
        <div class="meta-label">Ordered By (Owner)</div>
        <div class="meta-val" style="color: #0f172a; font-weight: bold;">${activeOrder.customerName}</div>
        <div style="font-size: 11px; color: #64748b;">${activeOrder.customerEmail}</div>
      </div>
      <div class="meta-box" style="width: 48%; padding-left: 10px; margin-bottom: 0;">
        <div class="meta-label" style="color: #f59e0b;">Delivered To (Recipient)</div>
        <div class="meta-val" style="color: #0f172a; font-weight: 800;">${activeOrder.recipientName}</div>
        <div style="font-size: 11px; color: #64748b; font-weight: 500; line-height: 1.3;">
          Phone: ${activeOrder.recipientPhone || activeOrder.phone} <br/> ${activeOrder.recipientEmail}
        </div>
      </div>
    `;

    const itemsHTML = activeOrder.items.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #f1f5f9; padding: 10px 0; font-size: 14px;">
        <div>
          <strong style="color: #0f172a;">${item.name}</strong>
          <div style="font-size: 11px; color: #64748b; font-family: monospace;">Rs. ${item.price} each &times; ${item.quantity}</div>
        </div>
        <span style="font-family: monospace; font-weight: bold; color: #0f172a;">Rs. ${item.price * item.quantity}</span>
      </div>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - Chutney & Co.</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .receipt-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      max-width: 500px;
      width: 100%;
      padding: 40px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      position: relative;
    }
    .color-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #f59e0b, #eab308, #f59e0b);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }
    .subtitle {
      font-size: 11px;
      color: #94a3b8;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin: 0;
      font-weight: 600;
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .meta-box {
      width: 48%;
      margin-bottom: 12px;
    }
    .meta-label {
      color: #94a3b8;
      font-weight: 500;
      margin-bottom: 4px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .meta-val {
      font-weight: 700;
      color: #334155;
    }
    .destination-box {
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .destination-title {
      color: #94a3b8;
      font-weight: bold;
      margin-bottom: 4px;
      font-size: 11px;
      text-transform: uppercase;
    }
    .destination-body {
      color: #475569;
      line-height: 1.5;
      font-weight: 600;
    }
    .section-title {
      font-size: 11px;
      font-weight: bold;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .totals {
      border-top: 2px dashed #f1f5f9;
      padding-top: 20px;
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13px;
      text-align: right;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      color: #64748b;
    }
    .grand-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #0f172a;
      border-top: 2px dashed #f1f5f9;
      padding-top: 16px;
      margin-top: 12px;
    }
    .btn-container {
      margin-top: 30px;
      text-align: center;
    }
    .print-btn {
      background-color: #0f172a;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: background-color 0.2s;
    }
    .print-btn:hover {
      background-color: #1e293b;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .receipt-card {
        border: none;
        box-shadow: none;
        max-width: 100%;
        padding: 0;
      }
      .btn-container {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="color-line"></div>
    <div class="header">
      <h1 class="title">Chutney & Co.</h1>
      <p class="subtitle">Premium Grill & Street Food Oasis</p>
      <p style="font-size: 11px; color: #64748b; margin-top: 8px;">Karachi: Left Turn, Block 4, Clifton | Khanpur: Model Town</p>
    </div>

    <div class="meta-row">
      <div class="meta-box">
        <div class="meta-label">Invoice Ref</div>
        <div class="meta-val" style="font-family: monospace;">#${activeOrder.id}</div>
      </div>
      <div class="meta-box" style="text-align: right;">
        <div class="meta-label">Date & Time</div>
        <div class="meta-val">${dateStr} ${timeStr}</div>
      </div>
    </div>

    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
      ${recipientDetailsHTML}
    </div>

    <div class="meta-row">
      <div class="meta-box" style="width: 100%; margin-bottom: 0;">
        <div class="meta-label">Payment Mode</div>
        <div class="meta-val" style="text-transform: uppercase;">${activeOrder.paymentMethod === 'cash' ? 'Cash On Delivery' : 'Charged Credit Card'}</div>
      </div>
    </div>

    <div class="destination-box">
      <div class="destination-title">Delivery Destination</div>
      <div class="destination-body">${activeOrder.address}</div>
    </div>

    <h4 class="section-title">Selected Platters</h4>
    <div>
      ${itemsHTML}
    </div>

    <div class="totals">
      <div class="total-row">
        <span>Items Subtotal</span>
        <span style="font-family: monospace; color: #334155;">Rs. ${activeOrder.totalAmount}</span>
      </div>
      <div class="total-row">
        <span>GST Tax (5%)</span>
        <span style="font-family: monospace; color: #334155;">Rs. ${tax}</span>
      </div>
      <div class="total-row">
        <span>Shipping Fare</span>
        <span style="font-weight: bold; color: #10b981;">FREE</span>
      </div>
      <div class="grand-total">
        <span>Amount Paid / Due</span>
        <span style="color: #f59e0b; font-size: 22px;">Rs. ${total}</span>
      </div>
    </div>

    <div style="text-align: center; font-size: 12px; color: #94a3b8; font-family: monospace; margin-top: 30px;">
      <p>Thank you for choosing Chutney & Co.!</p>
      <p>support@chutneyandco.com</p>
    </div>

    ${profile?.role === 'admin' ? `
    <div class="btn-container">
      <button class="print-btn" onclick="window.print()">Print This Receipt</button>
    </div>
    ` : `
    <div style="text-align: center; margin-top: 25px; padding: 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 11px; color: #64748b; font-family: monospace;">
      <strong>Invoice Copy (Downloaded Script)</strong><br/>
      Notice: Customer Copy - Physical printing disabled. Contact local staff unit for certified slips.
    </div>
    `}
  </div>
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chutney_Receipt_${activeOrder.id.substring(0, 8)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!activeOrder) {
    return (
      <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-10 px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 text-center max-w-sm space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" strokeWidth={1} />
          <h3 className="font-bold text-slate-800 dark:text-white">Receipt Record Offline</h3>
          <p className="text-xs text-slate-400">Place an order first to receive a transaction receipt.</p>
          <button 
            onClick={() => setView('menu')}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  const tax = Math.round(activeOrder.totalAmount * 0.05);
  const total = Math.round(activeOrder.totalAmount * 1.05);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Navigation Action */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button 
            onClick={() => setView('menu')}
            className="font-sans font-bold text-slate-500 hover:text-amber-500 text-xs flex items-center gap-2 cursor-pointer transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Continue Dining
          </button>
        </div>

        {/* Successful Notice header */}
        <div className="text-center space-y-2 mb-8 print:hidden">
          <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white pb-1 animate-fade-in">Payment Finalized!</h2>
          <p className="text-xs text-slate-400">The kitchen team represents the order and will begin barbecuing shortly.</p>
        </div>

        {/* Brand Document & Print Tools */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 mb-8 text-left space-y-4 shadow-sm print:hidden">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-50 dark:border-slate-800/40">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Download className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Document & Print Center</h3>
              <p className="text-[11px] text-slate-400">Save, download or print your barbecue invoice in multiple formats.</p>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${profile?.role === 'admin' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
            {profile?.role === 'admin' && (
              <button
                onClick={handlePrint}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
                id="btn-print-action"
              >
                <Printer className="w-4 h-4 text-amber-500" />
                Print Paper Slip
              </button>
            )}

            <button
              onClick={downloadHTMLReceipt}
              className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
              id="btn-download-html"
            >
              <FileText className="w-4 h-4 text-amber-500" />
              Download HTML Ticket
            </button>

            <button
              onClick={downloadTextReceipt}
              className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
              id="btn-download-txt"
            >
              <Download className="w-4 h-4 text-amber-500" />
              Download POS Slip
            </button>
          </div>
        </div>

        {/* Styled Printable Receipt Paper */}
        <div 
          ref={printRef}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100 dark:shadow-slate-950 text-left space-y-6 relative overflow-hidden"
          id="receipt-print-canvas"
        >
          {/* Authentic Top thermal border strips */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>

          {/* Restaurant Header */}
          <div className="text-center border-b border-dashed border-slate-100 dark:border-slate-800 pb-6 space-y-1">
            <h1 className="font-sans font-black text-xl text-slate-950 dark:text-amber-500 tracking-tight uppercase">Chutney & Co.</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">Premium Grill & Street Food Oasis</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-2 font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> KHI: Left Turn, Block 4 | KHP: Model Town</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-500" /> +92 (300) 123-4567</span>
            </div>
          </div>

          {/* Transactional Meta details */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-dashed border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1.5 flex flex-col justify-start">
              <p className="text-slate-400 font-medium font-sans">Invoice Reference</p>
              <p className="font-mono font-bold text-slate-850 dark:text-slate-200 truncate pr-2 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded inline-block self-start">#{activeOrder.id}</p>
            </div>
            <div className="space-y-1.5 text-right">
              <p className="text-slate-400 font-medium">Billing Date & Hour</p>
              <p className="font-mono font-bold text-slate-850 dark:text-slate-200">
                {new Date(activeOrder.createdAt).toLocaleDateString()} at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Customer & Recipient details card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-xs">
            {activeOrder.customerName === activeOrder.recipientName ? (
              <div className="space-y-1.5">
                <p className="text-amber-500 font-bold font-sans text-[10px] uppercase tracking-wider">Customer & Recipient Details</p>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white font-sans text-sm">{activeOrder.customerName}</p>
                    <p className="text-slate-500 dark:text-slate-400">{activeOrder.customerEmail}</p>
                  </div>
                  <div className="sm:text-right mt-1.5 sm:mt-0">
                    <p className="text-slate-400">Contact phone</p>
                    <p className="font-semibold text-slate-850 dark:text-slate-200 font-mono">{activeOrder.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:border-r sm:border-dashed sm:border-slate-200 sm:dark:border-slate-800 sm:pr-4">
                  <p className="text-slate-450 font-bold font-sans text-[10px] uppercase tracking-wider">Ordered By (Owner)</p>
                  <p className="text-slate-850 dark:text-slate-200 font-bold text-sm">{activeOrder.customerName}</p>
                  <p className="text-slate-500 dark:text-slate-400 truncate">{activeOrder.customerEmail}</p>
                  <p className="text-slate-400 font-mono text-[10px]">Buyer Account ID</p>
                </div>
                <div className="space-y-1 sm:pl-2">
                  <p className="text-amber-500 font-bold font-sans text-[10px] uppercase tracking-wider">Delivered To (Recipient)</p>
                  <p className="text-slate-900 dark:text-white font-extrabold text-sm">{activeOrder.recipientName}</p>
                  <p className="text-slate-500 dark:text-slate-400">{activeOrder.recipientEmail}</p>
                  <p className="text-slate-750 dark:text-slate-350 font-mono">Phone: {activeOrder.recipientPhone || activeOrder.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-1">
              <p className="text-slate-400 font-bold font-sans">Payment Method</p>
              <p className="font-bold text-slate-850 dark:text-slate-200 font-mono uppercase text-sm">
                {activeOrder.paymentMethod === 'cash' ? '💵 Cash On Delivery' : '💳 Charged Card'}
              </p>
            </div>
            
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-1">
              <p className="text-slate-400 font-bold font-sans animate-pulse">Delivery Status</p>
              <p className="font-bold text-amber-500 font-mono text-sm uppercase">Pending Kitchen Grill</p>
            </div>
          </div>

          {/* Shipping Address summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-xs space-y-1.5">
            <p className="text-slate-400 font-bold font-sans">Full Delivery Destination</p>
            <p className="text-slate-800 dark:text-slate-300 leading-relaxed font-semibold">{activeOrder.address}</p>
          </div>

          {/* Items detailed catalog */}
          <div className="space-y-4 pt-2">
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-light border-slate-50 dark:border-slate-800/40 pb-2">Selected Platters</h4>
            <div className="space-y-3">
              {activeOrder.items.map((item, id) => (
                <div key={id} className="flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white font-sans">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Rs. {item.price} each × {item.quantity}</p>
                  </div>
                  <span className="font-mono font-bold text-slate-950 dark:text-slate-250">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Totals block */}
          <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-5 space-y-2.5 text-xs text-right">
            <div className="flex justify-between text-slate-500">
              <span className="font-sans">Items Total Amount</span>
              <span className="font-mono text-slate-800 dark:text-slate-300">Rs. {activeOrder.totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-sans">
              <span>GST Tax (5%)</span>
              <span className="font-mono text-slate-800 dark:text-slate-300 font-bold">Rs. {tax}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span className="font-sans">Shipping Fare</span>
              <span className="font-bold font-mono text-green-500">FREE</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold border-t border-dashed border-slate-200 dark:border-slate-800 pt-4">
              <span className="font-sans text-slate-900 dark:text-white">Amount Due / Paid</span>
              <span className="font-sans text-xl text-amber-500">Rs. {total}</span>
            </div>
          </div>

          {/* Footer signature */}
          <div className="text-center pt-8 border-t border-dashed border-slate-100 dark:border-slate-800/40 text-[10px] text-slate-400 font-mono">
            <p>Thank you for choosing Chutney & Co.!</p>
            <p className="mt-1">For support call +92 (300) 123-4567 or email support@chutneyandco.com</p>
          </div>
        </div>

        {/* Navigation back and alerts */}
        <div className="mt-8 print:hidden">
          <button 
            onClick={() => setView('dashboard')}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 border-none text-white font-bold text-sm transition font-sans cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15"
          >
            Track Active Orders in Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
