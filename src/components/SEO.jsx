import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image }) {
  const siteUrl = "https://mpatin-portfolio.vercel.app"; // Ton URL finale
  const defaultTitle = "Mathéo PATIN | SysAdmin & Développeur";
  const defaultDescription = "Portfolio interactif style Terminal. Étudiant en Administration Système, Réseaux et Développement Web.";
  const defaultImage = "/og-image.png"; // Ta capture d'écran dans public/

  return (
    <Helmet>
      {/* Standard */}
      <title>{title ? `${title} | Mathéo PATIN` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* Facebook / Discord / LinkedIn (Open Graph) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={`${siteUrl}${image || defaultImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={`${siteUrl}${image || defaultImage}`} />
    </Helmet>
  );
}