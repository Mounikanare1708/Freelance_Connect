const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Gig = require('../models/Gig');
const Order = require('../models/Order');
const Review = require('../models/Review');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
};

const categories = [
  'Programming & Tech',
  'Design & Creative',
  'Writing & Translation',
  'Digital Marketing',
  'Video & Animation',
  'Music & Audio',
  'Data & Analytics',
  'Business & Finance',
];

const users = [
  {
    name: 'Alex Johnson',
    email: 'alex@demo.com',
    password: 'password123',
    role: 'freelancer',
    bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and MongoDB. I love building beautiful and functional web applications.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
    location: 'New York, USA',
    phone: '+1-555-0101',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    name: 'Sarah Mitchell',
    email: 'sarah@demo.com',
    password: 'password123',
    role: 'freelancer',
    bio: 'Creative UI/UX designer passionate about crafting pixel-perfect designs that convert. Figma expert.',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX'],
    location: 'London, UK',
    phone: '+44-555-0102',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@demo.com',
    password: 'password123',
    role: 'both',
    bio: 'Data scientist and ML engineer. I turn raw data into actionable insights using Python, TensorFlow, and modern analytics tools.',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Tableau'],
    location: 'Toronto, Canada',
    phone: '+1-555-0103',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  },
  {
    name: 'Emma Rodriguez',
    email: 'emma@demo.com',
    password: 'password123',
    role: 'client',
    bio: 'Startup founder looking for talented freelancers to help build my dream projects.',
    skills: ['Product Management', 'Marketing', 'Business Strategy'],
    location: 'Miami, USA',
    phone: '+1-555-0104',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  },
  {
    name: 'James Wilson',
    email: 'james@demo.com',
    password: 'password123',
    role: 'freelancer',
    bio: 'Professional content writer and copywriter. SEO-optimized content that ranks and converts.',
    skills: ['Content Writing', 'SEO', 'Copywriting', 'Blog Writing', 'Technical Writing'],
    location: 'Sydney, Australia',
    phone: '+61-555-0105',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
];

const gigTemplates = [
  {
    title: 'I will build a full-stack React Node.js web application',
    description: 'I will develop a complete, production-ready web application using React.js for the frontend and Node.js/Express for the backend. Includes MongoDB integration, JWT authentication, and responsive design.\n\nWhat you get:\n✅ Full-stack web application\n✅ User authentication system\n✅ RESTful API\n✅ Responsive mobile-first design\n✅ Clean, commented code\n✅ Deployment assistance',
    category: 'Programming & Tech',
    tags: ['react', 'nodejs', 'fullstack', 'web development', 'mongodb'],
    price: 150,
    deliveryTime: 7,
    revisions: 3,
    images: [
      'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 0,
  },
  {
    title: 'I will design stunning UI/UX for your mobile or web app',
    description: 'Professional UI/UX design services for web and mobile applications. I create intuitive, beautiful interfaces that users love.\n\nDeliverables:\n✅ Wireframes & Prototypes\n✅ High-fidelity Figma designs\n✅ Design system & components\n✅ Interactive prototype\n✅ Source files included',
    category: 'Design & Creative',
    tags: ['ui design', 'ux design', 'figma', 'web design', 'mobile design'],
    price: 80,
    deliveryTime: 5,
    revisions: 5,
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 1,
  },
  {
    title: 'I will create a Python machine learning model for your data',
    description: 'Expert machine learning solutions using Python and industry-leading frameworks. From data preprocessing to model deployment.\n\nServices include:\n✅ Data analysis & preprocessing\n✅ Custom ML model development\n✅ Model training & optimization\n✅ Performance evaluation\n✅ Deployment-ready code\n✅ Documentation',
    category: 'Data & Analytics',
    tags: ['python', 'machine learning', 'ai', 'data science', 'tensorflow'],
    price: 200,
    deliveryTime: 10,
    revisions: 2,
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 2,
  },
  {
    title: 'I will write SEO-optimized blog posts and articles',
    description: 'High-quality, engaging content that ranks on Google and converts readers into customers. Native English writer with journalism background.\n\nWhat I offer:\n✅ Keyword research included\n✅ SEO-optimized headings & meta\n✅ Plagiarism-free guarantee\n✅ 1000-2000 words per article\n✅ Turnaround in 2-3 days\n✅ Unlimited revisions',
    category: 'Writing & Translation',
    tags: ['blog writing', 'seo content', 'copywriting', 'articles', 'content marketing'],
    price: 45,
    deliveryTime: 3,
    revisions: 99,
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542435503-ec7b0f6b96b9?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 4,
  },
  {
    title: 'I will build a responsive WordPress website for your business',
    description: 'Professional WordPress websites built to convert visitors into customers. From simple blogs to complex e-commerce stores.\n\nIncludes:\n✅ Custom WordPress theme setup\n✅ Responsive design\n✅ SEO optimization\n✅ Speed optimization\n✅ Contact forms & integrations\n✅ Training & support',
    category: 'Programming & Tech',
    tags: ['wordpress', 'web design', 'website', 'ecommerce', 'woocommerce'],
    price: 120,
    deliveryTime: 7,
    revisions: 3,
    images: [
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 0,
  },
  {
    title: 'I will create a professional logo and brand identity',
    description: 'Stand out from the crowd with a unique, memorable brand identity. I create logos that tell your story.\n\nPackage includes:\n✅ Logo in multiple formats (SVG, PNG, PDF)\n✅ Color palette guide\n✅ Typography selection\n✅ Brand style guide\n✅ Social media kit\n✅ Source files (AI/PSD)',
    category: 'Design & Creative',
    tags: ['logo design', 'branding', 'brand identity', 'graphic design', 'illustrator'],
    price: 65,
    deliveryTime: 4,
    revisions: 5,
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 1,
  },
  {
    title: 'I will set up and manage your Facebook & Instagram Ads',
    description: 'Drive targeted traffic and sales with professional social media advertising. I specialize in high-converting ad campaigns.\n\nWhat I do:\n✅ Target audience research\n✅ Ad copy writing\n✅ Campaign setup & optimization\n✅ Pixel integration\n✅ Weekly reporting',
    category: 'Digital Marketing',
    tags: ['facebook ads', 'instagram ads', 'social media marketing', 'ads management'],
    price: 90,
    deliveryTime: 5,
    revisions: 2,
    images: [
      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 4,
  },
  {
    title: 'I will edit your YouTube videos professionally',
    description: 'Turn your raw footage into engaging YouTube content. I handle everything from cuts to color correction.\n\nIncludes:\n✅ Smooth transitions\n✅ Sound design & mixing\n✅ Color grading\n✅ Motion graphics\n✅ Subtitles',
    category: 'Video & Animation',
    tags: ['video editing', 'youtube', 'content creator', 'premiere pro'],
    price: 55,
    deliveryTime: 3,
    revisions: 3,
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 0,
  },
  {
    title: 'I will provide expert financial consulting for your startup',
    description: 'Get your finances in order with professional consulting. I help startups with modeling and valuation.\n\nTopics covered:\n✅ Financial modeling\n✅ Budgeting & forecasting\n✅ Investor readiness\n✅ Cash flow management',
    category: 'Business & Finance',
    tags: ['consulting', 'startup', 'finance', 'business plan'],
    price: 180,
    deliveryTime: 10,
    revisions: 2,
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1454165833767-027eeef1593e?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 2,
  },
  {
    title: 'I will translate your documents between English and Spanish',
    description: 'Accurate and culturally relevant translations for any document type. Native-level fluency in both languages.\n\nServices:\n✅ Technical translation\n✅ Creative localization\n✅ Proofreading\n✅ Fast delivery',
    category: 'Writing & Translation',
    tags: ['translation', 'spanish', 'english', 'localization'],
    price: 30,
    deliveryTime: 2,
    revisions: 99,
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 4,
  },
  {
    title: 'I will perform professional data entry and lead generation',
    description: 'Save time by outsourcing your data tasks. I provide clean, accurate, and organized data in any format.\n\nSkills:\n✅ Web research\n✅ CRM data entry\n✅ Lead list building\n✅ Excel cleaning',
    category: 'Data & Analytics',
    tags: ['data entry', 'lead generation', 'excel', 'virtual assistant'],
    price: 25,
    deliveryTime: 2,
    revisions: 5,
    images: [
      'https://images.unsplash.com/photo-1489389944381-3471b5b30f04?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 2,
  },
  {
    title: 'I will create custom illustrations for your brand',
    description: 'Unique vector illustrations that give your brand a distinct personality. Perfect for websites and social media.\n\nDeliverables:\n✅ High-res vector files\n✅ Custom character design\n✅ Scene illustrations\n✅ Commercial usage rights',
    category: 'Design & Creative',
    tags: ['illustration', 'vector art', 'character design', 'digital art'],
    price: 75,
    deliveryTime: 5,
    revisions: 4,
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 1,
  },
  {
    title: 'I will record a professional voiceover in American English',
    description: 'High-quality voiceover for commercials, YouTube videos, or explainer animations. Professional studio quality.\n\nOptions:\n✅ Energetic & Friendly\n✅ Corporate & Professional\n✅ Dramatic & Narrative',
    category: 'Music & Audio',
    tags: ['voiceover', 'audio', 'commercial', 'narration'],
    price: 40,
    deliveryTime: 2,
    revisions: 3,
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 4,
  },
  {
    title: 'I will audit your website for SEO and technical issues',
    description: 'Find out why your website isn\'t ranking. I provide a comprehensive SEO audit with actionable steps.\n\nAudit includes:\n✅ Technical SEO analysis\n✅ Competitor research\n✅ Keyword gap analysis\n✅ Speed optimization tips',
    category: 'Digital Marketing',
    tags: ['seo audit', 'website analysis', 'technical seo', 'marketing'],
    price: 110,
    deliveryTime: 4,
    revisions: 1,
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 0,
  },
  {
    title: 'I will compose a custom intro song for your podcast',
    description: 'Make your podcast sound professional from the first second. I compose original, catchy intro music.\n\nIncludes:\n✅ Full rights ownership\n✅ 30-60 second duration\n✅ Multiple versions (long/short)\n✅ Mixing & Mastering',
    category: 'Music & Audio',
    tags: ['music composition', 'podcast intro', 'jingle', 'audio production'],
    price: 130,
    deliveryTime: 6,
    revisions: 2,
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 2,
  },
  {
    title: 'I will develop a custom Android & iOS mobile app',
    description: 'Transform your idea into a working mobile application using Flutter or React Native. High performance guaranteed.\n\nProcess:\n✅ UI/UX Integration\n✅ API Development\n✅ Store submission assistance\n✅ Post-launch support',
    category: 'Programming & Tech',
    tags: ['mobile app', 'flutter', 'react native', 'android', 'ios'],
    price: 450,
    deliveryTime: 21,
    revisions: 4,
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 0,
  },
  {
    title: 'I will write your professional resume and cover letter',
    description: 'Get noticed by recruiters with a modern, ATS-friendly resume. I help you highlight your best achievements.\n\nPackage:\n✅ Professional Resume\n✅ Tailored Cover Letter\n✅ LinkedIn Profile optimization\n✅ Editable source files',
    category: 'Writing & Translation',
    tags: ['resume writing', 'cv', 'career advice', 'cover letter'],
    price: 50,
    deliveryTime: 3,
    revisions: 5,
    images: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 4,
  },
  {
    title: 'I will create high-quality 3D product renderings',
    description: 'Photorealistic 3D renders for your products. Perfect for Amazon, Shopify, or marketing materials.\n\nWhat you get:\n✅ 4K resolution renders\n✅ Transparent background options\n✅ Multiple camera angles\n✅ Realistic lighting & textures',
    category: 'Video & Animation',
    tags: ['3d rendering', 'product design', 'blender', 'visualization'],
    price: 95,
    deliveryTime: 6,
    revisions: 3,
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop',
    ],
    freelancerIndex: 1,
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Gig.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await User.create({ ...userData, password: hashedPassword });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    // Dynamic Gig Generation
    const expandedGigs = [];
    
    const categoryConfigs = [
      {
        name: 'Programming & Tech',
        basePrice: 100,
        services: [
          'Full-stack Web App', 'WordPress Website', 'Mobile App Development', 'API Integration', 
          'Bug Fixing & Debugging', 'Database Design', 'Cloud Deployment', 'Custom CRM', 
          'E-commerce Platform', 'Browser Extension', 'Python Automation Script', 'Shopify Store',
          'Cybersecurity Audit', 'Desktop Application', 'React Component Library', 'Backend Development',
          'Blockchain Integration', 'DevOps Pipeline', 'Game Development', 'Landing Page'
        ]
      },
      {
        name: 'Design & Creative',
        basePrice: 50,
        services: [
          'Logo Design', 'UI/UX Mobile Design', 'Brand Identity', 'Business Cards',
          'Infographic Design', 'Character Illustration', 'Social Media Graphics', 'Banner Ads',
          'Book Cover Design', 'Packaging Design', '3D Modeling', 'Presentation Design',
          'Vector Tracing', 'Flyer & Brochure', 'T-shirt Design', 'App Icon Design',
          'Twitch Overlays', 'NFT Art Collection', 'Concept Art', 'Mascot Design'
        ]
      },
      {
        name: 'Digital Marketing',
        basePrice: 75,
        services: [
          'Facebook Ads Management', 'Google Ads (SEM)', 'SEO Keyword Research', 'Social Media Management',
          'Email Marketing Campaign', 'Content Strategy', 'Influencer Marketing', 'Video Marketing',
          'Technical SEO Audit', 'Competitor Analysis', 'LinkedIn Profile Growth', 'E-commerce SEO',
          'App Store Optimization', 'Pinterest Marketing', 'Market Research', 'Copywriting for Ads',
          'Backlink Building', 'Local SEO Setup', 'Analytics Setup', 'Affiliate Marketing'
        ]
      },
      {
        name: 'Business & Finance',
        basePrice: 150,
        services: [
          'Business Plan Writing', 'Financial Modeling', 'Market Analysis', 'Investment Pitch Deck',
          'Legal Contract Drafting', 'Bookkeeping & Accounting', 'Tax Preparation', 'Virtual Assistant',
          'Project Management', 'Consulting Strategy', 'Risk Management', 'Grant Writing',
          'Lead Generation', 'HR Consulting', 'Sales Strategy', 'Supply Chain Management',
          'Crypto Financial Analysis', 'Mergers & Acquisitions', 'Real Estate Analysis', 'Customer Support'
        ]
      }
    ];

    const allImageIds = [
      '1498050108023-c5249f4df085', '1555066931-4365d14bab8c', '1517694712202-14dd9538aa97', 
      '1587620962725-abab7fe55159', '1550745165-9bc0b252726f', '1461749280684-dccba630e2f6',
      '1531297484001-80022131f5a1', '1504639725590-34d0984388bd', '1510915228340-29c85a43dcfe',
      '1525547718571-0396c71e998b', '1515879218367-8466d910aaa4', '1581091226825-a6a2a5aee158',
      '1537498425277-c283d32ef9db', '1519389950473-47ba0277781c', '1504384308090-c894fdcc538d',
      '1551434678-e076c223a692', '1518433278981-d1302d130601', '1508870803464-f0548ca28dd8',
      '1553877522-43269d4ea984', '1561070791-2526d30994b5', '1581291518857-4e27b48ff24e',
      '1626785774573-4b799315345d', '1558655146-d09347e92766', '1618005182384-a83a8bd57fbe',
      '1550684848-fac1c5b4e853', '1541462608141-ad60397d5873', '1551650975-87deedd944c3',
      '1586717791821-3f44a563eb4e', '1523726491678-bf852e717f6a', '1513364776144-60967b0f800f',
      '1576153192396-180ecef2a715', '1509343256512-d77a5cb3791b', '1560155016-bd4879ae8f21',
      '1545235617-9465d2a55698', '1516035069371-29a1b244cc32', '1524758631624-e2822e304c36',
      '1558591710-4b4a1ae0f04d', '1550684847-75bdda728b72', '1533750349088-cd871a92f312',
      '1460925895917-afdab827c52f', '1432888622747-4eb9a8efeb07', '1557838923-2985c318be48',
      '1504868584819-f8e8b4b6d7e3', '1551288049-bebda4e38f71', '1553484771-047a44eee27b',
      '1454165833767-027eeef1593e', '1535303311164-664fc9ec673c', '1557838923-2985c318be48',
      '1507679799987-c23771e0d4fc', '1551836022-d5d91c35653f', '1556761175-5973cf0f3d0f',
      '1450101496163-993d56fc2c27', '1522071820081-009f0129c71c', '1441897792490-08c70d996495',
      '1517048676732-d65bc937f952', '1521737604893-d14cc237f11d', '1552664730-d307ca884978',
      '1543286386-7131fe9e1c7b', '1553729450-45d0d45b0450', '1504384308090-c894fdcc538d',
      '1423666639097-f134f5df9076', '1451187580237-19fd90bad8d3', '1504384308090-c894fdcc538d',
      '1516321496625-f8d4514533da', '1533090161767-e741162186e3', '1453916976241-47024f2824c3',
      '1519389483193-9520e3a3930d', '1531297484001-80022131f5a1', '1556761175-5973cf0f3d0f',
      '1517248135443-41527a4d4b1a', '1542744173-8e7e53415bb0', '1557425958-57c45749a30c',
      '1515372039744-b29f3021961e', '1504384308090-c894fdcc538d', '1519389950473-47ba0277781c',
      '1460925895917-afdab827c52f', '1522202176988-66273c2fd55f', '1531403009284-440f080d1e12',
      '1526318896947-f82b97465ae1', '1504868584819-f8e8b4b6d7e3', '1551288049-bebda4e38f71',
      '1553484771-047a44eee27b', '1551434678-e076c223a692', '1454165833767-027eeef1593e',
      '1535303311164-664fc9ec673c', '1557838923-2985c318be48', '1507679799987-c23771e0d4fc'
    ];

    let totalGigsCount = 0;
    for (const config of categoryConfigs) {
      for (let i = 0; i < config.services.length; i++) {
        const service = config.services[i];
        const freelancer = createdUsers[totalGigsCount % createdUsers.length];
        
        // Ensure unique image by using the global count to pick from the large pool
        const imageId = allImageIds[totalGigsCount % allImageIds.length];
        
        const gig = await Gig.create({
          title: `I will provide professional ${service} services`,
          description: `Get high-quality ${service} for your project. I have years of experience in ${config.name} and guarantee professional results.\n\nIncluded in this gig:\n- ${service} expertise\n- Fast turnaround\n- High quality results\n- Full support`,
          category: config.name,
          tags: [config.name.split(' ')[0].toLowerCase(), 'pro', 'professional', service.toLowerCase()],
          price: config.basePrice + (Math.floor(Math.random() * 20) * 5),
          deliveryTime: Math.floor(Math.random() * 5) + 2,
          revisions: Math.floor(Math.random() * 5) + 1,
          // Add a unique timestamp/random signature to every single image URL
          images: [`https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80&random=${totalGigsCount}`],
          freelancerId: freelancer._id,
          freelancerName: freelancer.name,
          freelancerAvatar: freelancer.avatar,
          rating: (3.8 + Math.random() * 1.2).toFixed(1),
          reviewsCount: Math.floor(Math.random() * 100) + 10,
        });
        
        expandedGigs.push(gig);
        totalGigsCount++;
      }
      console.log(`✅ Generated ${config.services.length} unique gigs for ${config.name}`);
    }

    // Add some Writing & Video gigs too to keep it balanced
    for (const gigData of gigTemplates) {
      if (['Writing & Translation', 'Video & Animation', 'Music & Audio'].includes(gigData.category)) {
        const freelancer = createdUsers[gigData.freelancerIndex];
        const gig = await Gig.create({
          ...gigData,
          freelancerId: freelancer._id,
          freelancerName: freelancer.name,
          freelancerAvatar: freelancer.avatar,
          rating: (3.5 + Math.random() * 1.5).toFixed(1),
          reviewsCount: Math.floor(Math.random() * 50) + 5,
        });
        expandedGigs.push(gig);
      }
    }

    // Create some orders
    const client = createdUsers.find(u => u.role === 'client' || u.role === 'both');
    const statuses = ['pending', 'accepted', 'in-progress', 'completed'];
    for (let i = 0; i < 8; i++) {
      const gig = expandedGigs[i];
      await Order.create({
        clientId: client._id,
        freelancerId: gig.freelancerId,
        gigId: gig._id,
        gigTitle: gig.title,
        amount: gig.price,
        status: statuses[i % 4],
        message: `Hi! I'm interested in your service. Looking forward to working with you!`,
      });
    }

    console.log('\n🎉 Database seeded with 80+ diverse gigs successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
