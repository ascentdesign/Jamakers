import { randomUUID } from "crypto";
import {
  type User,
  type UpsertUser,
  type Manufacturer,
  type InsertManufacturer,
  type Brand,
  type InsertBrand,
  type Project,
  type InsertProject,
  type Rfq,
  type InsertRfq,
  type RfqResponse,
  type InsertRfqResponse,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type Certification,
  type InsertCertification,
  type PortfolioItem,
  type InsertPortfolioItem,
  type VerificationRequest,
  type InsertVerificationRequest,
  type FinancingLead,
  type InsertFinancingLead,
  type Resource,
  type InsertResource,
  type Notification,
  type InsertNotification,
  type Course,
  type CourseModule,
  type CourseLesson,
  type UserCourseEnrollment,
  type UserLessonProgress,
  type RawMaterial,
  type InsertRawMaterial,
  type RawMaterialSupplier,
  type InsertRawMaterialSupplier,
  type ProjectMaterial,
  type InsertProjectMaterial,
  type FinancialInstitution,
  type InsertFinancialInstitution,
  type LoanProduct,
  type InsertLoanProduct,
  type LoanApplication,
  type InsertLoanApplication,
} from "@shared/schema";

// Minimal in-memory storage for local development
// NOTE: This is not intended for production use.
export class MemoryStorage {
  private users: User[] = [];
  private manufacturers: Manufacturer[] = [];
  private brands: Brand[] = [];
  private projects: Project[] = [];
  private rfqs: Rfq[] = [];
  private rfqResponses: RfqResponse[] = [];
  private messages: Message[] = [];
  private reviews: Review[] = [];
  private certifications: Certification[] = [];
  private portfolioItems: PortfolioItem[] = [];
  private verificationRequests: VerificationRequest[] = [];
  private financingLeads: FinancingLead[] = [];
  private resources: Resource[] = [];
  private notifications: Notification[] = [];
  private courses: Course[] = [];
  private courseModules: CourseModule[] = [];
  private courseLessons: CourseLesson[] = [];
  private enrollments: UserCourseEnrollment[] = [];
  private lessonProgress: UserLessonProgress[] = [];
  private rawMaterials: RawMaterial[] = [];
  private rawMaterialSuppliers: RawMaterialSupplier[] = [];
  private projectMaterials: ProjectMaterial[] = [];
  private financialInstitutions: FinancialInstitution[] = [];
  private loanProducts: LoanProduct[] = [];
  private loanApplications: LoanApplication[] = [];

  constructor() {
    this.seedDemoData();
  }

  // Helpers
  private now() { return new Date(); }
  
