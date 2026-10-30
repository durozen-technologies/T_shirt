import { Product, Enquiry, Quotation, Order, PortfolioItem } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-rn-180',
    code: 'DUR-RN-180',
    name: 'Classic Combed Cotton Crewneck',
    category: 'Round Neck T-Shirts',
    shortDescription: '180 GSM 100% Super Combed Cotton with bio-wash finish for superior handfeel and zero shrinkage.',
    description: 'Our most sought-after corporate and college tee. Crafted with 100% super combed cotton yarns with double-needle stitching on sleeves and hem. Pre-shrunk and silicone bio-washed for lasting softness and color fastness through 50+ industrial washes.',
    fabricType: '100% Super Combed Cotton',
    gsm: 180,
    availableColours: [
      { name: 'Jet Black', hex: '#111827', code: 'BLK-01' },
      { name: 'Midnight Navy', hex: '#1e293b', code: 'NAV-02' },
      { name: 'Pure White', hex: '#f8fafc', code: 'WHT-03' },
      { name: 'Heather Charcoal', hex: '#374151', code: 'GRY-04' },
      { name: 'Royal Blue', hex: '#2563eb', code: 'BLU-05' },
      { name: 'Crimson Red', hex: '#dc2626', code: 'RED-06' },
      { name: 'Forest Olive', hex: '#3f6212', code: 'OLV-07' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    minOrderQuantity: 50,
    printingOptions: [
      'Screen Printing (Plastisol/Discharge)',
      'DTG (Direct to Garment)',
      'DTF (Direct to Film) HD',
      'Rubber Puff / High-Density Print',
      'Computerized Embroidery'
    ],
    embroiderySupported: true,
    baseEstimatedPrice: 195,
    turnaroundDays: 6,
    svgType: 'round-neck',
    featured: true,
    active: true,
  },
  {
    id: 'prod-rn-220',
    code: 'DUR-RN-220',
    name: 'Heavyweight Luxe Bio-Washed Crewneck',
    category: 'Round Neck T-Shirts',
    shortDescription: '220 GSM heavyweight dense cotton jersey with substantial drape and thick 1.25" ribbed collar.',
    description: 'Engineered for premium executive merch and upscale apparel brands. Heavyweight 220 GSM construction provides a tailored silhouette that does not cling. Features bound collar neckband and reinforced twin needle stitching.',
    fabricType: 'Bio-Washed Cotton Single Jersey',
    gsm: 220,
    availableColours: [
      { name: 'Washed Black', hex: '#1f2937', code: 'WBK-01' },
      { name: 'Bone Off-White', hex: '#f1f5f9', code: 'BNE-02' },
      { name: 'Slate Blue', hex: '#334155', code: 'SBL-03' },
      { name: 'Earthy Sage', hex: '#4d7c0f', code: 'SGE-04' },
      { name: 'Vintage Burgundy', hex: '#881337', code: 'BUR-05' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    minOrderQuantity: 50,
    printingOptions: [
      'Screen Printing (Plastisol/Discharge)',
      'DTF (Direct to Film) HD',
      'Rubber Puff / High-Density Print',
      'Computerized Embroidery'
    ],
    embroiderySupported: true,
    baseEstimatedPrice: 245,
    turnaroundDays: 7,
    svgType: 'round-neck',
    featured: true,
    active: true,
  },
  {
    id: 'prod-pl-240',
    code: 'DUR-PL-240',
    name: 'Executive Cotton-Pique Polo',
    category: 'Polo T-Shirts',
    shortDescription: '240 GSM heavy cotton pique knit with reinforced flat-knit collar and mother-of-pearl finish buttons.',
    description: 'The standard of luxury corporate attire. Knitted with high-grade cotton pique matty structure providing natural breathability, crisp collar stiffness that refuses to curl, and ribbed sleeve cuffs. Includes side vents with herringbone tape reinforcement.',
    fabricType: 'Cotton Pique Matty',
    gsm: 240,
    availableColours: [
      { name: 'Executive Navy', hex: '#0f172a', code: 'ENAV-01' },
      { name: 'Crisp White', hex: '#f8fafc', code: 'EWHT-02' },
      { name: 'Charcoal Melange', hex: '#475569', code: 'EGRY-03' },
      { name: 'Deep Royal', hex: '#1d4ed8', code: 'EBLU-04' },
      { name: 'Maroon Wine', hex: '#7f1d1d', code: 'EMRN-05' },
      { name: 'Pitch Black', hex: '#020617', code: 'EBLK-06' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    minOrderQuantity: 50,
    printingOptions: [
      'Computerized Embroidery',
      'Screen Printing (Plastisol/Discharge)',
      'DTF (Direct to Film) HD',
      'Heat Transfer Foil'
    ],
    embroiderySupported: true,
    baseEstimatedPrice: 285,
    turnaroundDays: 7,
    svgType: 'polo',
    featured: true,
    active: true,
  },
  {
    id: 'prod-ov-240',
    code: 'DUR-OV-240',
    name: 'Urban Streetwear Boxy Oversized Tee',
    category: 'Oversized T-Shirts',
    shortDescription: '240 GSM relaxed drop-shoulder silhouette, tight crew collar, and modern streetwear boxy cut.',
    description: 'Purpose-built for college cultural fests, design studios, and youth brand merchandise. Drop-shoulder cut with elongated sleeves and a loose, relaxed boxy body. Finished with a thick 32-count elastane-infused rib collar that maintains shape.',
    fabricType: '100% Super Combed Cotton',
    gsm: 240,
    availableColours: [
      { name: 'Washed Charcoal', hex: '#27272a', code: 'WCH-01' },
      { name: 'Vintage Black', hex: '#18181b', code: 'VBK-02' },
      { name: 'Butter Off-White', hex: '#f4f4f5', code: 'BOW-03' },
      { name: 'Cocoa Brown', hex: '#451a03', code: 'COA-04' },
      { name: 'Dusty Sage', hex: '#3f6212', code: 'DSG-05' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    minOrderQuantity: 50,
    printingOptions: [
      'Screen Printing (Plastisol/Discharge)',
      'DTF (Direct to Film) HD',
      'Rubber Puff / High-Density Print'
    ],
    embroiderySupported: false,
    baseEstimatedPrice: 260,
    turnaroundDays: 6,
    svgType: 'oversized',
    featured: true,
    active: true,
  },
  {
    id: 'prod-sp-160',
    code: 'DUR-SP-160',
    name: 'Pro-Athlete Moisture-Wicking Sports Jersey',
    category: 'Sports T-Shirts / Jerseys',
    shortDescription: '160 GSM lightweight micro-polyester dry-fit honeycomb fabric with anti-odor and quick-dry tech.',
    description: 'Designed for company cricket tournaments, marathons, sports academies, and active events. Woven with micro-pores that wick perspiration away from skin instantly. Supports high-resolution all-over sublimation prints with vivid, fade-proof colors.',
    fabricType: 'Dry-Fit Micro Polyester',
    gsm: 160,
    availableColours: [
      { name: 'Cobalt Blue', hex: '#1e40af', code: 'SP-BLU' },
      { name: 'Neon Lime / Black', hex: '#65a30d', code: 'SP-LIME' },
      { name: 'Blaze Orange', hex: '#ea580c', code: 'SP-ORG' },
      { name: 'Stealth Black', hex: '#18181b', code: 'SP-BLK' },
      { name: 'Team Crimson', hex: '#b91c1c', code: 'SP-RED' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    minOrderQuantity: 50,
    printingOptions: [
      'Sublimation All-Over Print',
      'DTF (Direct to Film) HD',
      'Heat Transfer Foil',
      'Screen Printing (Plastisol/Discharge)'
    ],
    embroiderySupported: false,
    baseEstimatedPrice: 180,
    turnaroundDays: 5,
    svgType: 'jersey',
    featured: true,
    active: true,
  },
  {
    id: 'prod-hd-350',
    code: 'DUR-HD-350',
    name: 'Heavyweight Brushed French Terry Hoodie',
    category: 'Hoodies & Sweatshirts',
    shortDescription: '350 GSM premium cotton-poly fleece with brushed interior, double-lined hood, and metal grommets.',
    description: 'Winter corporate welcome kits and premium tech company jackets. Featuring heavyweight 350 GSM cotton-rich French terry with ultra-soft brushed fleece lining. Double layered hood, heavy gauge flat drawcord, and deep kangaroo pocket with bar-tack reinforcement.',
    fabricType: 'French Terry Cotton Fleece',
    gsm: 350,
    availableColours: [
      { name: 'Jet Black', hex: '#0f172a', code: 'HD-BLK' },
      { name: 'Heather Grey', hex: '#64748b', code: 'HD-GRY' },
      { name: 'Forest Green', hex: '#14532d', code: 'HD-GRN' },
      { name: 'Deep Navy', hex: '#1e1b4b', code: 'HD-NAV' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    minOrderQuantity: 40,
    printingOptions: [
      'Computerized Embroidery',
      'Screen Printing (Plastisol/Discharge)',
      'DTF (Direct to Film) HD',
      'Rubber Puff / High-Density Print'
    ],
    embroiderySupported: true,
    baseEstimatedPrice: 560,
    turnaroundDays: 8,
    svgType: 'hoodie',
    featured: true,
    active: true,
  },
  {
    id: 'prod-cp-200',
    code: 'DUR-CP-200',
    name: 'Industrial Heavy-Duty Uniform Polo',
    category: 'Corporate Uniforms',
    shortDescription: '200 GSM 65/35 poly-cotton blend resistant to fading, stains, and daily industrial washing.',
    description: 'Built specifically for frontline factory staff, logistics teams, retail employees, and service field technicians. High-tensile poly-cotton resists tearing, retains color luster under harsh UV and chemical laundry cycles, and requires minimal ironing.',
    fabricType: 'Poly-Cotton Blend (65/35)',
    gsm: 200,
    availableColours: [
      { name: 'Steel Grey', hex: '#475569', code: 'UF-GRY' },
      { name: 'Corporate Dark Navy', hex: '#0f172a', code: 'UF-NAV' },
      { name: 'Khaki Beige', hex: '#a8a29e', code: 'UF-KHK' },
      { name: 'Industrial Royal', hex: '#1d4ed8', code: 'UF-BLU' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    minOrderQuantity: 100,
    printingOptions: [
      'Computerized Embroidery',
      'Screen Printing (Plastisol/Discharge)',
      'DTF (Direct to Film) HD'
    ],
    embroiderySupported: true,
    baseEstimatedPrice: 220,
    turnaroundDays: 7,
    svgType: 'polo',
    featured: false,
    active: true,
  },
  {
    id: 'prod-pr-150',
    code: 'DUR-PR-150',
    name: 'Mass Event & Promotional Giveaway Tee',
    category: 'Custom Promotional T-Shirts',
    shortDescription: '150 GSM lightweight cotton with soft handfeel, optimized for mass campaigns, marathons, and fests.',
    description: 'High-volume cost-efficient apparel for nationwide product launches, election campaigns, charity marathons, and trade show visitor giveaways. Smooth surface provides razor-sharp screen printing reproduction at maximum throughput.',
    fabricType: '100% Super Combed Cotton',
    gsm: 150,
    availableColours: [
      { name: 'Pure White', hex: '#f8fafc', code: 'PR-WHT' },
      { name: 'Sunshine Yellow', hex: '#eab308', code: 'PR-YEL' },
      { name: 'Vibrant Orange', hex: '#f97316', code: 'PR-ORG' },
      { name: 'Bright Cyan', hex: '#06b6d4', code: 'PR-CYN' },
      { name: 'Jet Black', hex: '#18181b', code: 'PR-BLK' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    minOrderQuantity: 100,
    printingOptions: [
      'Screen Printing (Plastisol/Discharge)',
      'DTF (Direct to Film) HD'
    ],
    embroiderySupported: false,
    baseEstimatedPrice: 135,
    turnaroundDays: 5,
    svgType: 'round-neck',
    featured: false,
    active: true,
  }
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'CloudScale Global Tech Summit 2026',
    clientIndustry: 'Enterprise Software & Cloud',
    productType: 'Cotton Pique Polo T-Shirts',
    quantity: 2500,
    fabricSpec: '240 GSM Cotton Pique Matty',
    printingType: 'Precision Computerized Left Chest Embroidery',
    imageTheme: 'Executive Navy with Gold Metallic Threading',
    accentColor: '#1e293b',
    description: 'Supplied 2,500 premium pique polo t-shirts in bespoke Executive Navy for speaker staff, organizers, and VIP delegates across 3 global conference hubs.'
  },
  {
    id: 'port-2',
    title: 'Nexus IIT Annual Cultural Festival',
    clientIndustry: 'College & University Campus',
    productType: 'Urban Oversized Heavyweight Tees',
    quantity: 1800,
    fabricSpec: '240 GSM 100% Combed Cotton',
    printingType: 'Multi-Color Screen Print & High-Density Back Puff',
    imageTheme: 'Vintage Washed Black & Off-White',
    accentColor: '#18181b',
    description: 'Custom boxy streetwear cut merchandise for 1,800 college attendees featuring neon gradient screen prints with puff raised typography on the back shoulders.'
  },
  {
    id: 'port-3',
    title: 'Bengaluru Midnight 10K Marathon',
    clientIndustry: 'Sports & Athletics Foundation',
    productType: 'Moisture-Wicking Honeycomb Jerseys',
    quantity: 4200,
    fabricSpec: '160 GSM Micro-Poly Honeycomb Mesh',
    printingType: 'Full-Body Sublimation & Reflective Transfer',
    imageTheme: 'Electric Cobalt with Luminescent Accents',
    accentColor: '#2563eb',
    description: 'Engineered high-breathability race day jerseys for 4,200 runners with individual bib numbering transfers and 3M reflective safety badges on shoulder sleeves.'
  },
  {
    id: 'port-4',
    title: 'Apex Logistics Ground Crew Workwear',
    clientIndustry: 'Supply Chain & Warehousing',
    productType: 'Heavy-Duty Industrial Uniform Polos',
    quantity: 1200,
    fabricSpec: '200 GSM 65/35 Stain-Repel Poly-Cotton',
    printingType: 'Direct-to-Film Chest Logo + Sleeve Division Patch',
    imageTheme: 'Industrial Steel Grey with Amber Trim',
    accentColor: '#475569',
    description: 'Standardized fleet uniform polos for 1,200 warehouse and delivery associates with anti-fade vat dyeing and reinforced double stitching on stress points.'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'BTQ-2026-00001',
    customer: {
      fullName: 'Vikramaditya Sharma',
      companyName: 'Infosys FinTech Operations',
      mobileNumber: '+91 98451 88204',
      email: 'vikram.sharma@infosys.corp',
      city: 'Bengaluru',
      state: 'Karnataka',
      deliveryLocation: 'Electronic City Phase 1, Hosur Road, Bengaluru 560100',
      requiredDeliveryDate: '2026-11-20'
    },
    config: {
      productId: 'prod-pl-240',
      productName: 'Executive Cotton-Pique Polo',
      productCode: 'DUR-PL-240',
      fabricType: 'Cotton Pique Matty',
      gsm: 240,
      colorDistributions: [
        {
          colorName: 'Executive Navy',
          colorHex: '#0f172a',
          sizes: { S: 25, M: 60, L: 85, XL: 40, '2XL': 15, '3XL': 5 },
          totalForColor: 230
        },
        {
          colorName: 'Crisp White',
          colorHex: '#f8fafc',
          sizes: { S: 15, M: 40, L: 50, XL: 25, '2XL': 10, '3XL': 0 },
          totalForColor: 140
        }
      ],
      customizationPlacements: ['Left Chest (Pocket Size)', 'Right Sleeve Logo'],
      printingMethod: 'Computerized Embroidery',
      uploadedFiles: [
        {
          id: 'file-1',
          name: 'Infosys_Fintech_Vector_Logo.svg',
          sizeKb: 340,
          type: 'image/svg+xml',
          placement: 'Left Chest (Pocket Size)'
        }
      ],
      additionalNotes: 'Require premium metallic silver embroidery thread for the logo emblem. Please pack in individual eco-polybags with size stickers.',
      totalQuantity: 370
    },
    totalQuantity: 370,
    status: 'Quotation Sent',
    assignedStaff: 'Ramesh Sundaram (Enterprise Sales Lead)',
    internalNotes: [
      {
        id: 'note-1',
        author: 'Ramesh S.',
        timestamp: '2026-10-28 14:30',
        text: 'Client requested rush delivery before Nov 20. Confirmed factory slot on Carousel 2. Embroidery digitizing punch is ready.'
      }
    ],
    statusHistory: [
      {
        status: 'New',
        timestamp: '2026-10-27 10:15',
        updatedBy: 'System Auto-Capture',
        note: 'Submitted via Web Bulk Builder'
      },
      {
        status: 'Contacted',
        timestamp: '2026-10-27 11:30',
        updatedBy: 'Ramesh Sundaram',
        note: 'Spoke with Procurement Manager Vikram; verified size ratio and dispatch pin code.'
      },
      {
        status: 'Quotation Sent',
        timestamp: '2026-10-28 15:45',
        updatedBy: 'Ramesh Sundaram',
        note: 'Official Quotation QT-2026-00001 generated and emailed.'
      }
    ],
    quotationId: 'QT-2026-00001',
    createdAt: '2026-10-27T10:15:00.000Z',
    updatedAt: '2026-10-28T15:45:00.000Z'
  },
  {
    id: 'BTQ-2026-00002',
    customer: {
      fullName: 'Dr. Ananya Sen',
      companyName: 'IIT Bombay Techfest Committee',
      mobileNumber: '+91 97204 11893',
      email: 'organizers@techfest-iitb.org',
      city: 'Mumbai',
      state: 'Maharashtra',
      deliveryLocation: 'Student Activity Centre, IIT Bombay, Powai, Mumbai 400076',
      requiredDeliveryDate: '2026-11-28'
    },
    config: {
      productId: 'prod-ov-240',
      productName: 'Urban Streetwear Boxy Oversized Tee',
      productCode: 'DUR-OV-240',
      fabricType: '100% Super Combed Cotton',
      gsm: 240,
      colorDistributions: [
        {
          colorName: 'Vintage Black',
          colorHex: '#18181b',
          sizes: { S: 50, M: 200, L: 250, XL: 120, '2XL': 30 },
          totalForColor: 650
        }
      ],
      customizationPlacements: ['Full Back Graphic', 'Left Chest (Pocket Size)'],
      printingMethod: 'Rubber Puff / High-Density Print',
      uploadedFiles: [
        {
          id: 'file-2',
          name: 'Techfest_2026_Cyber_BackGraphic.ai',
          sizeKb: 1420,
          type: 'application/pdf',
          placement: 'Full Back Graphic'
        }
      ],
      additionalNotes: 'High-density 3D rubber puff for back typography. Needs to withstand vigorous college wash tests.',
      totalQuantity: 650
    },
    totalQuantity: 650,
    status: 'Approved',
    assignedStaff: 'Kavita Menon (College Merch Lead)',
    internalNotes: [
      {
        id: 'note-2',
        author: 'Kavita Menon',
        timestamp: '2026-10-29 09:20',
        text: 'Sample swatch approved by Techfest Convenor. Advance PO received.'
      }
    ],
    statusHistory: [
      {
        status: 'New',
        timestamp: '2026-10-25 16:40',
        updatedBy: 'System Auto-Capture'
      },
      {
        status: 'Quotation Sent',
        timestamp: '2026-10-26 11:00',
        updatedBy: 'Kavita Menon'
      },
      {
        status: 'Approved',
        timestamp: '2026-10-29 09:15',
        updatedBy: 'Dr. Ananya Sen',
        note: 'Customer approved quotation online via portal link.'
      }
    ],
    quotationId: 'QT-2026-00002',
    createdAt: '2026-10-25T16:40:00.000Z',
    updatedAt: '2026-10-29T09:20:00.000Z'
  },
  {
    id: 'BTQ-2026-00003',
    customer: {
      fullName: 'Siddharth Rao',
      companyName: 'Hyderabad Runners Club',
      mobileNumber: '+91 99881 23450',
      email: 'siddharth@hyderabadrunners.in',
      city: 'Hyderabad',
      state: 'Telangana',
      deliveryLocation: 'Gachibowli Stadium Complex, Hyderabad 500032',
      requiredDeliveryDate: '2026-12-05'
    },
    config: {
      productId: 'prod-sp-160',
      productName: 'Pro-Athlete Moisture-Wicking Sports Jersey',
      productCode: 'DUR-SP-160',
      fabricType: 'Dry-Fit Micro Polyester',
      gsm: 160,
      colorDistributions: [
        {
          colorName: 'Cobalt Blue',
          colorHex: '#1e40af',
          sizes: { S: 100, M: 350, L: 400, XL: 200, '2XL': 50, '3XL': 0 },
          totalForColor: 1100
        }
      ],
      customizationPlacements: ['Full Front Graphic', 'Back Shoulder Yoke'],
      printingMethod: 'Sublimation All-Over Print',
      uploadedFiles: [
        {
          id: 'file-3',
          name: 'Hyderabad_HalfMarathon_Sponsors.pdf',
          sizeKb: 2150,
          type: 'application/pdf',
          placement: 'Full Front Graphic'
        }
      ],
      additionalNotes: 'Sublimation across chest with 8 corporate sponsor logos cleanly integrated.',
      totalQuantity: 1100
    },
    totalQuantity: 1100,
    status: 'New',
    internalNotes: [],
    statusHistory: [
      {
        status: 'New',
        timestamp: '2026-10-29 20:10',
        updatedBy: 'System Auto-Capture'
      }
    ],
    createdAt: '2026-10-29T20:10:00.000Z',
    updatedAt: '2026-10-29T20:10:00.000Z'
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'QT-2026-00001',
    quotationNumber: 'QT-2026-00001',
    enquiryId: 'BTQ-2026-00001',
    date: '2026-10-28',
    validUntil: '2026-11-12',
    customer: {
      fullName: 'Vikramaditya Sharma',
      companyName: 'Infosys FinTech Operations',
      mobileNumber: '+91 98451 88204',
      email: 'vikram.sharma@infosys.corp',
      city: 'Bengaluru',
      state: 'Karnataka',
      deliveryLocation: 'Electronic City Phase 1, Hosur Road, Bengaluru 560100'
    },
    productSummary: {
      productName: 'Executive Cotton-Pique Polo',
      productCode: 'DUR-PL-240',
      fabric: '240 GSM Cotton Pique Matty',
      colors: ['Executive Navy (230 pcs)', 'Crisp White (140 pcs)'],
      totalQuantity: 370
    },
    lineItems: [
      {
        id: 'li-1',
        description: 'DUR-PL-240 Executive Pique Polo Shirt (240 GSM)',
        specifications: 'Cotton Pique Matty, Pre-shrunk, Flat-knit collar & cuffs, Custom Buttons',
        quantity: 370,
        unitPrice: 285,
        customizationPricePerUnit: 45,
        lineTotal: 122100
      }
    ],
    subtotal: 122100,
    printingAndSetupCharges: 3500, // Punching & Embroidery setup fee
    deliveryCharges: 2400,
    discountAmount: 4000,
    taxableAmount: 124000,
    gstRate: 18,
    gstAmount: 22320,
    grandTotal: 146320,
    advancePercentage: 50,
    advancePayable: 73160,
    balancePayable: 73160,
    paymentTerms: '50% Advance with Purchase Order; 50% Balance upon Quality Inspection prior to Dispatch.',
    termsAndConditions: [
      'Quotation prices are valid for 15 days from issuance date.',
      'Production turnaround: 7 working days from artwork confirmation & advance receipt.',
      'Garment tolerances: ±5% on overall quantity and ±0.5 inch dimensional variance per industry norms.',
      'Customized goods cannot be returned or cancelled once fabric cutting commences.'
    ],
    status: 'Sent',
    createdAt: '2026-10-28T15:45:00.000Z'
  },
  {
    id: 'QT-2026-00002',
    quotationNumber: 'QT-2026-00002',
    enquiryId: 'BTQ-2026-00002',
    date: '2026-10-26',
    validUntil: '2026-11-10',
    customer: {
      fullName: 'Dr. Ananya Sen',
      companyName: 'IIT Bombay Techfest Committee',
      mobileNumber: '+91 97204 11893',
      email: 'organizers@techfest-iitb.org',
      city: 'Mumbai',
      state: 'Maharashtra',
      deliveryLocation: 'Student Activity Centre, IIT Bombay, Powai, Mumbai 400076'
    },
    productSummary: {
      productName: 'Urban Streetwear Boxy Oversized Tee',
      productCode: 'DUR-OV-240',
      fabric: '240 GSM 100% Super Combed Cotton',
      colors: ['Vintage Black (650 pcs)'],
      totalQuantity: 650
    },
    lineItems: [
      {
        id: 'li-2',
        description: 'DUR-OV-240 Boxy Oversized Streetwear T-Shirt',
        specifications: '240 GSM 100% Cotton, Drop shoulder, 3D Rubber Puff typography on Back',
        quantity: 650,
        unitPrice: 260,
        customizationPricePerUnit: 55,
        lineTotal: 204750
      }
    ],
    subtotal: 204750,
    printingAndSetupCharges: 4500,
    deliveryCharges: 3800,
    discountAmount: 7050,
    taxableAmount: 206000,
    gstRate: 18,
    gstAmount: 37080,
    grandTotal: 243080,
    advancePercentage: 50,
    advancePayable: 121540,
    balancePayable: 121540,
    paymentTerms: '50% Advance by Bank NEFT/RTGS; Balance against dispatch bill of lading.',
    termsAndConditions: [
      'Quotation prices are valid for 15 days from issuance date.',
      'Production turnaround: 6-7 working days following screen/puff sample sign-off.',
      'Tolerance: ±3% industry standard.'
    ],
    status: 'Approved',
    approvedAt: '2026-10-29T09:15:00.000Z',
    createdAt: '2026-10-26T11:00:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-00001',
    enquiryId: 'BTQ-2026-00002',
    quotationId: 'QT-2026-00002',
    quotationNumber: 'QT-2026-00002',
    customer: {
      fullName: 'Dr. Ananya Sen',
      companyName: 'IIT Bombay Techfest Committee',
      mobileNumber: '+91 97204 11893',
      email: 'organizers@techfest-iitb.org',
      city: 'Mumbai',
      state: 'Maharashtra',
      deliveryLocation: 'Student Activity Centre, IIT Bombay, Powai, Mumbai 400076'
    },
    productDetails: {
      productName: 'Urban Streetwear Boxy Oversized Tee',
      productCode: 'DUR-OV-240',
      fabric: '240 GSM 100% Super Combed Cotton',
      colorDistributions: [
        {
          colorName: 'Vintage Black',
          colorHex: '#18181b',
          sizes: { S: 50, M: 200, L: 250, XL: 120, '2XL': 30 },
          totalForColor: 650
        }
      ],
      printingMethod: 'Rubber Puff / High-Density Print',
      customizationPlacements: ['Full Back Graphic', 'Left Chest (Pocket Size)']
    },
    totalQuantity: 650,
    grandTotal: 243080,
    advancePaid: 121540,
    balanceDue: 121540,
    status: 'In Production',
    statusHistory: [
      {
        status: 'Order Confirmed',
        timestamp: '2026-10-29 10:00',
        note: 'Advance payment of ₹1,21,540 verified via HDFC Corporate NEFT.'
      },
      {
        status: 'Design Approved',
        timestamp: '2026-10-29 12:30',
        note: 'Puff silicone formula calibrated and approved by customer.'
      },
      {
        status: 'Production Pending',
        timestamp: '2026-10-29 14:00',
        note: 'Fabric rolled to automatic cutting table.'
      },
      {
        status: 'In Production',
        timestamp: '2026-10-29 17:00',
        note: 'Screen printing Carousel #3 running batch 1 of 650 garments.'
      }
    ],
    createdAt: '2026-10-29T10:00:00.000Z',
    updatedAt: '2026-10-29T17:00:00.000Z'
  },
  {
    id: 'ORD-2026-00000',
    enquiryId: 'BTQ-2026-00000',
    quotationId: 'QT-2026-00000',
    quotationNumber: 'QT-2026-00000',
    customer: {
      fullName: 'Rajesh Gopinath',
      companyName: 'Titan Corporate Gifting',
      mobileNumber: '+91 98402 77119',
      email: 'rajesh.g@titan.co.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      deliveryLocation: 'Titan Corporate Park, Hosur Industrial Zone 635126'
    },
    productDetails: {
      productName: 'Classic Combed Cotton Crewneck',
      productCode: 'DUR-RN-180',
      fabric: '180 GSM 100% Super Combed Cotton',
      colorDistributions: [
        {
          colorName: 'Midnight Navy',
          colorHex: '#1e293b',
          sizes: { S: 50, M: 100, L: 150, XL: 75, '2XL': 25 },
          totalForColor: 400
        }
      ],
      printingMethod: 'Computerized Embroidery',
      customizationPlacements: ['Left Chest (Pocket Size)']
    },
    totalQuantity: 400,
    grandTotal: 102400,
    advancePaid: 102400,
    balanceDue: 0,
    status: 'Dispatched',
    statusHistory: [
      {
        status: 'Order Confirmed',
        timestamp: '2026-10-20 11:00',
        note: '100% advance cleared.'
      },
      {
        status: 'Design Approved',
        timestamp: '2026-10-21 09:30',
        note: 'Embroidered crest approved.'
      },
      {
        status: 'In Production',
        timestamp: '2026-10-22 14:00'
      },
      {
        status: 'Quality Check',
        timestamp: '2026-10-25 16:00',
        note: '100% needle-detection and dimensional checks passed.'
      },
      {
        status: 'Ready for Dispatch',
        timestamp: '2026-10-26 10:00'
      },
      {
        status: 'Dispatched',
        timestamp: '2026-10-27 15:30',
        note: 'Handed over to Blue Dart Express cargo.'
      }
    ],
    dispatchDetails: {
      courierName: 'Blue Dart Surface Cargo',
      trackingNumber: 'BLUEDART-847291034',
      dispatchDate: '2026-10-27',
      estimatedDeliveryDate: '2026-10-31',
      trackingUrl: 'https://www.bluedart.com'
    },
    createdAt: '2026-10-20T11:00:00.000Z',
    updatedAt: '2026-10-27T15:30:00.000Z'
  }
];
