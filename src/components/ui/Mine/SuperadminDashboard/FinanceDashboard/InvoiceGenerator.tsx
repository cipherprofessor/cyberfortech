// src/components/ui/Mine/FinanceDashboard/InvoiceGenerator.tsx
import React, { useState } from 'react';
import {
  IconPrinter,
  IconMail,
  IconDownload,
  IconTemplate,
  IconSignature,
  IconCurrencyDollar,
  IconPlus,
  IconTrash,
  IconEye
} from '@tabler/icons-react';

interface InvoiceTemplate {
  id: string;
  name: string;
  preview: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

interface InvoiceData {
  number: string;
  date: string;
  dueDate: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    taxId?: string;
  };
  items: InvoiceItem[];
  currency: string;
  notes: string;
  terms: string;
  subtotal: number;
  taxTotal: number;
  total: number;
}

export const InvoiceGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    number: 'INV-' + new Date().getTime(),
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerInfo: {
      name: '',
      email: '',
      address: '',
      taxId: ''
    },
    items: [],
    currency: 'USD',
    notes: '',
    terms: '',
    subtotal: 0,
    taxTotal: 0,
    total: 0
  });

  const templates: InvoiceTemplate[] = [
    {
      id: 'professional',
      name: 'Professional',
      preview: '/templates/professional.png'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      preview: '/templates/minimal.png'
    },
    {
      id: 'modern',
      name: 'Modern',
      preview: '/templates/modern.png'
    }
  ];

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' }
  ];

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      total: 0
    };
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem]
    });
  };

  const updateInvoiceItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          updatedItem.total += updatedItem.total * (updatedItem.taxRate / 100);
        }
        return updatedItem;
      }
      return item;
    });

    // Recalculate invoice totals
    const subtotal = updatedItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = updatedItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0);

    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      subtotal,
      taxTotal,
      total: subtotal + taxTotal
    });
  };

  const removeInvoiceItem = (itemId: string) => {
    const updatedItems = invoiceData.items.filter(item => item.id !== itemId);
    setInvoiceData({
      ...invoiceData,
      items: updatedItems
    });
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <IconTemplate className="h-5 w-5 mr-2" />
          Select Template
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`relative rounded-lg border-2 cursor-pointer overflow-hidden
                ${selectedTemplate === template.id
                  ? 'border-blue-500'
                  : 'border-gray-200 dark:border-gray-700'
                }`}
            >
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t 
                from-black/50 to-transparent">
                <span className="text-white font-medium">{template.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceData.number}
              onChange={(e) => setInvoiceData({ ...invoiceData, number: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              value={invoiceData.date}
              onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Customer Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={invoiceData.customerInfo.name}
                onChange={(e) => setInvoiceData({
                  ...invoiceData,
                  customerInfo: { ...invoiceData.customerInfo, name: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={invoiceData.customerInfo.email}
                onChange={(e) => setInvoiceData({
                  ...invoiceData,
                  customerInfo: { ...invoiceData.customerInfo, email: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                value={invoiceData.customerInfo.address}
                onChange={(e) => setInvoiceData({
                  ...invoiceData,
                  customerInfo: { ...invoiceData.customerInfo, address: e.target.value }
                })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">
              Invoice Items
            </h4>
            <button
              onClick={addInvoiceItem}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white 
                rounded-lg hover:bg-blue-700"
            >
              <IconPlus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 
                    dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 
                    dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 
                    dark:text-gray-400 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 
                    dark:text-gray-400 uppercase tracking-wider">
                    Tax Rate (%)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 
                    dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 
                    dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {invoiceData.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-gray-200 dark:border-gray-700 
                          bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 
                          bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', Number(e.target.value))}
                        className="w-24 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 
                          bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => updateInvoiceItem(item.id, 'taxRate', Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded border border-gray-200// Continuation of InvoiceGenerator.tsx

                        dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-gray-900 dark:text-white font-medium">
                        {currencies.find(c => c.code === invoiceData.currency)?.symbol}
                        {item.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeInvoiceItem(item.id)}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 
                          dark:hover:text-red-300"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <td colSpan={3} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">
                    Subtotal:
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {currencies.find(c => c.code === invoiceData.currency)?.symbol}
                    {invoiceData.subtotal.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">
                    Tax Total:
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {currencies.find(c => c.code === invoiceData.currency)?.symbol}
                    {invoiceData.taxTotal.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                    Total:
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white text-lg">
                    {currencies.find(c => c.code === invoiceData.currency)?.symbol}
                    {invoiceData.total.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              rows={4}
              placeholder="Additional notes to the customer..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Terms & Conditions
            </label>
            <textarea
              value={invoiceData.terms}
              onChange={(e) => setInvoiceData({ ...invoiceData, terms: e.target.value })}
              rows={4}
              placeholder="Terms and conditions..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Digital Signature Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <IconSignature className="h-5 w-5 mr-2" />
          Digital Signature
        </h3>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Draw your signature or upload a signature image
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload Signature
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <button
          onClick={() => {/* Preview functionality */}}
          className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 
            text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <IconEye className="h-4 w-4 mr-2" />
          Preview
        </button>
        
        <button
          onClick={() => {/* Download as PDF */}}
          className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 
            text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <IconDownload className="h-4 w-4 mr-2" />
          Download PDF
        </button>

        <button
          onClick={() => {/* Send via email */}}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <IconMail className="h-4 w-4 mr-2" />
          Send Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;