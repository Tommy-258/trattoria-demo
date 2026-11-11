/**
 * Single source of truth for every restaurant detail shown on the site,
 * used in metadata and in schema.org structured data.
 *
 * Trattoria Bella Napoli is a fictional restaurant created for a portfolio demo.
 * Address, phone number and social handles are placeholders.
 */

export type DishCategory = "antipasti" | "pizza" | "pasta" | "dolci";

export type Dish = {
  name: string;
  description: string;
  price: number;
  vegetarian?: boolean;
  spicy?: boolean;
};

export type OpeningHours = {
  /** Human-readable label, e.g. "Tue – Thu" */
  label: string;
  /** schema.org day names covered by this row */
  days: ReadonlyArray<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday">;
  /** 24h "HH:MM", or null when closed */
  opens: string | null;
  closes: string | null;
};

export const restaurant = {
  name: "Trattoria Bella Napoli",
  shortName: "Bella Napoli",
  tagline: "Wood-fired Neapolitan cooking, made by family since 1987.",
  description:
    "A family-run Neapolitan trattoria in Brooklyn, New York. Wood-fired pizza, handmade pasta and slow Sunday sauce, served the way Nonna taught us.",
  foundedYear: 1987,
  cuisine: ["Italian", "Neapolitan", "Pizza"],
  priceRange: "$$",

  address: {
    street: "248 Court Street",
    city: "Brooklyn",
    region: "NY",
    postalCode: "11201",
    country: "US",
    neighborhood: "Cobble Hill",
  },
  geo: { latitude: 40.6866, longitude: -73.9935 },

  phone: { display: "(718) 555-0142", e164: "+17185550142" },
  email: "ciao@bellanapoli.example",

  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },

  hours: [
    { label: "Monday", days: ["Monday"], opens: null, closes: null },
    { label: "Tue – Thu", days: ["Tuesday", "Wednesday", "Thursday"], opens: "17:00", closes: "22:00" },
    { label: "Fri – Sat", days: ["Friday", "Saturday"], opens: "17:00", closes: "23:00" },
    { label: "Sunday", days: ["Sunday"], opens: "12:00", closes: "21:00" },
  ] satisfies ReadonlyArray<OpeningHours>,

  reservations: {
    maxGuests: 8,
    /** Earliest and latest bookable times, 24h "HH:MM" */
    earliest: "12:00",
    latest: "21:30",
    largePartyNote: "For parties of 9 or more, please call us directly.",
  },

  menuCategories: [
    { id: "antipasti", label: "Antipasti" },
    { id: "pizza", label: "Pizza" },
    { id: "pasta", label: "Pasta" },
    { id: "dolci", label: "Dolci" },
  ] satisfies ReadonlyArray<{ id: DishCategory; label: string }>,

  menu: {
    antipasti: [
      {
        name: "Burrata Pugliese",
        description: "Creamy burrata, heirloom tomatoes, basil oil and grilled country bread.",
        price: 18,
        vegetarian: true,
      },
      {
        name: "Arancini Napoletani",
        description: "Crispy rice balls filled with ragù, peas and melted provola.",
        price: 14,
      },
      {
        name: "Polpo alla Griglia",
        description: "Charred octopus, crushed potatoes, Calabrian chili and lemon.",
        price: 21,
        spicy: true,
      },
      {
        name: "Frittatine di Pasta",
        description: "Fried bucatini bites with béchamel, peas and pecorino — a Naples street classic.",
        price: 12,
        vegetarian: true,
      },
    ],
    pizza: [
      {
        name: "Margherita",
        description: "San Marzano tomatoes, fior di latte, basil and extra-virgin olive oil.",
        price: 19,
        vegetarian: true,
      },
      {
        name: "Diavola",
        description: "Tomato, fior di latte, spicy salame Napoli and chili honey.",
        price: 23,
        spicy: true,
      },
      {
        name: "Marinara",
        description: "Tomato, garlic, wild oregano and olive oil. No cheese, all tradition.",
        price: 16,
        vegetarian: true,
      },
      {
        name: "Salsiccia e Friarielli",
        description: "Smoked mozzarella, fennel sausage and bitter broccoli rabe.",
        price: 24,
      },
    ],
    pasta: [
      {
        name: "Spaghetti alle Vongole",
        description: "Littleneck clams, garlic, white wine, parsley and a pinch of chili.",
        price: 27,
        spicy: true,
      },
      {
        name: "Gnocchi alla Sorrentina",
        description: "Potato gnocchi baked with tomato, mozzarella and basil.",
        price: 22,
        vegetarian: true,
      },
      {
        name: "Ragù della Domenica",
        description: "Rigatoni with our eight-hour Sunday ragù of beef and pork.",
        price: 26,
      },
      {
        name: "Penne all'Arrabbiata",
        description: "Tomato, garlic and plenty of chili, finished with pecorino.",
        price: 20,
        vegetarian: true,
        spicy: true,
      },
    ],
    dolci: [
      {
        name: "Tiramisù della Casa",
        description: "Espresso-soaked savoiardi, mascarpone cream and cocoa.",
        price: 11,
        vegetarian: true,
      },
      {
        name: "Babà al Rum",
        description: "Classic Neapolitan rum cake with whipped cream and amarena cherries.",
        price: 12,
        vegetarian: true,
      },
      {
        name: "Sfogliatella",
        description: "Crisp layered pastry filled with ricotta, semolina and candied orange.",
        price: 9,
        vegetarian: true,
      },
      {
        name: "Affogato",
        description: "Vanilla gelato drowned in a shot of hot espresso.",
        price: 8,
        vegetarian: true,
      },
    ],
  } satisfies Record<DishCategory, ReadonlyArray<Dish>>,

  reviews: [
    {
      quote:
        "The Margherita is the closest thing to Naples I've found in New York. Blistered crust, bright sauce, perfect.",
      author: "Sample guest",
      rating: 5,
    },
    {
      quote:
        "Warm, family atmosphere and the Sunday ragù tastes like it's been cooking all day — because it has.",
      author: "Sample guest",
      rating: 5,
    },
    {
      quote: "Great spot for date night. Save room for the babà — the staff wasn't kidding about it.",
      author: "Sample guest",
      rating: 5,
    },
  ],
} as const;

/** Base URL of the site, read from NEXT_PUBLIC_SITE_URL (no trailing slash). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const fullAddress = `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.region} ${restaurant.address.postalCode}`;

export const mapsQuery = encodeURIComponent(`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.region}`);

/** Format "17:00" as "5 PM" / "9:30 PM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}
