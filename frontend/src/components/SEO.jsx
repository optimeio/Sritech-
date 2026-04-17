/**
 * SEO.jsx — Sri Tech Engineering
 * High-ranking SEO: rich meta, Open Graph, Twitter Card,
 * full JSON-LD (Organization, LocalBusiness, WebSite,
 * ImageGallery, Service list, BreadcrumbList)
 */
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://sritechengg.in';
const LOGO = 'https://i.ibb.co/GrLcQ3N/civil.png';

const DEFAULT_TITLE = 'Sri Tech Engineering – Precision Manufacturing Namakkal | Agro, PEB, EV, 3D Printing';
const DEFAULT_DESCRIPTION =
    'Sri Tech Engineering, Namakkal – Leading precision manufacturer of Agro & Poultry Machinery, Food Processing Machines, PEB Structures, Material Fabrication, 3D Printing, EV Design & Railway components. Managed by visionary industrialist Sankarganesh R (CEO) and strategic expert Ganga P (MD). Excellence in Innovation & Sustainability. Contact us for world-class engineering solutions!';

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
    'Ganga P Managing Director', 'Ganga P commerce SM Groups', 'Innovation Sustainability Excellence',
    'Industrialist Sankarganesh R', 'Strategy Expert Ganga P', 'Namakkal Manufacturing Ecosystem',
    'Sustainable Precision Engineering', 'High-Impact Industrial Projects Tamil Nadu',
].join(', ');

/* ── JSON-LD SCHEMAS ── */
const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sri Tech Engineering',
    alternateName: 'SriTech Engineering',
    url: BASE_URL,
    logo: LOGO,
    description: DEFAULT_DESCRIPTION,
    foundingDate: '2020',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 10 },
    address: {
        '@type': 'PostalAddress',
        streetAddress: '11/1, Gurusamipalayam, Rasipuram',
        addressLocality: 'Namakkal',
        postalCode: '637403',
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
    founder: [
        {
            '@type': 'Person',
            name: 'Sankarganesh R',
            jobTitle: 'CEO & Founder',
        },
        {
            '@type': 'Person',
            name: 'Ganga P',
            jobTitle: 'Managing Director',
        }
    ]
};

const jsonLdLocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BASE_URL,
    name: 'Sri Tech Engineering',
    image: LOGO,
    url: BASE_URL,
    telephone: '+91-90433-40278',
    email: 'sritechengineering8@gmail.com',
    description: DEFAULT_DESCRIPTION,
    priceRange: '$$',
    currenciesAccepted: 'INR',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '11/1, Gurusamipalayam, Rasipuram',
        addressLocality: 'Namakkal',
        postalCode: '637403',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 11.4542,
        longitude: 78.1722,
    }
};

export default function SEO({ title, description, image, url }) {
    const seoTitle = title || DEFAULT_TITLE;
    const seoDescription = description || DEFAULT_DESCRIPTION;
    const seoUrl = url || BASE_URL;
    const seoImage = image || LOGO;

    return (
        <Helmet>
            <html lang="en" />

            {/* ── Primary ── */}
            <title>{seoTitle}</title>
            <meta name="description" content={seoDescription} />
            <meta name="keywords" content={KEYWORDS} />
            <meta name="author" content="Sri Tech Engineering" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={seoUrl} />

            {/* ── Open Graph ── */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:site_name" content="Sri Tech Engineering" />

            {/* ── Twitter Card ── */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDescription} />
            <meta name="twitter:image" content={seoImage} />

            {/* ── Mobile / PWA ── */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta name="theme-color" content="#ff6b2b" />
            <meta name="format-detection" content="telephone=yes" />

            {/* ── JSON-LD Structured Data ── */}
            <script type="application/ld+json">{JSON.stringify(jsonLdOrg)}</script>
            <script type="application/ld+json">{JSON.stringify(jsonLdLocalBusiness)}</script>
        </Helmet>
    );
}
