/**
 * SEO.jsx — Sri Tech Engineering
 * High-ranking SEO: rich meta, Open Graph, Twitter Card,
 * full JSON-LD (Organization, LocalBusiness, WebSite,
 * ImageGallery, Service list, BreadcrumbList)
 */
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://sritechengineering.in';
const LOGO    = 'https://i.ibb.co/GrLcQ3N/civil.png';

const TITLE = 'Sri Tech Engineering – Precision Manufacturing Namakkal | Agro, PEB, EV, 3D Printing';

const DESCRIPTION =
    'Sri Tech Engineering, Namakkal – Leading precision manufacturer of Agro & Poultry Machinery, Food Processing Machines, PEB Structures, Material Fabrication, 3D Printing, EV Design & Railway components. IOCL, SIDCO & Indian Railways certified contractor. Founded by Sankarganesh R – B.E. Mech, M.Tech Energy. Call us today!';

const KEYWORDS = [
    // Brand
    'Sri Tech Engineering', 'Sri Tech Engineering Namakkal', 'sritechengineering.in',
    // Founder
    'Sankarganesh R engineer', 'Sankarganesh Namakkal',
    // Core services
    'agro machinery manufacturer Namakkal', 'food processing machine manufacturer Tamil Nadu',
    'PEB structure manufacturer Namakkal', 'pre-engineered building Tamil Nadu',
    'material fabrication engineering Namakkal', 'structural steel fabrication Namakkal',
    '3D printing service Namakkal', '3D printing Tamil Nadu', 'reverse engineering Namakkal',
    'EV design development Namakkal', 'electric vehicle prototype Tamil Nadu',
    'poultry machinery manufacturer', 'VCO machine manufacturer',
    'curd churning machine manufacturer India', 'special purpose machine SPM Chennai',
    // Project clients
    'IOCL contractor Tamil Nadu', 'SIDCO PEB structure Namakkal',
    'Indian Railways sub-contractor', 'smart city highway Madurai',
    'JMC projects hoarding board', 'SP Machineries plate making machine',
    // Location long-tail
    'engineering company Namakkal', 'manufacturing company Rasipuram',
    'industrial fabrication Namakkal', 'machinery manufacturer Namakkal Tamil Nadu',
    'engineering works Athanoor', 'mechanical engineering Namakkal',
    // Services SEO
    'beyond technology engineering', 'precision engineering Namakkal',
    'parabolic solar water heater TEG', 'thermoelectric generator research',
    'EV two wheeler three wheeler prototype', 'SolidWorks CATIA design service',
].join(', ');

/* ── JSON-LD SCHEMAS ── */
const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sri Tech Engineering',
    alternateName: 'SriTech Engineering',
    url: BASE_URL,
    logo: LOGO,
    description: DESCRIPTION,
    foundingDate: '2020',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 10 },
    address: {
        '@type': 'PostalAddress',
        streetAddress: '2/117, Mettukadu, Athanoor, Rasipuram (T.K)',
        addressLocality: 'Namakkal',
        postalCode: '636 301',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
    },
    contactPoint: [
        {
            '@type': 'ContactPoint',
            email: 'sritechengineering8@gmail.com',
            contactType: 'customer service',
            availableLanguage: ['en', 'ta'],
            areaServed: 'IN',
        },
    ],
    founder: {
        '@type': 'Person',
        name: 'Sankarganesh R',
        jobTitle: 'CEO & Founder',
        alumniOf: 'B.E Mechanical Engineering, M.Tech Energy Technology',
    },
    sameAs: [],
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Engineering Services',
        itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Agro & Poultry Machinery Manufacturing' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Food Processing Machine Fabrication' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pre-Engineered Buildings (PEB)' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Material Fabrication & Engineering Works' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '3D Printing & Reverse Engineering' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Electric Vehicle (EV) Design & Development' } },
        ],
    },
};

const jsonLdLocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BASE_URL,
    name: 'Sri Tech Engineering',
    image: LOGO,
    url: BASE_URL,
    telephone: '+91-98765-43210',
    email: 'sritechengineering8@gmail.com',
    description: DESCRIPTION,
    priceRange: '$$',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Bank Transfer, UPI',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '2/117, Mettukadu, Athanoor, Rasipuram (T.K)',
        addressLocality: 'Namakkal',
        postalCode: '636 301',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 11.4542,
        longitude: 78.1722,
    },
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '18:00',
        },
    ],
    hasMap: 'https://maps.google.com/?q=Athanoor,Namakkal,Tamil+Nadu',
    areaServed: {
        '@type': 'State',
        name: 'Tamil Nadu',
    },
};

const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sri Tech Engineering',
    url: BASE_URL,
    description: 'Sri Tech Engineering – Beyond Technology. Precision manufacturing of Agro, Food & Poultry Machineries, Material Fabrication and Engineering Works in Namakkal.',
    potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
};

