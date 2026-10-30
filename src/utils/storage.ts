import { Product, Enquiry, Quotation, Order, PortfolioItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ENQUIRIES, INITIAL_QUOTATIONS, INITIAL_ORDERS, INITIAL_PORTFOLIO } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'durozen_apparel_products_v1',
  ENQUIRIES: 'durozen_apparel_enquiries_v1',
  QUOTATIONS: 'durozen_apparel_quotations_v1',
  ORDERS: 'durozen_apparel_orders_v1',
  PORTFOLIO: 'durozen_apparel_portfolio_v1',
};

// Safe localStorage getters
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products', e);
  }
}

export function getStoredEnquiries(): Enquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    return raw ? JSON.parse(raw) : INITIAL_ENQUIRIES;
  } catch {
    return INITIAL_ENQUIRIES;
  }
}

export function saveEnquiries(enquiries: Enquiry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  } catch (e) {
    console.error('Failed to save enquiries', e);
  }
}

export function getStoredQuotations(): Quotation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return raw ? JSON.parse(raw) : INITIAL_QUOTATIONS;
  } catch {
    return INITIAL_QUOTATIONS;
  }
}

export function saveQuotations(quotes: Quotation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotes));
  } catch (e) {
    console.error('Failed to save quotations', e);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
}

export function getStoredPortfolio(): PortfolioItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    return raw ? JSON.parse(raw) : INITIAL_PORTFOLIO;
  } catch {
    return INITIAL_PORTFOLIO;
  }
}

// Sequence ID generators
export function generateEnquiryId(existing: Enquiry[]): string {
  const currentYear = new Date().getFullYear();
  const nextNum = existing.length + 1;
  const padded = String(nextNum).padStart(5, '0');
  return `BTQ-${currentYear}-${padded}`;
}

export function generateQuotationId(existing: Quotation[]): string {
  const currentYear = new Date().getFullYear();
  const nextNum = existing.length + 1;
  const padded = String(nextNum).padStart(5, '0');
  return `QT-${currentYear}-${padded}`;
}

export function generateOrderId(existing: Order[]): string {
  const currentYear = new Date().getFullYear();
  const nextNum = existing.length + 1;
  const padded = String(nextNum).padStart(5, '0');
  return `ORD-${currentYear}-${padded}`;
}
