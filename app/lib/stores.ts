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
        link: 'https://fktr.in/4OT7HyJ',
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
  {
    name: 'Quick Commerce & Groceries',
    stores: [
      {
        name: 'Instamart',
        description: 'Get groceries and daily essentials delivered in minutes by Swiggy.',
        link: 'https://www.swiggy.com/instamart?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Smart Bazar',
        description: 'Reliance Smart Bazaar for groceries, fresh food and household needs.',
        link: 'https://www.reliancesmartbazaar.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'StarQuik',
        description: 'Tata StarQuik for quick online grocery and everyday essentials.',
        link: 'https://www.starquik.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: "Nature's Basket",
        description: 'Premium groceries, gourmet foods and fresh produce delivered home.',
        link: 'https://www.naturesbasket.co.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: "Spencer's",
        description: 'Everyday grocery and household shopping at Spencer’s retail stores.',
        link: 'https://www.spencers.in?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Meat, Food & Subscriptions',
    stores: [
      {
        name: 'Licious',
        description: 'Fresh, chemical-free meats and seafood delivered to your kitchen.',
        link: 'https://www.licious.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'TenderCuts',
        description: 'Farm-fresh chicken, mutton, seafood and ready-to-cook cuts.',
        link: 'https://www.tendercuts.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'FreshToHome',
        description: 'Chemical-free fish, meat, vegetables and daily cooking essentials.',
        link: 'https://www.freshtohome.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Eatclub',
        description: 'Affordable food subscription and daily meal plans for home and office.',
        link: 'https://www.eatclub.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Swiggy One',
        description: 'Membership for free delivery, extra discounts and exclusive offers.',
        link: 'https://www.swiggy.com/swiggy-one?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Zomato Gold',
        description: 'Dining, delivery and nightlife membership with big savings.',
        link: 'https://www.zomato.com/gold?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Movies & Entertainment',
    stores: [
      {
        name: 'BookMyShow',
        description: 'Movie tickets, live events, plays and sports bookings across India.',
        link: 'https://in.bookmyshow.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'PVR Cinemas',
        description: 'Book movie tickets and premium cinema experiences at PVR.',
        link: 'https://www.pvrcinemas.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'INOX',
        description: 'Movie ticket bookings and multiplex experiences at INOX.',
        link: 'https://www.inoxmovies.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Paytm Insider',
        description: 'Concerts, comedy shows, workshops and live event tickets.',
        link: 'https://insider.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'TicketNew',
        description: 'Book movie tickets for theatres across multiple cities.',
        link: 'https://www.ticketnew.com?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Railway & Airport Services',
    stores: [
      {
        name: 'IRCTC E-Catering',
        description: 'Order food online and get it delivered right to your train seat.',
        link: 'https://www.ecatering.irctc.co.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Zoop',
        description: 'Order restaurant food for delivery at your railway station.',
        link: 'https://www.zoopindia.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'RailRestro',
        description: 'Train food delivery from FSSAI-approved restaurants across India.',
        link: 'https://www.railrestro.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'TravelKhana',
        description: 'Order meals, snacks and water for your train journey.',
        link: 'https://www.travelkhana.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'RailYatri',
        description: 'Train status, PNR, food order and bus booking for rail travellers.',
        link: 'https://www.railyatri.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Air India',
        description: 'Book domestic and international flights with Air India.',
        link: 'https://www.airindia.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'IndiGo',
        description: 'Low fare flight bookings and airport services across India.',
        link: 'https://www.goindigo.in?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Recharge & Bill Payments',
    stores: [
      {
        name: 'Paytm',
        description: 'Mobile, DTH, broadband, electricity and bill payments with cashback.',
        link: 'https://paytm.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'PhonePe',
        description: 'UPI payments, recharge, bills and financial services in one app.',
        link: 'https://www.phonepe.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Google Pay',
        description: 'UPI payments, recharge, bills and rewards on Google Pay.',
        link: 'https://pay.google.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Amazon Pay',
        description: 'Recharge, bills, flights and daily payments powered by Amazon.',
        link: 'https://www.amazonpay.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Freecharge',
        description: 'Mobile, DTH and utility bill payments with deals and rewards.',
        link: 'https://www.freecharge.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'MobiKwik',
        description: 'Recharge, bill payments, digital loans and wallet services.',
        link: 'https://www.mobikwik.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'CRED',
        description: 'Credit card bill payments and exclusive rewards for billers.',
        link: 'https://www.cred.club?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Bajaj Finserv',
        description: 'Loans, EMI, insurance and utility payments on Bajaj Finserv.',
        link: 'https://www.bajajfinserv.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Airtel Thanks',
        description: 'Mobile, DTH, broadband recharges and Airtel services.',
        link: 'https://www.airtel.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'MyJio',
        description: 'Jio mobile, fiber, DTH and all Jio services recharges.',
        link: 'https://www.jio.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Vi',
        description: 'Vodafone Idea mobile, data and bill payments.',
        link: 'https://www.myvi.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'BSNL',
        description: 'BSNL mobile, broadband and landline recharge and plans.',
        link: 'https://portal2.bsnl.in?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
  {
    name: 'Daily Use & Streaming',
    stores: [
      {
        name: 'YouTube',
        description: 'Watch, create and share videos across every interest and creator.',
        link: 'https://www.youtube.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Instagram',
        description: 'Share photos, stories, reels and shop from your favourite brands.',
        link: 'https://www.instagram.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Facebook',
        description: 'Connect with friends, communities, marketplace and local groups.',
        link: 'https://www.facebook.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'X (Twitter)',
        description: 'Real-time news, conversations and trending topics from around the world.',
        link: 'https://x.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'WhatsApp',
        description: 'Free messaging, voice and video calls with anyone, anywhere.',
        link: 'https://www.whatsapp.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Telegram',
        description: 'Fast, secure messaging with channels, groups and bots.',
        link: 'https://telegram.org?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'LinkedIn',
        description: 'Professional networking, jobs, learning and business updates.',
        link: 'https://www.linkedin.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Snapchat',
        description: 'Share moments, stories and AR lenses with friends.',
        link: 'https://www.snapchat.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Pinterest',
        description: 'Discover and save ideas for recipes, style, home and more.',
        link: 'https://www.pinterest.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Reddit',
        description: 'Join communities, discussions and AMAs on every topic.',
        link: 'https://www.reddit.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Quora',
        description: 'Ask questions and get answers from experts and enthusiasts.',
        link: 'https://www.quora.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Discord',
        description: 'Hang out with communities and friends over voice, video and text.',
        link: 'https://discord.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Disney+ Hotstar',
        description: 'Watch movies, TV shows, live sports and Hotstar specials.',
        link: 'https://www.hotstar.com/in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'JioTV',
        description: 'Live TV channels, shows and on-demand content on JioTV.',
        link: 'https://www.jio.com/selfcare/close-to-realtime/jiotv?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Netflix',
        description: 'Stream award-winning series, movies, documentaries and more.',
        link: 'https://www.netflix.com/in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Amazon Prime Video',
        description: 'Movies, originals, live sports and Prime-exclusive content.',
        link: 'https://www.primevideo.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'SonyLIV',
        description: 'Sony shows, sports, originals and live TV streaming.',
        link: 'https://www.sonyliv.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Zee5',
        description: 'Zee TV shows, movies, originals and regional content.',
        link: 'https://www.zee5.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'JioCinema',
        description: 'Free movies, shows and live sports streaming on JioCinema.',
        link: 'https://www.jiocinema.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Voot',
        description: 'MTV, Colors shows, originals and kids content on Voot.',
        link: 'https://www.voot.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Sun NXT',
        description: 'South Indian movies, TV shows and live channels streaming.',
        link: 'https://www.sunnxt.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'MX Player',
        description: 'Free movies, TV shows, web series and music videos.',
        link: 'https://www.mxplayer.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Aha',
        description: 'Telugu and Tamil originals, movies and exclusive content.',
        link: 'https://www.aha.video?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Hoichoi',
        description: 'Bengali movies, originals and TV shows on Hoichoi.',
        link: 'https://www.hoichoi.tv?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'AltBalaji',
        description: 'Indian originals, dramas and exclusive web series.',
        link: 'https://www.altbalaji.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'ShemarooMe',
        description: 'Classic and new Bollywood, Gujarati and regional entertainment.',
        link: 'https://www.shemaroome.com?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Discovery+',
        description: 'Documentaries, lifestyle, adventure and real-life shows.',
        link: 'https://www.discoveryplus.in?aff_id=YOUR_AFFILIATE_ID',
      },
      {
        name: 'Lionsgate Play',
        description: 'Hollywood movies, premium series and award-winning content.',
        link: 'https://www.lionsgateplay.com?aff_id=YOUR_AFFILIATE_ID',
      },
    ],
  },
];
