/**
 * Sri Tech Engineering – Project Gallery Data
 * Uses real images from /public/projects/ folder
 *
 * Image counts per project:
 *   Smart City  : 5  → smartcity-1.jpg … smartcity-5.jpg
 *   IOCL        : 3  → iocl-1.jpg … iocl-3.jpg
 *   SIDCO       : 6  → sidco-1.jpg … sidco-6.jpg
 *   Railway     : 4  → railway-1.jpg … railway-4.jpg
 *   Food        : 3  → food-1.jpg … food-3.jpg
 *   SPM         : 2  → spm-1.jpg … spm-2.jpg
 *   3D Printing : 3  → 3dprint-1.jpg … 3dprint-3.jpg
 *   EV          : 4  → ev-1.jpg … ev-4.jpg
 *   Solar/TEG   : 3  → solar-1.jpg … solar-3.jpg
 */

export const GALLERY_PROJECTS = [
    {
        id: 1,
        title: 'National Highways Smart City – Madurai',
        category: 'Smart City',
        description:
            'Hoarding board installation on national highways for Smart City project, Madurai. LED display boards and large-format signages mounted along NH corridors for smart traffic and city information systems.',
        client: 'JMC Pvt. Ltd.',
        year: '2021',
        color: '#8b5cf6',
        images: [
            { src: '/projects/smartcity-1.jpg', alt: 'Smart City hoarding board installation on national highway Madurai – Sri Tech Engineering' },
            { src: '/projects/smartcity-2.jpg', alt: 'LED display board mounted on NH highway pole Smart City Madurai project' },
            { src: '/projects/smartcity-3.jpg', alt: 'Smart City digital signage board mounting work Sri Tech Engineering Namakkal' },
            { src: '/projects/smartcity-4.jpg', alt: 'Hoarding board structure fabrication for Smart City Madurai national highway' },
            { src: '/projects/smartcity-5.jpg', alt: 'Completed Smart City highway display board installation JMC project Madurai' },
        ],
    },
    {
        id: 2,
        title: 'IOCL – Spreaders, Hoarding Boards & Tanks',
        category: 'Oil & Gas',
        description:
            'Precision-fabricated fuel spreaders, hoarding boards, and storage tanks for Indian Oil Corporation (IOCL). All components fabricated to IOCL standards for safe fuel distribution infrastructure.',
        client: 'Indian Oil Corporation (IOCL)',
        year: '2021',
        color: '#f59e0b',
        images: [
            { src: '/projects/iocl-1.jpg', alt: 'IOCL fuel spreader precision fabricated at Sri Tech Engineering workshop Namakkal' },
            { src: '/projects/iocl-2.jpg', alt: 'IOCL storage tank fabrication welding work Sri Tech Engineering' },
            { src: '/projects/iocl-3.jpg', alt: 'Completed IOCL hoarding board and spreader units delivered to Indian Oil Corporation' },
        ],
    },
    {
        id: 3,
        title: 'SIDCO – PEB Structure',
        category: 'PEB',
        description:
            'Designed and erected the inaugural Pre-Engineered Building (PEB) structure in SIDCO Industrial Estate, setting the benchmark for future industrial constructions in the estate.',
        client: 'SIDCO Industrial Estate',
        year: '2021',
        color: '#10b981',
        images: [
            { src: '/projects/sidco-1.jpg', alt: 'SIDCO PEB structure steel frame erection in progress at industrial estate Namakkal' },
            { src: '/projects/sidco-2.jpg', alt: 'Pre-engineered building roofing work at SIDCO Industrial Estate Namakkal' },
            { src: '/projects/sidco-3.jpg', alt: 'SIDCO PEB structural steel columns and beams assembled Sri Tech Engineering' },
            { src: '/projects/sidco-4.jpg', alt: 'Completed SIDCO PEB structure exterior view industrial estate' },
            { src: '/projects/sidco-5.jpg', alt: 'SIDCO PEB building interior large clear span workshop space' },
            { src: '/projects/sidco-6.jpg', alt: 'First PEB structure handover at SIDCO Namakkal with Sri Tech Engineering team' },
        ],
    },
    {
        id: 4,
        title: 'Railway Sub-contracts – Wheels & Ladder',
        category: 'Railway',
        description:
            'Manufacturing of heavy-duty push trolley steel wheels and ladder assemblies for Indian Railways maintenance operations. Precision-machined to railway specifications for durability and safety.',
        client: 'Indian Railways (Sub-contract)',
        year: '2021',
        color: '#3b82f6',
        images: [
            { src: '/projects/railway-1.jpg', alt: 'Push trolley steel wheel machining on lathe machine Sri Tech Engineering Namakkal' },
            { src: '/projects/railway-2.jpg', alt: 'Completed batch of railway steel wheels quality inspection Sri Tech Engineering' },
            { src: '/projects/railway-3.jpg', alt: 'Railway ladder assembly welding in progress Sri Tech Engineering' },
            { src: '/projects/railway-4.jpg', alt: 'Finished railway steel ladders ready for delivery to Indian Railways sub-contract' },
        ],
    },
    {
        id: 5,
        title: 'Food Processing Machines – VCO & Curd Machine',
        category: 'Food Processing',
        description:
            'Complete Virgin Coconut Oil (VCO) processing plant machinery and industrial curd churning machine fabricated with stainless steel food-grade construction for hygienic processing.',
        client: 'Food Processing Clients',
        year: '2022',
        color: '#14b8a6',
        images: [
            { src: '/projects/food-1.jpg', alt: 'VCO virgin coconut oil processing machine fabricated by Sri Tech Engineering Namakkal' },
            { src: '/projects/food-2.jpg', alt: 'Stainless steel food grade VCO plant components Sri Tech Engineering' },
            { src: '/projects/food-3.jpg', alt: 'Industrial curd churning machine SS 316 grade construction food processing client' },
        ],
    },
    {
        id: 6,
        title: 'SPM – Plate Making Machine',
        category: 'SPM',
        description:
            'Custom Special Purpose Machine (SPM) for precision plate making operations, designed and delivered to SP Machineries, Chennai. Fully automated with PLC controls for high-throughput plate fabrication.',
        client: 'SP Machineries, Chennai',
        year: '2022',
        color: '#f97316',
        images: [
            { src: '/projects/spm-1.jpg', alt: 'Plate making SPM special purpose machine fabrication Sri Tech Engineering Namakkal' },
            { src: '/projects/spm-2.jpg', alt: 'Completed SPM plate making machine delivered to SP Machineries Chennai' },
        ],
    },
    {
        id: 7,
        title: '3D Printing – Prototypes & CAD Models',
        category: '3D Printing',
        description:
            'Series of rapid-prototyped industrial components using FDM and SLA 3D printing with full reverse engineering workflows. CAD models in SolidWorks, CATIA, and CREO for accurate fitment.',
        client: 'Various Clients',
        year: '2023',
        color: '#6366f1',
        images: [
            { src: '/projects/3dprint-1.jpg', alt: '3D printed industrial prototype component FDM printer Sri Tech Engineering Namakkal' },
            { src: '/projects/3dprint-2.jpg', alt: 'SLA 3D printed high detail prototype reverse engineering project Sri Tech' },
            { src: '/projects/3dprint-3.jpg', alt: 'CAD model SolidWorks 3D printed prototype reverse engineering Sri Tech Engineering' },
        ],
    },
    {
        id: 8,
        title: 'EV Design – Electric Two & Three Wheeler',
        category: 'EV Design',
        description:
            'Complete electric two-wheeler and three-wheeler prototype development — frame design, motor integration, battery management system, and performance testing for EV startup clients.',
        client: 'EV Startup Clients',
        year: '2024',
        color: '#22c55e',
        images: [
            { src: '/projects/ev-1.jpg', alt: 'Electric two-wheeler prototype frame design fabrication Sri Tech Engineering Namakkal' },
            { src: '/projects/ev-2.jpg', alt: 'EV motor integration battery pack mounting two-wheeler chassis Sri Tech' },
            { src: '/projects/ev-3.jpg', alt: 'Electric three-wheeler auto rickshaw prototype custom EV drivetrain Sri Tech' },
            { src: '/projects/ev-4.jpg', alt: 'EV prototype road test performance evaluation Sri Tech Engineering Namakkal' },
        ],
    },
    {
        id: 9,
        title: 'Parabolic Water Heater with TEG',
        category: 'Energy',
        description:
            'Innovative parabolic solar water heater integrated with a thermoelectric generator (TEG) for dual energy harvesting — simultaneous hot water production and electricity generation from solar energy.',
        client: 'Research Project',
        year: '2023',
        color: '#ef4444',
        images: [
            { src: '/projects/solar-1.jpg', alt: 'Parabolic solar water heater TEG module installed outdoors Sri Tech Engineering research' },
            { src: '/projects/solar-2.jpg', alt: 'Thermoelectric generator TEG module parabolic collector focus point research Sri Tech' },
            { src: '/projects/solar-3.jpg', alt: 'Parabolic reflector dish fabrication solar water heater TEG project Namakkal' },
        ],
    },
];

export const CATEGORY_COLOR_MAP = {
    'Smart City': '#8b5cf6',
    'Oil & Gas': '#f59e0b',
    PEB: '#10b981',
    Railway: '#3b82f6',
    'Food Processing': '#14b8a6',
    SPM: '#f97316',
    '3D Printing': '#6366f1',
    'EV Design': '#22c55e',
    Energy: '#ef4444',
    IOCL: '#f59e0b',
    SIDCO: '#10b981',
    'Food Machines': '#14b8a6',
    EV: '#22c55e',
    All: '#ff6b2b',
};
