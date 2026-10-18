import { Store } from './types';

export interface StoreCategory {
  name: string;
  stores: Store[];
}

export const storeCategories: StoreCategory[] = [
  {
    name: 'Online Marketplaces',
    stores: [
      {
        name: 'Amazon',
        description: 'Electronics, fashion, home appliances, and daily essentials at great prices.',
        link: 'https://www.amazon.in?tag=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Flipkart',
        description: 'Mobiles, fashion, electronics, and groceries with fast delivery.',
        link: 'https://www.flipkart.com?affid=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Meesho',
        description: 'Lowest-price fashion and home products for shoppers and resellers.',
        link: 'https://www.meesho.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Snapdeal',
        description: 'Budget-friendly fashion, home and lifestyle products.',
        link: 'https://www.snapdeal.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'ShopClues',
        description: 'Wholesale prices on electronics, fashion and daily essentials.',
        link: 'https://www.shopclues.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'IndiaMART',
        description: "India's largest B2B marketplace for bulk buying and business supplies.",
        link: 'https://www.indiamart.com?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Fashion & Lifestyle',
    stores: [
      {
        name: 'Myntra',
        description: 'Fashion, footwear and accessories from top Indian and global brands.',
        link: 'https://www.myntra.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Ajio',
        description: 'Trendy fashion, shoes and accessories from Reliance Retail.',
        link: 'https://www.ajio.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Tata CLiQ',
        description: 'Fashion, electronics and lifestyle products from the Tata group.',
        link: 'https://www.tatacliq.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'LimeRoad',
        description: 'Affordable fashion and lifestyle picks for men and women.',
        link: 'https://www.limeroad.com?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Beauty & Personal Care',
    stores: [
      {
        name: 'Nykaa',
        description: 'Beauty, cosmetics, skincare and wellness products.',
        link: 'https://www.nykaa.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Purplle',
        description: 'Beauty and personal care products at wallet-friendly prices.',
        link: 'https://www.purplle.com?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Grocery & Quick Commerce',
    stores: [
      {
        name: 'Blinkit',
        description: 'Quick 10-minute grocery delivery for your daily needs.',
        link: 'https://www.blinkit.com?referrer=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Zepto',
        description: 'Fast grocery and essentials delivery at your doorstep in minutes.',
        link: 'https://www.zeptonow.com?referral=YOUR_AFFILIATE_ID',
      },
      {
        name: 'BigBasket',
        description: "India's largest online grocery superstore for weekly shopping.",
        link: 'https://www.bigbasket.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'JioMart',
        description: 'Groceries, household items, and fashion at discounted prices.',
        link: 'https://www.jiomart.com?aff=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Food Delivery',
    stores: [
      {
        name: 'Swiggy',
        description: 'Food delivery from your favourite restaurants, fast and reliable.',
        link: 'https://www.swiggy.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Zomato',
        description: 'Restaurant discovery, food delivery and dining-out offers.',
        link: 'https://www.zomato.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: "Domino's",
        description: 'Pizza delivery with hot deals and everyday value offers.',
        link: 'https://www.dominos.co.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Rominos',
        description: 'Pizza and fast-food combos delivered hot to your door.',
        link: 'https://www.rominus.com?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Hotel Booking',
    stores: [
      {
        name: 'OYO Rooms',
        description: 'Budget hotels and rooms across India at affordable rates.',
        link: 'https://www.oyorooms.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Booking.com',
        description: 'Hotels, resorts and stays worldwide with free cancellation.',
        link: 'https://www.booking.com?aid=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Airbnb',
        description: 'Unique homes, apartments and experiences hosted by locals.',
        link: 'https://www.airbnb.co.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'MakeMyTrip Hotels',
        description: 'Hotel bookings with deals, combos and loyalty rewards.',
        link: 'https://www.makemytrip.com/hotels?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Travel Booking',
    stores: [
      {
        name: 'MakeMyTrip',
        description: 'Flights, trains, buses and holiday packages in one place.',
        link: 'https://www.makemytrip.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Goibibo',
        description: 'Flight, hotel and bus bookings with goCash rewards.',
        link: 'https://www.goibibo.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Yatra',
        description: 'Flights, hotels and holiday packages with corporate deals.',
        link: 'https://www.yatra.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Cleartrip',
        description: 'Simple flight and hotel bookings with transparent pricing.',
        link: 'https://www.cleartrip.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'EaseMyTrip',
        description: 'Zero-convenience-fee flight, hotel and bus bookings.',
        link: 'https://www.easemytrip.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'IRCTC',
        description: 'Official Indian Railways ticket booking and tour packages.',
        link: 'https://www.irctc.co.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'redBus',
        description: 'Bus ticket bookings across India with live tracking.',
        link: 'https://www.redbus.in?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Electronics & Appliances',
    stores: [
      {
        name: 'Reliance Digital',
        description: 'Latest electronics, gadgets, and appliances from trusted brands.',
        link: 'https://www.reliancedigital.in?affiliate=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Specialty Stores',
    stores: [
      {
        name: 'Lenskart',
        description: 'Eyeglasses, sunglasses and contact lenses with free home trials.',
        link: 'https://www.lenskart.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'FirstCry',
        description: 'Baby and kids products, clothing, toys and essentials.',
        link: 'https://www.firstcry.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Pepperfry',
        description: 'Furniture, home decor and furnishings for every room.',
        link: 'https://www.pepperfry.com?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Travel & Mobility',
    stores: [
      {
        name: 'Uber',
        description: 'Cabs, autos and bike rides across cities with fare offers.',
        link: 'https://www.uber.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Rapido',
        description: 'Bike taxis and autos for quick, affordable daily commutes.',
        link: 'https://rapido.bike?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Start Your Own Store',
    stores: [
      {
        name: 'Shopify',
        description: 'Launch your own online store with tools, themes and payments.',
        link: 'https://www.shopify.com/free-trial?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
];