const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/#about` },
        { '@type': 'ListItem', position: 3, name: 'Services', item: `${BASE_URL}/#services` },
        { '@type': 'ListItem', position: 4, name: 'Projects', item: `${BASE_URL}/#projects` },
        { '@type': 'ListItem', position: 5, name: 'Contact', item: `${BASE_URL}/#contact` },
    ],
};

const jsonLdProjects = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sri Tech Engineering – Project Portfolio',
    description: 'Landmark engineering projects by Sri Tech Engineering across Smart City, Railways, IOCL, PEB, Food Processing, 3D Printing, EV Design and Energy sectors in Tamil Nadu.',
    url: `${BASE_URL}/#projects`,
    numberOfItems: 9,
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'National Highways Smart City – Madurai', description: 'Hoarding board installation on national highways for Smart City project, Madurai.' },
        { '@type': 'ListItem', position: 2, name: 'IOCL – Spreaders, Hoarding Boards & Tanks', description: 'Fuel spreaders, hoarding boards, and storage tanks for Indian Oil Corporation.' },
        { '@type': 'ListItem', position: 3, name: 'SIDCO – PEB Structure (First in Estate)', description: 'First Pre-Engineered Building structure in SIDCO Industrial Estate, Namakkal.' },
        { '@type': 'ListItem', position: 4, name: 'Railway Sub-contracts – Wheels & Ladder', description: 'Steel wheels and ladder assemblies for Indian Railways.' },
        { '@type': 'ListItem', position: 5, name: 'Food Processing Machines – VCO & Curd Machine', description: 'VCO plant and curd churning machine food-grade fabrication.' },
        { '@type': 'ListItem', position: 6, name: 'SPM – Plate Making Machine', description: 'Special Purpose Machine for precision plate making – SP Machineries Chennai.' },
        { '@type': 'ListItem', position: 7, name: '3D Printing – Prototypes & CAD Models', description: 'FDM/SLA 3D printing and reverse engineering service Namakkal.' },
        { '@type': 'ListItem', position: 8, name: 'EV Design – Electric Two & Three Wheeler', description: 'Electric vehicle prototype development Namakkal.' },
        { '@type': 'ListItem', position: 9, name: 'Parabolic Water Heater with TEG', description: 'Solar water heater with thermoelectric generator dual energy harvesting.' },
    ],
};

export default function SEO() {
    return (
        <Helmet>
            <html lang="en" />

            {/* ── Primary ── */}
            <title>{TITLE}</title>
            <meta name="description" content={DESCRIPTION} />
            <meta name="keywords" content={KEYWORDS} />
            <meta name="author" content="Sri Tech Engineering, Sankarganesh R" />
            <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <meta name="revisit-after" content="7 days" />
            <meta name="language" content="English" />
            <meta name="classification" content="Engineering, Manufacturing, Business" />
            <meta name="category" content="Manufacturing & Engineering" />
            <meta name="coverage" content="Tamil Nadu, India" />
            <meta name="distribution" content="Global" />
            <meta name="rating" content="General" />
            <link rel="canonical" href={BASE_URL} />

            {/* ── Geo / Local ── */}
            <meta name="geo.region" content="IN-TN" />
            <meta name="geo.placename" content="Namakkal, Tamil Nadu, India" />
            <meta name="geo.position" content="11.4542;78.1722" />
            <meta name="ICBM" content="11.4542, 78.1722" />

            {/* ── Open Graph ── */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={BASE_URL} />
            <meta property="og:title" content={TITLE} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:image" content={LOGO} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Sri Tech Engineering – Precision Manufacturing Namakkal" />
            <meta property="og:site_name" content="Sri Tech Engineering" />
            <meta property="og:locale" content="en_IN" />
            <meta property="business:contact_data:street_address" content="2/117, Mettukadu, Athanoor, Rasipuram" />
            <meta property="business:contact_data:locality" content="Namakkal" />
            <meta property="business:contact_data:region" content="Tamil Nadu" />
            <meta property="business:contact_data:postal_code" content="636 301" />
            <meta property="business:contact_data:country_name" content="India" />
            <meta property="business:contact_data:email" content="sritechengineering8@gmail.com" />

            {/* ── Twitter Card ── */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@SriTechEngineering" />
            <meta name="twitter:title" content={TITLE} />
            <meta name="twitter:description" content={DESCRIPTION} />
            <meta name="twitter:image" content={LOGO} />
            <meta name="twitter:image:alt" content="Sri Tech Engineering – Precision Manufacturing Namakkal" />

            {/* ── Mobile / PWA ── */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta name="theme-color" content="#ff6b2b" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="Sri Tech Engineering" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="format-detection" content="telephone=yes" />

            {/* ── JSON-LD Structured Data ── */}
            <script type="application/ld+json">{JSON.stringify(jsonLdOrg)}</script>
            <script type="application/ld+json">{JSON.stringify(jsonLdLocalBusiness)}</script>
            <script type="application/ld+json">{JSON.stringify(jsonLdWebSite)}</script>
            <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumb)}</script>
            <script type="application/ld+json">{JSON.stringify(jsonLdProjects)}</script>
        </Helmet>
    );
}
