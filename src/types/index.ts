export type ProductCategory = 
  | 'Round Neck T-Shirts'
  | 'Polo T-Shirts'
  | 'Oversized T-Shirts'
  | 'Sports T-Shirts / Jerseys'
  | 'Hoodies & Sweatshirts'
  | 'Corporate Uniforms'
  | 'Custom Promotional T-Shirts';

export type FabricType =
  | '100% Super Combed Cotton'
  | 'Bio-Washed Cotton Single Jersey'
  | 'Cotton Pique Matty'
  | 'Dry-Fit Micro Polyester'
  | 'French Terry Cotton Fleece'
  | 'Poly-Cotton Blend (65/35)'
  | 'Modal Elastane Blend';

export type PrintingMethod =
  | 'Screen Printing (Plastisol/Discharge)'
  | 'DTG (Direct to Garment)'
  | 'DTF (Direct to Film) HD'
  | 'Sublimation All-Over Print'
  | 'Computerized Embroidery'
  | 'Rubber Puff / High-Density Print'
  | 'Heat Transfer Foil';

export type CustomizationPlacement =
  | 'Left Chest (Pocket Size)'
  | 'Full Front Graphic'
  | 'Back Shoulder Yoke'
  | 'Full Back Graphic'
  | 'Left Sleeve Logo'
  | 'Right Sleeve Logo'
  | 'Custom Inner Neck Tag';

export interface ApparelColor {
  name: string;
  hex: string;
  code: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  fabricType: FabricType;
  gsm: number;
  availableColours: ApparelColor[];
  availableSizes: string[]; // e.g. ['S', 'M', 'L', 'XL', '2XL', '3XL']
  minOrderQuantity: number;
  printingOptions: PrintingMethod[];
  embroiderySupported: boolean;
  baseEstimatedPrice: number; // reference unit price in INR (excl. tax & customization)
  turnaroundDays: number;
  svgType: 'round-neck' | 'polo' | 'oversized' | 'hoodie' | 'jersey';
  featured: boolean;
  active: boolean;
}

export interface SizeQuantityMatrix {
  [size: string]: number;
}

export interface ColorSizeItem {
  colorName: string;
  colorHex: string;
  sizes: SizeQuantityMatrix;
  totalForColor: number;
}

export interface UploadedArtwork {
  id: string;
  name: string;
  sizeKb: number;
  type: string;
  dataUrl?: string; // Data URL for preview
  placement: CustomizationPlacement;
}

export interface BulkOrderConfig {
  productId: string;
  productName: string;
  productCode: string;
  fabricType: FabricType;
  gsm: number;
  colorDistributions: ColorSizeItem[];
  customizationPlacements: CustomizationPlacement[];
  printingMethod: PrintingMethod;
  uploadedFiles: UploadedArtwork[];
  additionalNotes: string;
  totalQuantity: number;
}

export interface CustomerDetails {
  fullName: string;
  companyName?: string;
  mobileNumber: string;
  email: string;
  city: string;
  state: string;
  deliveryLocation: string;
  requiredDeliveryDate?: string;
}

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Requirement Clarification'
  | 'Quotation Pending'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Approved'
  | 'Rejected'
  | 'Converted to Order'
  | 'Closed';

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface InternalNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface Enquiry {
  id: string; // e.g. BTQ-2026-00001
  customer: CustomerDetails;
  config: BulkOrderConfig;
  totalQuantity: number;
  status: EnquiryStatus;
  assignedStaff?: string;
  internalNotes: InternalNote[];
  statusHistory: StatusHistoryEntry[];
  quotationId?: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationLineItem {
  id: string;
  description: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  customizationPricePerUnit: number;
  lineTotal: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Converted';

export interface Quotation {
  id: string; // QT-2026-00001
  quotationNumber: string;
  enquiryId: string;
  date: string;
  validUntil: string;
  customer: CustomerDetails;
  productSummary: {
    productName: string;
    productCode: string;
    fabric: string;
    colors: string[];
    totalQuantity: number;
  };
  lineItems: QuotationLineItem[];
  subtotal: number;
  printingAndSetupCharges: number;
  deliveryCharges: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number; // e.g. 18
  gstAmount: number;
  grandTotal: number;
  advancePercentage: number; // e.g. 50
  advancePayable: number;
  balancePayable: number;
  paymentTerms: string;
  termsAndConditions: string[];
  status: QuotationStatus;
  notes?: string;
  approvedAt?: string;
  convertedToOrderId?: string;
  createdAt: string;
}

export type OrderProductionStatus =
  | 'Order Confirmed'
  | 'Design Approval Pending'
  | 'Design Approved'
  | 'Production Pending'
  | 'In Production'
  | 'Quality Check'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface DispatchDetails {
  courierName: string;
  trackingNumber: string;
  dispatchDate: string;
  estimatedDeliveryDate: string;
  trackingUrl?: string;
}

export interface Order {
  id: string; // ORD-2026-00001
  enquiryId: string;
  quotationId: string;
  quotationNumber: string;
  customer: CustomerDetails;
  productDetails: {
    productName: string;
    productCode: string;
    fabric: string;
    colorDistributions: ColorSizeItem[];
    printingMethod: string;
    customizationPlacements: string[];
  };
  totalQuantity: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
  status: OrderProductionStatus;
  statusHistory: Array<{
    status: OrderProductionStatus;
    timestamp: string;
    note?: string;
  }>;
  dispatchDetails?: DispatchDetails;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  clientIndustry: string;
  productType: string;
  quantity: number;
  fabricSpec: string;
  printingType: string;
  imageTheme: string;
  accentColor: string;
  description: string;
}
