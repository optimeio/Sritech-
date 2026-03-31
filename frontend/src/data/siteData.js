// Site Data for Sri Tech Engineering
export const COMPANY = {
    name: 'Sri Tech Engineering',
    tagline: 'Beyond Technology',
    email: 'sritechengineering8@gmail.com',
    phone: '+91 98765 43210',
    address: '2/117, Mettukadu, Athanoor, Rasipuram (T.K), Namakkal – 636 301',
    units: ['Athanoor Unit', 'Vaiyappamalai Unit'],
    founded: 2020,
    logo: 'https://i.ibb.co/GrLcQ3N/civil.png',
    founder: {
        name: 'Sankarganesh R',
        qual: 'B.E (Mechanical), M.Tech (Energy Technology)',
        roles: ['Designer', 'Trainer', 'Team Coordinator', 'Team Leader', 'Project Head', 'CEO & Founder'],
        achievements: [
            '10+ years of experience in precision engineering',
            'Led IOCL, SIDCO, Railways mega-projects',
            'Pioneer in EV Design & 3D Printing in Namakkal',
            'Delivered 500+ projects across multiple industries',
            'First PEB Structure in SIDCO Industrial Estate',
        ],
    },
};

export const SERVICES = [
    {
        id: 1,
        title: 'Agro & Poultry Machinery',
        desc: 'Custom-engineered machinery for agriculture and poultry industries — precision-built for maximum productivity and minimal downtime.',
        icon: 'tractor',
        color: '#2a6e3f',
    },
    {
        id: 2,
        title: 'Food Processing Machines',
        desc: 'Hygienic, high-efficiency food processing equipment including VCO plants, curd churning machines, and custom food-grade fabrications.',
        icon: 'utensils',
        color: '#7e4a1e',
    },
    {
        id: 3,
        title: 'Material Fabrication & Engineering',
        desc: 'End-to-end structural steel fabrication, sheet metal work, welding, and precision machining for industrial and commercial applications.',
        icon: 'hammer',
        color: '#1e3a5f',
    },
    {
        id: 4,
        title: 'Pre-Engineered Buildings (PEB)',
        desc: 'Design, fabrication, and erection of PEB structures for factories, warehouses, and commercial spaces with engineering precision.',
        icon: 'building',
        color: '#3a1e5f',
    },
    {
        id: 5,
        title: '3D Printing & Reverse Engineering',
        desc: 'Rapid prototyping via industrial 3D printing and reverse engineering of existing components using advanced 3D scanning technology.',
        icon: 'layers',
        color: '#1e5f5a',
    },
    {
        id: 6,
        title: 'EV Design & Development',
        desc: 'Electric two-wheeler and three-wheeler prototype development — from concept design to working prototype using modern EV engineering.',
        icon: 'zap',
        color: '#5f4a1e',
    },
];

