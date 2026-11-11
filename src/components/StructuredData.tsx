import { restaurant, siteUrl } from "@/config/restaurant";

/** schema.org Restaurant data, generated entirely from the restaurant config. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl}/#restaurant`,
    name: restaurant.name,
    description: restaurant.description,
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    telephone: restaurant.phone.e164,
    email: restaurant.email,
    priceRange: restaurant.priceRange,
    servesCuisine: restaurant.cuisine,
    foundingDate: String(restaurant.foundedYear),
    acceptsReservations: true,
    hasMenu: `${siteUrl}/#menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.city,
      addressRegion: restaurant.address.region,
      postalCode: restaurant.address.postalCode,
      addressCountry: restaurant.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.geo.latitude,
      longitude: restaurant.geo.longitude,
    },
    openingHoursSpecification: restaurant.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
        opens: h.opens,
        closes: h.closes,
      })),
    sameAs: [restaurant.social.instagram, restaurant.social.facebook],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; "<" is escaped to prevent breaking out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