  private seedDemoData() {
    const now = this.now();
    
    // Seed demo manufacturers
    this.manufacturers = [
      {
        id: randomUUID(),
        userId: 'demo-user-1',
        businessName: 'Caribbean Food Packers Ltd',
        description: 'Leading food processing and packaging facility specializing in sauces, condiments, and beverages. HACCP certified with 20+ years of experience.',
        industry: 'Food & Beverage',
        location: 'Kingston, Jamaica',
        phone: '+1 876-555-0101',
        email: 'info@caribbeanfoodpackers.com',
        website: 'https://caribbeanfoodpackers.com',
        capabilities: ['Bottling', 'Private Label', 'Co-packing', 'Quality Testing'],
        certifications: ['HACCP', 'GMP', 'ISO 9001'],
        minimumOrder: 5000,
        productionCapacity: 50000,
        leadTime: '4-6 weeks',
        verificationStatus: 'verified',
        verified: true,
        averageRating: 4.8,
        totalReviews: 24,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-user-2',
        businessName: 'Island Textiles Manufacturing',
        description: 'Full-service textile manufacturer offering cut & sew, screen printing, and embroidery services. Specializing in custom apparel and home textiles.',
        industry: 'Textiles',
        location: 'Montego Bay, Jamaica',
        phone: '+1 876-555-0202',
        email: 'orders@islandtextiles.com',
        website: 'https://islandtextiles.com',
        capabilities: ['Cut & Sew', 'Screen Printing', 'Embroidery', 'Pattern Making'],
        certifications: ['WRAP', 'OEKO-TEX'],
        minimumOrder: 500,
        productionCapacity: 10000,
        leadTime: '3-4 weeks',
        verificationStatus: 'verified',
        verified: true,
        averageRating: 4.6,
        totalReviews: 18,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-user-3',
        businessName: 'Tropical Beauty Labs',
        description: 'Natural skincare and cosmetics manufacturing facility. We specialize in formulation, filling, and packaging of personal care products using local ingredients.',
        industry: 'Personal Care',
        location: 'Ocho Rios, Jamaica',
        phone: '+1 876-555-0303',
        email: 'lab@tropicalbeauty.com',
        website: 'https://tropicalbeautylabs.com',
        capabilities: ['Formulation', 'Filling', 'Labeling', 'Private Label'],
        certifications: ['GMP', 'ISO 22716'],
        minimumOrder: 1000,
        productionCapacity: 25000,
        leadTime: '6-8 weeks',
        verificationStatus: 'verified',
        verified: true,
        averageRating: 4.9,
        totalReviews: 31,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-user-4',
        businessName: 'Jamaica Furniture Works',
        description: 'Custom furniture manufacturer specializing in hardwood pieces. Expert woodworking, metal fabrication, and upholstery services available.',
        industry: 'Furniture & Home',
        location: 'Spanish Town, Jamaica',
        phone: '+1 876-555-0404',
        email: 'shop@jafurnitureworks.com',
        website: 'https://jamaicafurnitureworks.com',
        capabilities: ['Woodworking', 'Metal Fabrication', 'Upholstery', 'Custom Design'],
        certifications: ['FSC', 'ISO 9001'],
        minimumOrder: 50,
        productionCapacity: 500,
        leadTime: '8-12 weeks',
        verificationStatus: 'verified',
        verified: true,
        averageRating: 4.7,
        totalReviews: 15,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-user-5',
        businessName: 'Precision Metal Works Jamaica',
        description: 'Industrial metal fabrication and machining services. Specializing in custom metal parts, welding, and assembly for various industries.',
        industry: 'Industrial',
        location: 'Portmore, Jamaica',
        phone: '+1 876-555-0505',
        email: 'sales@precisionmetalworks.com',
        website: 'https://precisionmetalworks.com',
        capabilities: ['Metal Fabrication', 'CNC Machining', 'Welding', 'Assembly'],
        certifications: ['ISO 9001', 'AWS'],
        minimumOrder: 100,
        productionCapacity: 5000,
        leadTime: '4-6 weeks',
        verificationStatus: 'verified',
        verified: true,
        averageRating: 4.5,
        totalReviews: 12,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-user-6',
        businessName: 'Caribbean Spice Company',
        description: 'Spice blending and packaging facility. We create custom spice blends and seasonings for retail and food service industries.',
        industry: 'Food & Beverage',
        location: 'May Pen, Jamaica',
        phone: '+1 876-555-0606',
        email: 'info@caribbeanspice.com',
        website: 'https://caribbeanspicecompany.com',
        capabilities: ['Blending', 'Packaging', 'Private Label', 'Recipe Development'],
        certifications: ['HACCP', 'GMP', 'Organic'],
        minimumOrder: 2000,
        productionCapacity: 30000,
        leadTime: '3-4 weeks',
        verificationStatus: 'verified',
        verified: true,
        averageRating: 4.8,
        totalReviews: 22,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo brands
    const demoBrandId1 = randomUUID();
    const demoBrandId2 = randomUUID();
    const demoBrandId3 = randomUUID();
    const demoBrandId4 = randomUUID();
    const demoBrandId5 = randomUUID();
    
    this.brands = [
      {
        id: demoBrandId1,
        userId: 'demo-brand-user-1',
        companyName: 'Island Flavor Foods',
        description: 'Caribbean food brand specializing in authentic Jamaican hot sauces and condiments. We are looking to scale production with local manufacturing partners.',
        logoUrl: null,
        industry: 'Food & Beverage',
        productCategories: ['Hot Sauces', 'Condiments', 'Caribbean Foods'],
        companySize: '11-50',
        annualVolume: '$100K-$1M',
        preferredLocations: ['Kingston', 'Montego Bay'],
        website: 'https://islandflavorfoods.com',
        phone: '+1 876-555-9900',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: demoBrandId2,
        userId: 'demo-brand-user-2',
        companyName: 'Caribbean Natural Beauty',
        description: 'Natural skincare and beauty brand creating products with organic Caribbean ingredients. Committed to sustainable and ethical sourcing.',
        logoUrl: null,
        industry: 'Personal Care',
        productCategories: ['Skincare', 'Haircare', 'Natural Beauty'],
        companySize: '1-10',
        annualVolume: '< $100K',
        preferredLocations: ['Ocho Rios', 'Kingston'],
        website: 'https://caribbeannaturalbeauty.com',
        phone: '+1 876-555-9901',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: demoBrandId3,
        userId: 'demo-brand-user-3',
        companyName: 'Tropical Threads',
        description: 'Contemporary Caribbean fashion brand offering resort wear and casual apparel with island-inspired designs.',
        logoUrl: null,
        industry: 'Fashion & Apparel',
        productCategories: ['Resort Wear', 'Casual Apparel', 'Accessories'],
        companySize: '11-50',
        annualVolume: '$1M-$5M',
        preferredLocations: ['Montego Bay', 'Kingston'],
        website: 'https://tropicalthreads.com',
        phone: '+1 876-555-9902',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: demoBrandId4,
        userId: 'demo-brand-user-4',
        companyName: 'Blue Mountain Coffee Co.',
        description: 'Premium coffee roaster and distributor of authentic Jamaican Blue Mountain coffee. Seeking packaging and distribution partners.',
        logoUrl: null,
        industry: 'Food & Beverage',
        productCategories: ['Coffee', 'Beverages', 'Specialty Foods'],
        companySize: '51-200',
        annualVolume: '$5M-$10M',
        preferredLocations: ['Kingston', 'Spanish Town'],
        website: 'https://bluemountaincoffeeco.com',
        phone: '+1 876-555-9903',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: demoBrandId5,
        userId: 'demo-brand-user-5',
        companyName: 'Island Essentials',
        description: 'Home goods and lifestyle brand featuring Caribbean-inspired furniture and decor. Looking for local manufacturing to reduce costs and lead times.',
        logoUrl: null,
        industry: 'Home & Living',
        productCategories: ['Furniture', 'Home Decor', 'Lifestyle Products'],
        companySize: '11-50',
        annualVolume: '$500K-$1M',
        preferredLocations: ['Spanish Town', 'Portmore'],
        website: 'https://islandessentials.com',
        phone: '+1 876-555-9904',
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo RFQs
    this.rfqs = [
      {
        id: randomUUID(),
        brandId: demoBrandId1,
        title: 'Jamaican Scotch Bonnet Hot Pepper Sauce Production - 10,000 bottles',
        description: 'We are seeking a HACCP-certified manufacturer for our premium Jamaican hot pepper sauce line. The sauce features locally-sourced scotch bonnet peppers, vinegar, garlic, and spices. We need bottling, labeling, and packaging services for our retail line.\n\nKey Requirements:\n- HACCP and GMP certification required\n- Experience with hot sauce or condiment production\n- Ability to handle 10,000 bottles per batch\n- 5oz glass bottle filling and capping\n- Private label services\n- Quality control and testing\n- Storage capabilities for finished goods\n\nWe are looking for a long-term manufacturing partner who can scale with our business as we expand distribution across the Caribbean and North America.',
        category: 'Food & Beverage',
        budget: '25000',
        currency: 'USD',
        quantity: 10000,
        timeline: '3 months',
        requirements: {
          certifications: ['HACCP', 'GMP', 'ISO 9001'],
          packaging: '5oz glass bottles with tamper-evident caps, custom labels',
          labeling: 'Full-color wraparound labels with nutrition facts and ingredient list',
        },
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        brandId: demoBrandId2,
        title: 'Organic Coconut Body Butter Production - 5,000 units',
        description: 'Caribbean Natural Beauty is seeking a GMP-certified facility to produce our signature organic coconut body butter. The product uses locally-sourced coconut oil, shea butter, and essential oils.\n\nProject Details:\n- Small batch production required\n- Natural and organic ingredients only\n- 8oz glass jars with aluminum lids\n- Custom label application\n- Quality testing for each batch\n- Storage in climate-controlled facility\n\nWe value sustainability and prefer manufacturers who share our commitment to environmental responsibility and ethical sourcing.',
        category: 'Personal Care',
        budget: '18000',
        currency: 'USD',
        quantity: 5000,
        timeline: '2 months',
        requirements: {
          certifications: ['GMP', 'Organic', 'ISO 22716'],
          packaging: '8oz glass jars with aluminum lids, custom labels',
          labeling: 'Eco-friendly labels with ingredient list and usage instructions',
        },
        status: 'active',
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        brandId: demoBrandId3,
        title: 'Custom Resort Wear T-Shirts - 2,000 units',
        description: 'Tropical Threads is looking for a textile manufacturer to produce our new line of premium resort wear t-shirts. We need cut & sew services with high-quality screen printing.\n\nSpecifications:\n- 100% cotton fabric (we can provide or source locally)\n- Custom screen printing with 3-4 colors\n- Multiple sizes: XS, S, M, L, XL, XXL\n- Hang tags and custom packaging\n- Quality control inspection before shipping\n\nLooking for manufacturers with experience in fashion and apparel production who can deliver consistent quality across the full size run.',
        category: 'Textiles',
        budget: '12000',
        currency: 'USD',
        quantity: 2000,
        timeline: '6 weeks',
        requirements: {
          certifications: ['WRAP', 'OEKO-TEX'],
          packaging: 'Individual polybags with custom hang tags',
          labeling: 'Care labels and branded tags sewn into garments',
        },
        status: 'active',
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        brandId: demoBrandId4,
        title: 'Coffee Packaging and Distribution Services - Ongoing Contract',
        description: 'Blue Mountain Coffee Co. seeks a manufacturing and distribution partner for our premium roasted coffee line. We need reliable packaging services and potentially co-packing for our retail products.\n\nServices Required:\n- Automated coffee bag filling and sealing\n- Nitrogen flushing for freshness\n- One-way valve bag sealing\n- Custom label application\n- Lot coding and date stamping\n- Warehousing and distribution capabilities\n\nThis is an ongoing partnership opportunity with potential for long-term contract. Starting with a test run of 5,000 bags, scaling to 20,000+ bags monthly.',
        category: 'Food & Beverage',
        budget: '35000',
        currency: 'USD',
        quantity: 5000,
        timeline: '4-6 weeks initial run',
        requirements: {
          certifications: ['HACCP', 'GMP', 'ISO 9001'],
          packaging: '12oz coffee bags with one-way valves, nitrogen flush',
          labeling: 'Full-color labels with roast date and origin information',
        },
        status: 'active',
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        brandId: demoBrandId5,
        title: 'Handcrafted Wooden Serving Trays - 500 units',
        description: 'Island Essentials is seeking a skilled furniture maker to produce handcrafted wooden serving trays for our home goods collection. These will be premium products featuring Caribbean hardwoods.\n\nProduct Requirements:\n- Made from local hardwoods (mahogany, cedar, or similar)\n- Hand-finished with food-safe oil\n- Dimensions: 18" x 12" x 2"\n- Rounded edges and smooth finish\n- Rope handles or cut-out handles\n- Each piece unique with natural wood grain\n- Gift-ready packaging\n\nWe are looking for a craftsperson or small workshop that can deliver quality handmade products with attention to detail.',
        category: 'Furniture & Home',
        budget: '15000',
        currency: 'USD',
        quantity: 500,
        timeline: '8-10 weeks',
        requirements: {
          certifications: ['FSC'],
          packaging: 'Individual boxes with tissue paper and branded insert',
          labeling: 'Branded stamp or laser engraving on underside',
        },
        status: 'active',
        expiresAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo raw materials
    const scotchBonnetId = randomUUID();
    const glassBottleId = randomUUID();
    const vinegarId = randomUUID();
    const garlicId = randomUUID();
    const spiceMixId = randomUUID();
    const labelStockId = randomUUID();
    const cottonFabricId = randomUUID();
    const sheaButterB = randomUUID();
    
    this.rawMaterials = [
      {
        id: scotchBonnetId,
        name: 'Scotch Bonnet Peppers (Fresh)',
        description: 'Premium locally-grown Jamaican scotch bonnet peppers. Known for their intense heat and fruity flavor, perfect for authentic Caribbean hot sauces.',
        category: 'Produce',
        unitOfMeasure: 'kg',
        specifications: 'Grade A, 100,000-350,000 SHU, fresh harvest, organic available',
        imageUrl: null,
        minimumOrderQuantity: 50,
        averagePrice: 1200, // $12.00 per kg in cents
        currency: 'USD',
        supplierCount: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: glassBottleId,
        name: '5oz Glass Bottles with Caps',
        description: 'Clear glass bottles ideal for hot sauce packaging. Includes tamper-evident caps and neck suitable for standard labeling.',
        category: 'Packaging',
        unitOfMeasure: 'units',
        specifications: '5 fl oz (148ml) capacity, 28mm neck finish, food-grade glass, autoclavable',
        imageUrl: null,
        minimumOrderQuantity: 1000,
        averagePrice: 45, // $0.45 per unit
        currency: 'USD',
        supplierCount: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: vinegarId,
        name: 'White Distilled Vinegar (Food Grade)',
        description: 'Food-grade white distilled vinegar, commonly used as a base for hot sauces and condiments. 5% acidity.',
        category: 'Ingredients',
        unitOfMeasure: 'liters',
        specifications: '5% acidity, food grade, bulk available',
        imageUrl: null,
        minimumOrderQuantity: 100,
        averagePrice: 180, // $1.80 per liter
        currency: 'USD',
        supplierCount: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: garlicId,
        name: 'Fresh Garlic (Peeled)',
        description: 'Locally-sourced fresh garlic, peeled and ready for processing. Essential ingredient for Jamaican hot sauce recipes.',
        category: 'Produce',
        unitOfMeasure: 'kg',
        specifications: 'Fresh, peeled, Grade A',
        imageUrl: null,
        minimumOrderQuantity: 25,
        averagePrice: 650, // $6.50 per kg
        currency: 'USD',
        supplierCount: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: spiceMixId,
        name: 'Caribbean Spice Blend',
        description: 'Authentic Caribbean spice blend including allspice, thyme, ginger, and other traditional seasonings.',
        category: 'Spices',
        unitOfMeasure: 'kg',
        specifications: 'Proprietary blend, food grade, custom blends available',
        imageUrl: null,
        minimumOrderQuantity: 10,
        averagePrice: 2500, // $25.00 per kg
        currency: 'USD',
        supplierCount: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: labelStockId,
        name: 'Waterproof Label Stock (Roll)',
        description: 'High-quality waterproof label material suitable for full-color printing. Perfect for product labeling on bottles.',
        category: 'Packaging',
        unitOfMeasure: 'meters',
        specifications: 'Waterproof, oil-resistant, suitable for inkjet/laser printing, 100mm width',
        imageUrl: null,
        minimumOrderQuantity: 50,
        averagePrice: 850, // $8.50 per meter
        currency: 'USD',
        supplierCount: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: cottonFabricId,
        name: '100% Cotton Fabric (Wholesale)',
        description: 'Premium quality 100% cotton fabric suitable for apparel manufacturing. Available in various colors.',
        category: 'Textiles',
        unitOfMeasure: 'meters',
        specifications: '150gsm, 100% cotton, pre-shrunk, colorfast',
        imageUrl: null,
        minimumOrderQuantity: 100,
        averagePrice: 550, // $5.50 per meter
        currency: 'USD',
        supplierCount: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: sheaButterB,
        name: 'Organic Shea Butter (Raw)',
        description: 'Unrefined organic shea butter sourced from West Africa. Ideal for natural skincare product formulation.',
        category: 'Ingredients',
        unitOfMeasure: 'kg',
        specifications: 'Organic certified, unrefined, Grade A, ivory color',
        imageUrl: null,
        minimumOrderQuantity: 25,
        averagePrice: 1800, // $18.00 per kg
        currency: 'USD',
        supplierCount: 3,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo financial institutions
    const jnBankId = randomUUID();
    const devBankId = randomUUID();
    const ncbId = randomUUID();
    const jmmfId = randomUUID();
    
    this.financialInstitutions = [
      {
        id: jnBankId,
        userId: 'demo-finance-user-1',
        institutionName: 'Jamaica National Bank',
        institutionType: 'Commercial Bank',
        description: 'Leading commercial bank offering comprehensive financing solutions for small and medium-sized businesses. We specialize in manufacturing and export financing with competitive rates and flexible terms.',
        logoUrl: null,
        location: 'Kingston, Jamaica',
        address: '2-4 King Street, Kingston',
        loanProducts: ['Working Capital', 'Equipment Financing', 'Export Credit', 'Business Expansion'],
        minLoanAmount: '10000',
        maxLoanAmount: '5000000',
        website: 'https://jnbank.com',
        phone: '+1 876-922-1234',
        email: 'business@jnbank.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: devBankId,
        userId: 'demo-finance-user-2',
        institutionName: 'Development Bank of Jamaica',
        institutionType: 'Development Bank',
        description: 'Government-backed development bank focused on supporting Jamaican businesses with affordable financing. We offer specialized loans for manufacturing, agriculture, and export-oriented businesses.',
        logoUrl: null,
        location: 'Kingston, Jamaica',
        address: '15-19 Oxford Road, Kingston 5',
        loanProducts: ['SME Loans', 'Manufacturing Finance', 'Export Development', 'Green Energy Loans'],
        minLoanAmount: '5000',
        maxLoanAmount: '10000000',
        website: 'https://dbankjm.com',
        phone: '+1 876-929-4000',
        email: 'info@dbankjm.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: ncbId,
        userId: 'demo-finance-user-3',
        institutionName: 'NCB Capital Markets',
        institutionType: 'Investment Bank',
        description: 'Premier investment bank providing structured financing, project finance, and growth capital for established businesses. We work with brands looking to scale production and expand market reach.',
        logoUrl: null,
        location: 'Kingston, Jamaica',
        address: '32 Trafalgar Road, Kingston 10',
        loanProducts: ['Growth Capital', 'Project Finance', 'Trade Finance', 'Asset-Based Lending'],
        minLoanAmount: '50000',
        maxLoanAmount: '20000000',
        website: 'https://ncbcapital.com',
        phone: '+1 876-929-9150',
        email: 'corporate@ncbcapital.com',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: jmmfId,
        userId: 'demo-finance-user-4',
        institutionName: 'Jamaica Micro-Finance Limited',
        institutionType: 'Micro-Finance',
        description: 'Dedicated microfinance institution supporting micro and small businesses across Jamaica. We specialize in providing accessible financing to entrepreneurs and startups with simplified application processes.',
        logoUrl: null,
        location: 'Montego Bay, Jamaica',
        address: '27 Market Street, Montego Bay',
        loanProducts: ['Micro Loans', 'Start-up Financing', 'Women in Business', 'Quick Business Loans'],
        minLoanAmount: '1000',
        maxLoanAmount: '500000',
        website: 'https://jmmicrofinance.com',
        phone: '+1 876-952-3456',
        email: 'loans@jmmicrofinance.com',
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo loan products
    this.loanProducts = [
      {
        id: randomUUID(),
        lenderId: jnBankId,
        productName: 'Manufacturing Equipment Loan',
        description: 'Finance new or used equipment for your manufacturing operations. Up to 100% financing available with flexible repayment terms.',
        loanType: 'Equipment Financing',
        minAmount: '25000',
        maxAmount: '2000000',
        interestRateMin: '7.5',
        interestRateMax: '10.5',
        termMonthsMin: 12,
        termMonthsMax: 84,
        currency: 'USD',
        requirements: ['Business registration', '2 years operating history', 'Financial statements', 'Equipment quote'],
        features: ['Fast approval', 'No hidden fees', 'Flexible payment schedule', 'Up to 7 years term'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        lenderId: jnBankId,
        productName: 'Working Capital Line of Credit',
        description: 'Revolving credit facility to manage cash flow and support day-to-day operations. Draw funds as needed and only pay interest on what you use.',
        loanType: 'Working Capital',
        minAmount: '10000',
        maxAmount: '1000000',
        interestRateMin: '8.0',
        interestRateMax: '12.0',
        termMonthsMin: 12,
        termMonthsMax: 36,
        currency: 'USD',
        requirements: ['1 year in business', 'Regular revenue', 'Business bank statements', 'Tax compliance'],
        features: ['Revolving credit', 'Draw as needed', 'Quick approval', 'Competitive rates'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        lenderId: devBankId,
        productName: 'SME Growth Loan',
        description: 'Government-backed loan program designed to help small manufacturers expand operations, increase capacity, and create jobs.',
        loanType: 'Expansion Loan',
        minAmount: '15000',
        maxAmount: '5000000',
        interestRateMin: '5.5',
        interestRateMax: '8.5',
        termMonthsMin: 24,
        termMonthsMax: 120,
        currency: 'USD',
        requirements: ['Jamaican-owned business', 'Business plan', 'Financial projections', 'Collateral'],
        features: ['Low interest rates', 'Long repayment terms', 'Grace period available', 'Technical assistance'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        lenderId: ncbId,
        productName: 'Export Finance Facility',
        description: 'Specialized financing for manufacturers with export contracts. Pre-shipment and post-shipment financing available.',
        loanType: 'Export Credit',
        minAmount: '100000',
        maxAmount: '10000000',
        interestRateMin: '6.5',
        interestRateMax: '9.0',
        termMonthsMin: 6,
        termMonthsMax: 36,
        currency: 'USD',
        requirements: ['Export contract', '3 years operating history', 'Audited financials', 'Export license'],
        features: ['Competitive USD rates', 'Letter of credit services', 'Foreign exchange hedging', 'Trade advisory'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        lenderId: jmmfId,
        productName: 'Quick Start Business Loan',
        description: 'Fast approval micro-loan for small businesses and startups. Simplified application process with minimal documentation required.',
        loanType: 'Micro Loan',
        minAmount: '1000',
        maxAmount: '50000',
        interestRateMin: '12.0',
        interestRateMax: '18.0',
        termMonthsMin: 6,
        termMonthsMax: 36,
        currency: 'JMD',
        requirements: ['Valid ID', 'Business registration', 'Proof of income', 'Business address'],
        features: ['24-hour approval', 'No collateral required', 'Weekly or monthly payments', 'Business mentorship'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo designers
    this.designers = [
      {
        id: randomUUID(),
        userId: 'demo-designer-user-1',
        displayName: 'Marcia Thompson Design Studio',
        tagline: 'Award-winning packaging designer specializing in Caribbean food brands',
        bio: 'With over 15 years of experience, I help Caribbean food brands stand out on shelves through authentic, culturally-relevant packaging design. My work has been featured in international design publications and won multiple awards.',
        profileImageUrl: null,
        coverImageUrl: null,
        designSpecialties: ['Packaging Design', 'Product Branding', 'Label Design', 'Print Design'],
        softwareProficiency: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'CorelDRAW'],
        designStyles: ['Modern', 'Authentic Caribbean', 'Eco-Friendly', 'Bold & Colorful'],
        servicesOffered: ['Package Design', 'Logo Design', 'Label Design', 'Brand Identity', 'Print Production Files'],
        hourlyRate: '85',
        projectRate: null,
        availableForHire: true,
        portfolioItems: [],
        yearsExperience: 15,
        location: 'Kingston, Jamaica',
        website: 'https://marciathompsondesign.com',
        phone: '+1 876-555-7001',
        socialLinks: {},
        averageRating: '4.9',
        totalReviews: 28,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-designer-user-2',
        displayName: 'Caribbean Product Innovators',
        tagline: 'Industrial design for manufacturing and product development',
        bio: 'We are a team of industrial designers focused on helping Jamaican manufacturers bring products from concept to reality. Specializing in sustainable design and local materials.',
        profileImageUrl: null,
        coverImageUrl: null,
        designSpecialties: ['Industrial Design', 'Product Design', 'Prototyping', '3D Modeling'],
        softwareProficiency: ['SolidWorks', 'AutoCAD', 'Fusion 360', 'KeyShot'],
        designStyles: ['Sustainable', 'Functional', 'Modern', 'Manufacturing-Ready'],
        servicesOffered: ['Product Design', 'CAD Modeling', 'Prototype Development', 'Manufacturing Drawings', 'Design for Manufacturing'],
        hourlyRate: '120',
        projectRate: null,
        availableForHire: true,
        portfolioItems: [],
        yearsExperience: 10,
        location: 'Montego Bay, Jamaica',
        website: 'https://cpinnovators.com',
        phone: '+1 876-555-7002',
        socialLinks: {},
        averageRating: '4.8',
        totalReviews: 19,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-designer-user-3',
        displayName: 'Island Graphics Co.',
        tagline: 'Graphic design and branding for Caribbean businesses',
        bio: 'Full-service design agency creating memorable brands for local businesses. From logos to marketing materials, we bring your vision to life with a Caribbean flair.',
        profileImageUrl: null,
        coverImageUrl: null,
        designSpecialties: ['Graphic Design', 'Branding', 'Marketing Collateral', 'Digital Design'],
        softwareProficiency: ['Adobe Creative Suite', 'Figma', 'Canva Pro', 'Adobe XD'],
        designStyles: ['Contemporary', 'Caribbean-Inspired', 'Minimalist', 'Vibrant'],
        servicesOffered: ['Brand Identity', 'Logo Design', 'Marketing Materials', 'Social Media Graphics', 'Web Design'],
        hourlyRate: '65',
        projectRate: null,
        availableForHire: true,
        portfolioItems: [],
        yearsExperience: 8,
        location: 'Kingston, Jamaica',
        website: 'https://islandgraphics.co',
        phone: '+1 876-555-7003',
        socialLinks: {},
        averageRating: '4.7',
        totalReviews: 34,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo creators
    this.creators = [
      {
        id: randomUUID(),
        userId: 'demo-creator-user-1',
        displayName: 'Jamaica Food Content by Alex',
        tagline: 'Food photography and videography specialist',
        bio: 'Professional food content creator helping Caribbean food brands showcase their products through stunning photography and engaging video content. Perfect for social media, websites, and marketing campaigns.',
        profileImageUrl: null,
        coverImageUrl: null,
        specialties: ['Food Photography', 'Product Photography', 'Video Production', 'Social Media Content'],
        skills: ['Canon Camera Systems', 'Lighting', 'Food Styling', 'Video Editing', 'Adobe Premiere Pro'],
        contentTypes: ['Photos', 'Videos', 'Reels/TikToks', 'Product Shots'],
        servicesOffered: ['Product Photography', 'Recipe Videos', 'Social Media Content Packages', 'Brand Content Strategy'],
        hourlyRate: '95',
        projectRate: null,
        availableForHire: true,
        portfolioItems: [],
        yearsExperience: 7,
        location: 'Kingston, Jamaica',
        website: 'https://alexfoodcontent.com',
        phone: '+1 876-555-8001',
        socialLinks: {},
        averageRating: '4.9',
        totalReviews: 42,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-creator-user-2',
        displayName: 'Caribbean Stories Media',
        tagline: 'Brand storytelling through video and content',
        bio: 'We create compelling brand stories that connect Caribbean businesses with their audiences. From brand documentaries to promotional videos, we bring your story to life.',
        profileImageUrl: null,
        coverImageUrl: null,
        specialties: ['Video Production', 'Brand Storytelling', 'Documentary', 'Commercial Production'],
        skills: ['Cinema Cameras', 'Drone Operation', 'Color Grading', 'Sound Design', 'Final Cut Pro'],
        contentTypes: ['Brand Videos', 'Commercials', 'Documentaries', 'Behind-the-Scenes'],
        servicesOffered: ['Brand Videos', 'Commercial Production', 'Corporate Documentaries', 'Promotional Content'],
        hourlyRate: '150',
        projectRate: null,
        availableForHire: true,
        portfolioItems: [],
        yearsExperience: 12,
        location: 'Kingston, Jamaica',
        website: 'https://caribbeanstoriesmedia.com',
        phone: '+1 876-555-8002',
        socialLinks: {},
        averageRating: '4.8',
        totalReviews: 26,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        userId: 'demo-creator-user-3',
        displayName: 'Social Media Pro Jamaica',
        tagline: 'Social media management and content creation',
        bio: 'Helping Jamaican brands grow their social media presence with engaging content, strategic planning, and community management. Specialized in Instagram, TikTok, and Facebook.',
        profileImageUrl: null,
        coverImageUrl: null,
        specialties: ['Social Media Management', 'Content Strategy', 'Copywriting', 'Community Management'],
        skills: ['Instagram Marketing', 'TikTok Creation', 'Canva', 'Analytics', 'Content Planning'],
        contentTypes: ['Social Posts', 'Captions', 'Stories', 'Reels', 'Content Calendars'],
        servicesOffered: ['Social Media Management', 'Content Creation', 'Community Engagement', 'Analytics & Reporting'],
        hourlyRate: '55',
        projectRate: null,
        availableForHire: true,
        portfolioItems: [],
        yearsExperience: 5,
        location: 'Montego Bay, Jamaica',
        website: 'https://socialmediaprojm.com',
        phone: '+1 876-555-8003',
        socialLinks: {},
        averageRating: '4.7',
        totalReviews: 31,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo courses
    const course1Id = randomUUID();
    const course2Id = randomUUID();
    const course3Id = randomUUID();
    const course4Id = randomUUID();
    
    this.courses = [
      {
        id: course1Id,
        title: 'HACCP Fundamentals for Food Manufacturers',
        description: 'Learn the essential principles of Hazard Analysis and Critical Control Points (HACCP) for food safety management. This course covers the seven principles of HACCP, how to implement them in your facility, and how to maintain compliance.',
        category: 'Certification',
        level: 'beginner',
        duration: 180,
        thumbnailUrl: null,
        instructorName: 'Dr. Jennifer Brown',
        instructorBio: 'Food Safety Consultant with 20 years experience, Former BSJ Inspector',
        isPublished: true,
        enrollmentCount: 156,
        certificateTemplate: null,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: course2Id,
        title: 'Export Documentation and Requirements for Jamaica',
        description: 'Complete guide to export procedures, documentation, and compliance requirements for Jamaican businesses. Learn about customs procedures, export licenses, shipping documents, and international trade regulations.',
        category: 'Export',
        level: 'intermediate',
        duration: 240,
        thumbnailUrl: null,
        instructorName: 'Mark Williams',
        instructorBio: 'International Trade Specialist, Former JAMPRO Export Advisor',
        isPublished: true,
        enrollmentCount: 203,
        certificateTemplate: null,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: course3Id,
        title: 'Manufacturing Cost Analysis and Pricing',
        description: 'Master the fundamentals of manufacturing cost analysis, break-even calculations, and pricing strategies. Essential for brands and manufacturers to ensure profitable operations.',
        category: 'Business',
        level: 'beginner',
        duration: 150,
        thumbnailUrl: null,
        instructorName: 'Sharon Chen, MBA',
        instructorBio: 'Business Consultant specializing in manufacturing operations',
        isPublished: true,
        enrollmentCount: 189,
        certificateTemplate: null,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: course4Id,
        title: 'Quality Control Best Practices',
        description: 'Comprehensive training on implementing quality control systems in manufacturing facilities. Covers inspection procedures, testing protocols, documentation, and continuous improvement methods.',
        category: 'Quality Control',
        level: 'intermediate',
        duration: 210,
        thumbnailUrl: null,
        instructorName: 'Robert Taylor',
        instructorBio: 'ISO 9001 Lead Auditor, Quality Management Specialist',
        isPublished: true,
        enrollmentCount: 142,
        certificateTemplate: null,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Seed demo resources
    this.resources = [
      {
        id: randomUUID(),
        title: 'Jamaica Export Guide 2024',
        category: 'Export Guides',
        description: 'Comprehensive guide to exporting from Jamaica including procedures, required documentation, customs regulations, and contact information for key agencies.',
        fileUrl: '/resources/jamaica-export-guide-2024.pdf',
        fileType: 'pdf',
        tags: ['export', 'customs', 'documentation', 'compliance'],
        viewCount: 487,
        downloadCount: 312,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: 'HACCP Plan Template',
        category: 'Certification Templates',
        description: 'Ready-to-use HACCP plan template for food manufacturers. Includes all seven principles, critical control points worksheets, and monitoring forms.',
        fileUrl: '/resources/haccp-plan-template.docx',
        fileType: 'docx',
        tags: ['haccp', 'food safety', 'certification', 'template'],
        viewCount: 623,
        downloadCount: 445,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: 'Manufacturing Cost Calculator',
        category: 'Costing Calculators',
        description: 'Excel-based calculator for determining manufacturing costs, pricing, and profit margins. Includes labor, materials, overhead, and markup calculations.',
        fileUrl: '/resources/manufacturing-cost-calculator.xlsx',
        fileType: 'xlsx',
        tags: ['costing', 'pricing', 'calculator', 'finance'],
        viewCount: 892,
        downloadCount: 567,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: 'Product Labeling Requirements for Jamaica',
        category: 'Compliance',
        description: 'Complete guide to product labeling requirements under Jamaican law including mandatory information, nutrition facts formatting, and BSJ standards.',
        fileUrl: '/resources/labeling-requirements-jamaica.pdf',
        fileType: 'pdf',
        tags: ['labeling', 'compliance', 'bsj', 'regulations'],
        viewCount: 541,
        downloadCount: 389,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: 'Manufacturer Capability Statement Template',
        category: 'Business Templates',
        description: 'Professional template for manufacturers to showcase their capabilities, certifications, equipment, and capacity to potential clients.',
        fileUrl: '/resources/capability-statement-template.docx',
        fileType: 'docx',
        tags: ['template', 'business', 'marketing', 'manufacturer'],
        viewCount: 376,
        downloadCount: 234,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: 'Grant and Financing Opportunities Directory',
        category: 'Financing',
        description: 'Updated directory of grants, loans, and financing programs available to Jamaican manufacturers and exporters from government and private sources.',
        fileUrl: '/resources/financing-directory-2024.pdf',
        fileType: 'pdf',
        tags: ['financing', 'grants', 'loans', 'funding'],
        viewCount: 1247,
        downloadCount: 823,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  private assignId<T extends { id?: string }>(obj: T): T & { id: string } {
    return { ...(obj as any), id: obj.id || randomUUID() };
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.find(u => u.id === userData.id);
    if (existing) {
      const updated: User = { ...existing, ...userData, updatedAt: this.now() } as any;
      this.users = this.users.map(u => u.id === existing.id ? updated : u);
      return updated;
    }
    const created: User = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: userData.role as any,
      currency: (userData as any).currency || 'USD',
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.users.push(created);
    return created;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return this.users.filter(u => u.role === (role as any));
  }

  // Manufacturers
  async getManufacturer(id: string): Promise<Manufacturer | undefined> {
    return this.manufacturers.find(m => m.id === id);
  }

  async getManufacturerByUserId(userId: string): Promise<Manufacturer | undefined> {
    return this.manufacturers.find(m => m.userId === userId);
  }

  async createManufacturer(data: InsertManufacturer): Promise<Manufacturer> {
    const withId = this.assignId(data);
    const manufacturer: Manufacturer = {
      ...(withId as any),
      verificationStatus: (data as any).verificationStatus || 'pending',
      averageRating: (data as any).averageRating || 0,
      totalReviews: (data as any).totalReviews || 0,
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.manufacturers.push(manufacturer);
    return manufacturer;
  }

  async updateManufacturer(id: string, data: Partial<InsertManufacturer>): Promise<Manufacturer | undefined> {
    const existing = this.manufacturers.find(m => m.id === id);
    if (!existing) return undefined;
    const updated: Manufacturer = { ...existing, ...(data as any), updatedAt: this.now() } as any;
    this.manufacturers = this.manufacturers.map(m => m.id === id ? updated : m);
    return updated;
  }

  async searchManufacturers(_filters: any): Promise<Manufacturer[]> {
    return this.manufacturers;
  }

  // Brands
  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.find(b => b.id === id);
  }

  async getBrandByUserId(userId: string): Promise<Brand | undefined> {
    return this.brands.find(b => b.userId === userId);
  }

  async createBrand(data: InsertBrand): Promise<Brand> {
    const withId = this.assignId(data);
    const brand: Brand = {
      ...(withId as any),
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.brands.push(brand);
    return brand;
  }

  async updateBrand(id: string, data: Partial<InsertBrand>): Promise<Brand | undefined> {
    const existing = this.brands.find(b => b.id === id);
    if (!existing) return undefined;
    const updated: Brand = { ...existing, ...(data as any), updatedAt: this.now() } as any;
    this.brands = this.brands.map(b => b.id === id ? updated : b);
    return updated;
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.find(p => p.id === id);
  }

  async getProjectsByBrand(brandId: string): Promise<Project[]> {
    return this.projects.filter(p => p.brandId === brandId);
  }

  async getProjectsByManufacturer(manufacturerId: string): Promise<Project[]> {
    return this.projects.filter(p => p.manufacturerId === manufacturerId);
  }

  async createProject(data: InsertProject): Promise<Project> {
    const withId = this.assignId(data);
    const project: Project = {
      ...(withId as any),
      status: (data as any).status || 'draft',
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.projects.push(project);
    return project;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.find(p => p.id === id);
    if (!existing) return undefined;
    const updated: Project = { ...existing, ...(data as any), updatedAt: this.now() } as any;
    this.projects = this.projects.map(p => p.id === id ? updated : p);
    return updated;
  }

  // RFQs
  async getRfq(id: string): Promise<Rfq | undefined> {
    return this.rfqs.find(r => r.id === id);
  }

  async getRfqsByBrand(brandId: string): Promise<Rfq[]> {
    return this.rfqs.filter(r => r.brandId === brandId);
  }

  async getActiveRfqs(): Promise<Rfq[]> {
    return this.rfqs.filter(r => (r as any).status !== 'closed');
  }

  async createRfq(data: InsertRfq): Promise<Rfq> {
    const withId = this.assignId(data);
    const rfq: Rfq = {
      ...(withId as any),
      status: (data as any).status || 'active',
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.rfqs.push(rfq);
    return rfq;
  }

  async updateRfq(id: string, data: Partial<InsertRfq>): Promise<Rfq | undefined> {
    const existing = this.rfqs.find(r => r.id === id);
    if (!existing) return undefined;
    const updated: Rfq = { ...existing, ...(data as any), updatedAt: this.now() } as any;
    this.rfqs = this.rfqs.map(r => r.id === id ? updated : r);
    return updated;
  }

  async deleteRfq(id: string): Promise<boolean> {
    const before = this.rfqs.length;
    this.rfqs = this.rfqs.filter(r => r.id !== id);
    return this.rfqs.length < before;
  }

  // RFQ Responses
  async getRfqResponse(id: string): Promise<RfqResponse | undefined> {
    return this.rfqResponses.find(rr => rr.id === id);
  }

  async getRfqResponsesByRfq(rfqId: string): Promise<RfqResponse[]> {
    return this.rfqResponses.filter(rr => rr.rfqId === rfqId);
  }

  async getRfqResponsesByManufacturer(manufacturerId: string): Promise<RfqResponse[]> {
    return this.rfqResponses.filter(rr => rr.manufacturerId === manufacturerId);
  }

  async createRfqResponse(data: InsertRfqResponse): Promise<RfqResponse> {
    const withId = this.assignId(data);
    const response: RfqResponse = {
      ...(withId as any),
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.rfqResponses.push(response);
    return response;
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.find(m => m.id === id);
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return this.messages.filter(m => (m as any).senderId === userId1 && (m as any).recipientId === userId2 || (m as any).senderId === userId2 && (m as any).recipientId === userId1);
  }

  async getMessageThreads(userId: string): Promise<Message[]> {
    return this.messages.filter(m => (m as any).senderId === userId || (m as any).recipientId === userId);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const withId = this.assignId(data);
    const message: Message = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), status: (data as any).status || 'sent' } as any;
    this.messages.push(message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const existing = this.messages.find(m => m.id === id);
    if (!existing) return false;
    const updated: Message = { ...existing, status: 'read' as any, updatedAt: this.now() } as any;
    this.messages = this.messages.map(m => m.id === id ? updated : m);
    return true;
  }

  // Reviews
  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.find(r => r.id === id);
  }

  async getReviewsByManufacturer(manufacturerId: string): Promise<Review[]> {
    return this.reviews.filter(r => (r as any).manufacturerId === manufacturerId);
  }

  async createReview(data: InsertReview): Promise<Review> {
    const withId = this.assignId(data);
    const review: Review = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any;
    this.reviews.push(review);
    return review;
  }

  async updateReviewResponse(id: string, response: string): Promise<Review | undefined> {
    const existing = this.reviews.find(r => r.id === id);
    if (!existing) return undefined;
    const updated: Review = { ...existing, response: response as any, updatedAt: this.now() } as any;
    this.reviews = this.reviews.map(r => r.id === id ? updated : r);
    return updated;
  }

  // Certifications
  async getCertificationsByManufacturer(manufacturerId: string): Promise<Certification[]> {
    return this.certifications.filter(c => (c as any).manufacturerId === manufacturerId);
  }

  async createCertification(data: InsertCertification): Promise<Certification> {
    const withId = this.assignId(data);
    const cert: Certification = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any;
    this.certifications.push(cert);
    return cert;
  }

  async verifyCertification(id: string): Promise<Certification | undefined> {
    const existing = this.certifications.find(c => c.id === id);
    if (!existing) return undefined;
    const updated: Certification = { ...existing, verifiedAt: this.now() } as any;
    this.certifications = this.certifications.map(c => c.id === id ? updated : c);
    return updated;
  }

  // Portfolio
  async getPortfolioItemsByManufacturer(manufacturerId: string): Promise<PortfolioItem[]> {
    return this.portfolioItems.filter(p => (p as any).manufacturerId === manufacturerId);
  }

  async createPortfolioItem(data: InsertPortfolioItem): Promise<PortfolioItem> {
    const withId = this.assignId(data);
    const item: PortfolioItem = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any;
    this.portfolioItems.push(item);
    return item;
  }

  // Verification Requests
  async getVerificationRequest(id: string): Promise<VerificationRequest | undefined> {
    return this.verificationRequests.find(v => v.id === id);
  }

  async getPendingVerifications(): Promise<VerificationRequest[]> {
    return this.verificationRequests.filter(v => (v as any).status === 'pending');
  }

  async createVerificationRequest(data: InsertVerificationRequest): Promise<VerificationRequest> {
    const withId = this.assignId(data);
    const req: VerificationRequest = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), status: (data as any).status || 'pending' } as any;
    this.verificationRequests.push(req);
    return req;
  }

  async updateVerificationStatus(id: string, status: 'approved' | 'rejected', reviewedBy: string, notes?: string): Promise<VerificationRequest | undefined> {
    const existing = this.verificationRequests.find(v => v.id === id);
    if (!existing) return undefined;
    const updated: VerificationRequest = { ...existing, status: status as any, reviewedBy: reviewedBy as any, notes: notes as any, updatedAt: this.now() } as any;
    this.verificationRequests = this.verificationRequests.map(v => v.id === id ? updated : v);
    return updated;
  }

  // Financing Leads
  async getFinancingLead(id: string): Promise<FinancingLead | undefined> {
    return this.financingLeads.find(f => f.id === id);
  }

  async getFinancingLeadsByInstitution(institutionId: string): Promise<FinancingLead[]> {
    return this.financingLeads.filter(f => (f as any).institutionId === institutionId);
  }

  async createFinancingLead(data: InsertFinancingLead): Promise<FinancingLead> {
    const withId = this.assignId(data);
    const lead: FinancingLead = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), status: (data as any).status || 'new' } as any;
    this.financingLeads.push(lead);
    return lead;
  }

  async updateFinancingLeadStatus(id: string, status: string): Promise<FinancingLead | undefined> {
    const existing = this.financingLeads.find(f => f.id === id);
    if (!existing) return undefined;
    const updated: FinancingLead = { ...existing, status: status as any, updatedAt: this.now() } as any;
    this.financingLeads = this.financingLeads.map(f => f.id === id ? updated : f);
    return updated;
  }

  // Resources
  async getResources(): Promise<Resource[]> {
    return this.resources;
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return this.resources.filter(r => (r as any).category === category);
  }

  async incrementResourceView(id: string): Promise<boolean> {
    const existing = this.resources.find(r => r.id === id);
    if (!existing) return false;
    (existing as any).views = ((existing as any).views || 0) + 1;
    return true;
  }

  async incrementResourceDownload(id: string): Promise<boolean> {
    const existing = this.resources.find(r => r.id === id);
    if (!existing) return false;
    (existing as any).downloads = ((existing as any).downloads || 0) + 1;
    return true;
  }

  // Notifications
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => (n as any).userId === userId);
  }

  async createNotification(data: InsertNotification): Promise<Notification> {
    const withId = this.assignId(data);
    const notif: Notification = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), isRead: (data as any).isRead || false } as any;
    this.notifications.push(notif);
    return notif;
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const existing = this.notifications.find(n => n.id === id);
    if (!existing) return false;
    const updated: Notification = { ...existing, isRead: true as any, updatedAt: this.now() } as any;
    this.notifications = this.notifications.map(n => n.id === id ? updated : n);
    return true;
  }

  // LMS (minimal stubs)
  async getCourses(_category?: string): Promise<Course[]> {
    return this.courses;
  }

  async getCourseWithModulesAndLessons(_courseId: string): Promise<any> {
    return null;
  }

  async enrollInCourse(userId: string, courseId: string): Promise<UserCourseEnrollment> {
    const enrollment: UserCourseEnrollment = { id: randomUUID(), userId, courseId, enrolledAt: this.now() } as any;
    this.enrollments.push(enrollment);
    return enrollment;
  }

  async getCourseProgress(_userId: string, _courseId: string): Promise<any> {
    return { progressPercentage: 0, completedLessons: 0, totalLessons: 0 };
  }

  async markLessonComplete(userId: string, lessonId: string): Promise<UserLessonProgress> {
    const progress: UserLessonProgress = { id: randomUUID(), userId, lessonId, isCompleted: true, createdAt: this.now(), completedAt: this.now() } as any;
    this.lessonProgress.push(progress);
    return progress;
  }

  async getUserEnrollments(userId: string): Promise<any[]> {
    return this.enrollments.filter(e => e.userId === userId);
  }

  // Raw materials and project materials (minimal)
  async getRawMaterials(_category?: string): Promise<RawMaterial[]> { return this.rawMaterials; }
  async getRawMaterial(id: string): Promise<RawMaterial | undefined> { return this.rawMaterials.find(r => r.id === id); }
  async getRawMaterialSuppliers(materialId: string): Promise<any[]> { return this.rawMaterialSuppliers.filter(s => (s as any).rawMaterialId === materialId) as any; }
  async createRawMaterial(data: InsertRawMaterial): Promise<RawMaterial> { const withId = this.assignId(data); const rm: RawMaterial = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any; this.rawMaterials.push(rm); return rm; }
  async createRawMaterialSupplier(data: InsertRawMaterialSupplier): Promise<RawMaterialSupplier> { const withId = this.assignId(data); const s: RawMaterialSupplier = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any; this.rawMaterialSuppliers.push(s); return s; }

  async getProjectMaterials(projectId: string): Promise<any[]> { return this.projectMaterials.filter(pm => pm.projectId === projectId) as any; }
  async addMaterialToProject(data: InsertProjectMaterial): Promise<ProjectMaterial> { const withId = this.assignId(data); const pm: ProjectMaterial = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), totalCost: (data as any).totalCost || 0 } as any; this.projectMaterials.push(pm); return pm; }
  async removeMaterialFromProject(id: string): Promise<boolean> { const before = this.projectMaterials.length; this.projectMaterials = this.projectMaterials.filter(pm => pm.id !== id); return this.projectMaterials.length < before; }
  async updateProjectMaterialQuantity(id: string, quantity: number): Promise<ProjectMaterial | undefined> { const existing = this.projectMaterials.find(pm => pm.id === id); if (!existing) return undefined; const updated: ProjectMaterial = { ...existing, quantity, updatedAt: this.now() } as any; this.projectMaterials = this.projectMaterials.map(pm => pm.id === id ? updated : pm); return updated; }
  async getProjectMaterialsCost(projectId: string): Promise<{ totalCost: number; currency: string }> { const items = (this.projectMaterials.filter(pm => pm.projectId === projectId) as any); const total = items.reduce((sum: number, pm: any) => sum + (pm.totalCost || 0), 0); return { totalCost: total, currency: 'USD' }; }

  // Creators
  async getCreators(filters?: any): Promise<any[]> { if (!filters || filters.availableForHire === undefined) return this.candidates(this.creatorsData()); return this.candidates(this.creatorsData().filter(c => c.availableForHire === filters.availableForHire)); }
  async getCreator(id: string): Promise<any | undefined> { return this.creatorsData().find(c => c.id === id); }
  async getCreatorByUserId(userId: string): Promise<any | undefined> { return this.creatorsData().find(c => c.userId === userId); }
  async createCreator(data: any): Promise<any> { const created = { id: randomUUID(), createdAt: this.now(), updatedAt: this.now(), ...data }; this._creators.push(created); return created; }
  async updateCreator(id: string, data: any): Promise<any | undefined> { const existing = this._creators.find(c => c.id === id); if (!existing) return undefined; const updated = { ...existing, ...data, updatedAt: this.now() }; this._creators = this._creators.map(c => c.id === id ? updated : c); return updated; }

  // Designers
  async getDesigners(filters?: any): Promise<any[]> { if (!filters || filters.availableForHire === undefined) return this.candidates(this.designersData()); return this.candidates(this.designersData().filter(d => d.availableForHire === filters.availableForHire)); }
  async getDesigner(id: string): Promise<any | undefined> { return this.designersData().find(d => d.id === id); }
  async getDesignerByUserId(userId: string): Promise<any | undefined> { return this.designersData().find(d => d.userId === userId); }
  async createDesigner(data: any): Promise<any> { const created = { id: randomUUID(), createdAt: this.now(), updatedAt: this.now(), ...data }; this._designers.push(created); return created; }
  async updateDesigner(id: string, data: any): Promise<any | undefined> { const existing = this._designers.find(d => d.id === id); if (!existing) return undefined; const updated = { ...existing, ...data, updatedAt: this.now() }; this._designers = this._designers.map(d => d.id === id ? updated : d); return updated; }

  // Financial Institutions & Loans (minimal)
  async getFinancialInstitutions(): Promise<FinancialInstitution[]> { return this.financialInstitutions; }
  async getFinancialInstitution(id: string): Promise<FinancialInstitution | undefined> { return this.financialInstitutions.find(fi => fi.id === id); }
  async createFinancialInstitution(data: InsertFinancialInstitution): Promise<FinancialInstitution> { const withId = this.assignId(data); const fi: FinancialInstitution = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any; this.financialInstitutions.push(fi); return fi; }
  async updateFinancialInstitution(id: string, data: Partial<InsertFinancialInstitution>): Promise<FinancialInstitution | undefined> { const existing = this.financialInstitutions.find(fi => fi.id === id); if (!existing) return undefined; const updated: FinancialInstitution = { ...existing, ...(data as any), updatedAt: this.now() } as any; this.financialInstitutions = this.financialInstitutions.map(fi => fi.id === id ? updated : fi); return updated; }
  async getLoanProducts(): Promise<LoanProduct[]> { return this.loanProducts; }
  async getLoanProductsByInstitution(institutionId: string): Promise<LoanProduct[]> { return this.loanProducts.filter(lp => lp.lenderId === institutionId); }
  async createLoanProduct(data: InsertLoanProduct): Promise<LoanProduct> { const withId = this.assignId(data); const lp: LoanProduct = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), isActive: (data as any).isActive ?? true } as any; this.loanProducts.push(lp); return lp; }
  async updateLoanProduct(id: string, data: Partial<InsertLoanProduct>): Promise<LoanProduct | undefined> { const existing = this.loanProducts.find(lp => lp.id === id); if (!existing) return undefined; const updated: LoanProduct = { ...existing, ...(data as any), updatedAt: this.now() } as any; this.loanProducts = this.loanProducts.map(lp => lp.id === id ? updated : lp); return updated; }
  async getLoanApplication(id: string): Promise<LoanApplication | undefined> { return this.loanApplications.find(la => la.id === id); }
  async getLoanApplicationsByApplicant(applicantId: string): Promise<LoanApplication[]> { return this.loanApplications.filter(la => la.applicantId === applicantId); }
  async getLoanApplicationsByInstitution(institutionId: string): Promise<LoanApplication[]> { return this.loanApplications.filter(la => (la as any).institutionId === institutionId); }
  async createLoanApplication(data: InsertLoanApplication): Promise<LoanApplication> { const withId = this.assignId(data); const la: LoanApplication = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), status: (data as any).status || 'draft' } as any; this.loanApplications.push(la); return la; }
  async updateLoanApplicationStatus(id: string, status: string): Promise<LoanApplication | undefined> { const existing = this.loanApplications.find(la => la.id === id); if (!existing) return undefined; const updated: LoanApplication = { ...existing, status: status as any, updatedAt: this.now() } as any; this.loanApplications = this.loanApplications.map(la => la.id === id ? updated : la); return updated; }

  // Internal seed for creators/designers when none exist (simple placeholders)
  private _creators: any[] = [];
  private _designers: any[] = [];

  private creatorsData(): any[] { return this._creators; }
  private designersData(): any[] { return this._designers; }
  private candidates<T>(arr: T[]): T[] { return arr; }
}