export const PROJECTS = [
    {
        id: 1,
        name: 'Smart City Hoarding Boards',
        client: 'National Highways – Madurai',
        desc: 'Installation of large-format hoarding and display boards for Smart City project along National Highways, Madurai.',
        category: 'Smart City',
        tags: ['Smart City', 'Highways'],
    },
    {
        id: 2,
        name: 'Fuel Spreaders & Storage Tanks',
        client: 'Indian Oil Corporation (IOCL)',
        desc: 'Precision-fabricated fuel spreaders, hoarding boards, and storage tanks for IOCL fuel distribution infrastructure.',
        category: 'IOCL',
        tags: ['IOCL', 'Oil & Gas'],
    },
    {
        id: 3,
        name: 'First PEB Structure – SIDCO',
        client: 'SIDCO Industrial Estate',
        desc: 'Designed and erected the inaugural Pre-Engineered Building structure in SIDCO Industrial Estate, setting the standard for future builds.',
        category: 'PEB',
        tags: ['PEB', 'SIDCO'],
    },
    {
        id: 4,
        name: 'Push Trolley Steel Wheel',
        client: 'Indian Railways (Sub-contract)',
        desc: 'Manufacturing of heavy-duty push trolley steel wheels and ladder assemblies for Indian Railways maintenance operations.',
        category: 'Railway',
        tags: ['Railway'],
    },
    {
        id: 5,
        name: 'Ladder Assembly',
        client: 'Indian Railways (Sub-contract)',
        desc: 'Precision-welded steel ladder assemblies for railway maintenance and access systems.',
        category: 'Railway',
        tags: ['Railway'],
    },
    {
        id: 6,
        name: 'VCO Plant Machine',
        client: 'Food Processing Client',
        desc: 'Complete Virgin Coconut Oil (VCO) processing plant machinery from concept to commissioning.',
        category: 'Food Machines',
        tags: ['Food Machines'],
    },
    {
        id: 7,
        name: 'Curd Churning Machine',
        client: 'Dairy Processing Unit',
        desc: 'Industrial curd churning machine with stainless steel food-grade construction for dairy processing.',
        category: 'Food Machines',
        tags: ['Food Machines'],
    },
    {
        id: 8,
        name: 'Plate Making SPM',
        client: 'SP Machineries, Chennai',
        desc: 'Custom Special Purpose Machine (SPM) for precision plate making operations, designed and delivered to SP Machineries.',
        category: 'SPM',
        tags: ['SPM'],
    },
    {
        id: 9,
        name: 'Industrial Prototype Series',
        client: 'Various Clients',
        desc: 'Series of rapid-prototyped industrial components using FDM and SLA 3D printing with full reverse engineering workflows.',
        category: '3D Printing',
        tags: ['3D Printing'],
    },
    {
        id: 10,
        name: 'Electric Two-Wheeler Prototype',
        client: 'EV Startup',
        desc: 'Complete electric two-wheeler prototype development — frame design, motor integration, battery management, and testing.',
        category: 'EV',
        tags: ['EV'],
    },
    {
        id: 11,
        name: 'Electric Three-Wheeler Prototype',
        client: 'EV Startup',
        desc: 'Electric three-wheeler (auto) conversion prototype with custom chassis engineering and EV drivetrain.',
        category: 'EV',
        tags: ['EV'],
    },
    {
        id: 12,
        name: 'Parabolic Solar Water Heater + TEG',
        client: 'Research Project',
        desc: 'Innovative parabolic solar water heater integrated with a thermoelectric generator for dual energy harvesting.',
        category: '3D Printing',
        tags: ['3D Printing', 'Energy'],
    },
];

export const PROJECT_CATEGORIES = ['All', 'Railway', 'IOCL', 'SIDCO', 'Smart City', 'PEB', 'Food Machines', 'SPM', '3D Printing', 'EV'];

export const INDUSTRIES = [
    { name: 'Agriculture & Poultry', icon: 'tractor', color: '#2a6e3f' },
    { name: 'Food Processing', icon: 'utensils', color: '#7e4a1e' },
    { name: 'Oil & Gas (IOCL)', icon: 'droplets', color: '#1e3a5f' },
    { name: 'Railways', icon: 'train', color: '#3a1e5f' },
    { name: 'Smart City & Highways', icon: 'map', color: '#1e5f5a' },
    { name: 'Construction & PEB', icon: 'building2', color: '#5f4a1e' },
    { name: 'Electric Vehicles', icon: 'zap', color: '#1e5f3a' },
    { name: 'Industrial Manufacturing', icon: 'factory', color: '#5f1e3a' },
];

export const PROCESS_STEPS = [
    { step: 1, title: 'Requirement Analysis', desc: 'Deep-dive client consultation to capture precise technical, functional and compliance requirements.', icon: 'clipboard-list' },
    { step: 2, title: 'Design & Engineering', desc: 'CAD/CAM modeling using SolidWorks, AutoCAD, CREO — simulation-validated for structural integrity.', icon: 'drafting-compass' },
    { step: 3, title: 'Prototyping', desc: 'Rapid prototyping via 3D printing and metal mockups for fit-form-function validation before production.', icon: 'layers' },
    { step: 4, title: 'Manufacturing', desc: 'Precision fabrication at our Athanoor & Vaiyappamalai units with strict QC checkpoints.', icon: 'factory' },
    { step: 5, title: 'Delivery & Support', desc: 'On-time delivery, on-site installation, commissioning, and after-sales technical support.', icon: 'truck' },
];

export const SKILLS = [
    { name: 'Agriculture & Agro Engineering', percent: 85 },
    { name: 'Engineering Design, Development & Research', percent: 70 },
    { name: 'Energy Technology', percent: 80 },
    { name: 'Training & Education', percent: 90 },
];

export const SOFTWARE = [
    'AutoCAD', 'SolidWorks', 'CREO', 'CATIA', 'ANSYS', 'Geomagic',
    'Inventor', 'Fusion 360', 'Revit', 'Tekla', 'NX CAD', 'SP3D',
];

export const TECH_TAGS = [
    'CNC Basics', 'Tool & Die Design', 'Sheet Metal', 'Mold Design',
    'Jigs & Fixtures', '3D Scanning', 'Reverse Engineering', 'PEB Design',
    'EV Development', 'NPD', 'Welding Techniques', 'Aerodynamics Basics',
];

export const CLIENTS = [
    'Infortica Skill Service Salem', 'Lakshmi Industrial Equipments Coimbatore',
    'Hammer Industries', 'Neka Industries', 'Bhuvnesh Engineering Services',
    'Sri Vinayaka Industries', 'AGRS Engineering', 'N.S Sheet Metal Works',
    'Sri Sairem Engineering', 'Arrira Industries Salem', 'Bright Brain Institute Salem',
    'SN Technologies Salem', 'SVM Constructions Namakkal', 'SP Machineries Chennai',
    'Sapphira Industries', 'Grand LED Salem', 'Vaammanan Agro Industry', 'Suryaprakash Builders',
];

export const GROUP_COMPANIES = [
    {
        name: 'Sri Tech Engineering',
        desc: 'Manufacturing of Agro, Food & Poultry Machineries | Material Fabrication & Engineering Works',
        units: 'Units in Athanoor & Vaiyappamalai, Namakkal',
        icon: 'factory',
        accent: '#ff6b2b',
    },
    {
        name: 'Sri Vel Associates',
        desc: 'Production, Transportation & Trading of Agro, Food & Poultry products including Raw Materials',
        units: 'Operations across Tamil Nadu',
        icon: 'truck',
        accent: '#1e8a4a',
    },
    {
        name: 'SM Groups',
        desc: 'Educating skills, providing industrial-oriented knowledge to students | Bridge between Students and Industry',
        units: 'Salem & Namakkal Branches',
        icon: 'graduation-cap',
        accent: '#8a4a1e',
    },
];

export const TESTIMONIALS = [
    {
        name: 'Rajesh Kumar',
        company: 'SP Machineries, Chennai',
        quote: 'Sri Tech Engineering delivered our SPM plate-making machine with exceptional precision. Their engineering expertise and on-time delivery exceeded our expectations completely.',
        rating: 5,
    },
    {
        name: 'Murugan S',
        company: 'SIDCO Industrial Estate',
        quote: 'The PEB structure they built for us was the first in our estate and set the benchmark. Professional team, quality fabrication, and excellent project management throughout.',
        rating: 5,
    },
    {
        name: 'Priya Dharshini',
        company: 'Vaammanan Agro Industry',
        quote: 'Our agro processing machinery from Sri Tech runs flawlessly since commissioning. The team understands agricultural requirements deeply and engineered a perfect solution for us.',
        rating: 5,
    },
];

export const MILESTONE_TIMELINE = [
    { year: 2016, title: 'Designer & Trainer', desc: 'Started career as a mechanical designer and industrial trainer in Salem.' },
    { year: 2018, title: 'Freelance Engineering', desc: 'Independent freelance engineering projects — design, prototyping, and client consulting.' },
    { year: 2020, title: 'Sri Tech Engineering Founded', desc: 'Founded Sri Tech Engineering in Namakkal with a vision for precision manufacturing.' },
    { year: 2021, title: 'IOCL, SIDCO & Railway Projects', desc: 'Secured landmark contracts with IOCL, SIDCO, and Indian Railways sub-contracting.' },
    { year: 2024, title: 'Expansion & Innovation', desc: 'Expanded to 2 units, launched EV design, 3D printing, and Smart City projects.' },
];
