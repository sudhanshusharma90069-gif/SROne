import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const sample = [
  {
    store: 'Amazon',
    title: 'Up to 60% off on Electronics',
    description: 'Best offers on mobiles, laptops, and accessories.',
    link: 'https://www.amazon.in?tag=YOUR_AFFILIATE_ID',
    category: 'Online Marketplaces',
    discount: '60% OFF',
  },
  {
    store: 'Flipkart',
    title: 'Big Savings on Mobiles',
    description: 'Top brand smartphones with exchange and EMI offers.',
    link: 'https://www.flipkart.com?affid=YOUR_AFFILIATE_ID',
    category: 'Online Marketplaces',
    discount: '50% OFF',
  },
  {
    store: 'Meesho',
    title: 'Lowest Prices on Fashion & Home',
    description: 'Trendy kurtis, sarees and home decor at rock-bottom prices.',
    link: 'https://www.meesho.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Online Marketplaces',
    discount: 'MIN 50% OFF',
  },
  {
    store: 'Snapdeal',
    title: 'Budget Bazaar Deals',
    description: 'Daily essentials, fashion and home items at deep discounts.',
    link: 'https://www.snapdeal.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Online Marketplaces',
    discount: '70% OFF',
  },
  {
    store: 'ShopClues',
    title: 'Sunday Flea Market',
    description: 'Wholesale pricing on gadgets, fashion and daily needs.',
    link: 'https://www.shopclues.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Online Marketplaces',
    discount: 'FROM ₹99',
  },
  {
    store: 'IndiaMART',
    title: 'Bulk Buy Savings',
    description: 'Wholesale rates on business supplies and industrial goods.',
    link: 'https://www.indiamart.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Online Marketplaces',
    discount: 'WHOLESALE',
  },
  {
    store: 'Myntra',
    title: 'End of Reason Sale',
    description: 'Biggest fashion discounts on clothing, footwear and accessories.',
    link: 'https://www.myntra.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Fashion & Lifestyle',
    discount: '50-80% OFF',
  },
  {
    store: 'Ajio',
    title: 'Big Bold Sale',
    description: 'Trending styles and brands at jaw-dropping prices.',
    link: 'https://www.ajio.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Fashion & Lifestyle',
    discount: 'UP TO 75% OFF',
  },
  {
    store: 'Tata CLiQ',
    title: 'TruBeat Electronics & Fashion Sale',
    description: 'Premium brands with extra bank offers.',
    link: 'https://www.tatacliq.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Fashion & Lifestyle',
    discount: 'EXTRA 10% OFF',
  },
  {
    store: 'LimeRoad',
    title: 'Style Steals',
    description: 'Fresh fashion drops at budget-friendly prices.',
    link: 'https://www.limeroad.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Fashion & Lifestyle',
    discount: '60% OFF',
  },
  {
    store: 'Nykaa',
    title: 'Pink Friday Sale',
    description: 'Beauty bestsellers, skincare and makeup at huge discounts.',
    link: 'https://www.nykaa.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Beauty & Personal Care',
    discount: '40% OFF',
  },
  {
    store: 'Purplle',
    title: 'Beauty Bonanza',
    description: 'Makeup, haircare and skincare combos at half price.',
    link: 'https://www.purplle.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Beauty & Personal Care',
    discount: '50% OFF',
  },
  {
    store: 'Blinkit',
    title: 'Groceries in 10 Minutes',
    description: 'Daily essentials delivered super fast.',
    link: 'https://www.blinkit.com?referrer=YOUR_AFFILIATE_ID',
    category: 'Grocery & Quick Commerce',
    discount: 'FLAT 20%',
  },
  {
    store: 'Zepto',
    title: 'Quick Grocery Delivery',
    description: 'Fresh groceries and staples delivered in minutes.',
    link: 'https://www.zeptonow.com?referral=YOUR_AFFILIATE_ID',
    category: 'Grocery & Quick Commerce',
    discount: 'BUY 1 GET 1',
  },
  {
    store: 'BigBasket',
    title: 'Weekly Grocery Savings',
    description: 'Fruits, veggies and staples with doorstep delivery.',
    link: 'https://www.bigbasket.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Grocery & Quick Commerce',
    discount: '20% OFF',
  },
  {
    store: 'JioMart',
    title: 'Daily Deals on Groceries',
    description: 'Household items at discounted prices.',
    link: 'https://www.jiomart.com?aff=YOUR_AFFILIATE_ID',
    category: 'Grocery & Quick Commerce',
    discount: '30% OFF',
  },
  {
    store: 'Swiggy',
    title: 'Flat 50% Off on Food Orders',
    description: 'Restaurant favourites delivered hot with Swiggy One offers.',
    link: 'https://www.swiggy.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Food Delivery',
    discount: '50% OFF',
  },
  {
    store: 'Zomato',
    title: 'Zomato Gold Dining Deals',
    description: 'Dining out and food delivery discounts on top restaurants.',
    link: 'https://www.zomato.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Food Delivery',
    discount: '40% OFF',
  },
  {
    store: "Domino's",
    title: 'Buy 1 Get 1 Free Pizza',
    description: 'Everyday value offers on pizzas, sides and desserts.',
    link: 'https://www.dominos.co.in?aff_id=YOUR_AFFILIATE_ID',
    category: 'Food Delivery',
    discount: 'BOGO',
  },
  {
    store: 'Rominos',
    title: 'Combo Pizza Offers',
    description: 'Pizza combos and fast-food deals for the whole family.',
    link: 'https://www.rominus.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Food Delivery',
    discount: '30% OFF',
  },
  {
    store: 'OYO Rooms',
    title: 'Wizard Member Discounts',
    description: 'Budget hotel stays with extra member-only savings.',
    link: 'https://www.oyorooms.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Hotel Booking',
    discount: '40% OFF',
  },
  {
    store: 'Booking.com',
    title: 'Genius Deals on Stays',
    description: 'Hotels and resorts worldwide with free cancellation.',
    link: 'https://www.booking.com?aid=YOUR_AFFILIATE_ID',
    category: 'Hotel Booking',
    discount: '15% OFF',
  },
  {
    store: 'Airbnb',
    title: 'Unique Homes & Stays',
    description: 'Apartments, villas and experiences hosted by locals.',
    link: 'https://www.airbnb.co.in?aff_id=YOUR_AFFILIATE_ID',
    category: 'Hotel Booking',
    discount: 'FIRST ₹1500 OFF',
  },
  {
    store: 'MakeMyTrip Hotels',
    title: 'Hotel + Flight Combos',
    description: 'Bundle hotel stays with flights for extra savings.',
    link: 'https://www.makemytrip.com/hotels?aff_id=YOUR_AFFILIATE_ID',
    category: 'Hotel Booking',
    discount: '25% OFF',
  },
  {
    store: 'MakeMyTrip',
    title: 'Domestic Flight Sale',
    description: 'Flights, trains and holiday packages at festival prices.',
    link: 'https://www.makemytrip.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel Booking',
    discount: '₹2000 OFF',
  },
  {
    store: 'Goibibo',
    title: 'goCash Rewards on Flights',
    description: 'Flight and hotel bookings with instant goCash back.',
    link: 'https://www.goibibo.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel Booking',
    discount: '20% OFF',
  },
  {
    store: 'Yatra',
    title: 'Flight & Holiday Deals',
    description: 'Corporate and leisure travel bookings with offers.',
    link: 'https://www.yatra.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel Booking',
    discount: '₹1500 OFF',
  },
  {
    store: 'Cleartrip',
    title: 'Transparent Fare Sale',
    description: 'Flights and hotels with simple, honest pricing.',
    link: 'https://www.cleartrip.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel Booking',
    discount: 'FLAT 12% OFF',
  },
  {
    store: 'EaseMyTrip',
    title: 'Zero Convenience Fee Flights',
    description: 'Book flights and hotels with no convenience charges.',
    link: 'https://www.easemytrip.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel Booking',
    discount: 'NO FEES',
  },
  {
    store: 'IRCTC',
    title: 'Rail Ticket Booking',
    description: 'Official train tickets, tour packages and luxury trains.',
    link: 'https://www.irctc.co.in?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel Booking',
    discount: 'TOUR DEALS',
  },
  {
    store: 'redBus',
    title: 'Bus Ticket Savings',
    description: 'Bus bookings with live tracking and instant refunds.',
    link: 'https://www.redbus.in?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel Booking',
    discount: 'UP TO ₹300 OFF',
  },
  {
    store: 'Reliance Digital',
    title: 'Electronics Festival',
    description: 'Latest gadgets, TVs, and appliances at best prices.',
    link: 'https://www.reliancedigital.in?affiliate=YOUR_AFFILIATE_ID',
    category: 'Electronics & Appliances',
    discount: 'UP TO 40%',
  },
  {
    store: 'Lenskart',
    title: 'Gold Membership Frames Offer',
    description: 'Buy 1 Get 1 free on eyeglasses and sunglasses.',
    link: 'https://www.lenskart.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Specialty Stores',
    discount: 'BUY 1 GET 1',
  },
  {
    store: 'FirstCry',
    title: 'Kids Fashion Fiesta',
    description: 'Baby and kids essentials, clothing and toys on sale.',
    link: 'https://www.firstcry.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Specialty Stores',
    discount: 'UP TO 60% OFF',
  },
  {
    store: 'Pepperfry',
    title: 'Festive Furniture Sale',
    description: 'Sofas, beds and decor pieces at festive prices.',
    link: 'https://www.pepperfry.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Specialty Stores',
    discount: 'UP TO 55% OFF',
  },
  {
    store: 'Uber',
    title: 'Ride Discount Coupons',
    description: 'Save on daily cab rides, autos and airport trips.',
    link: 'https://www.uber.com?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel & Mobility',
    discount: '50% OFF',
  },
  {
    store: 'Rapido',
    title: 'Bike Taxi First Ride Free',
    description: 'Quick and affordable bike rides for city commutes.',
    link: 'https://rapido.bike?aff_id=YOUR_AFFILIATE_ID',
    category: 'Travel & Mobility',
    discount: 'FIRST FREE',
  },
  {
    store: 'Shopify',
    title: 'Start Your Online Store',
    description: 'Free trial and special pricing for new sellers.',
    link: 'https://www.shopify.com/free-trial?aff_id=YOUR_AFFILIATE_ID',
    category: 'Start Your Own Store',
    discount: 'FREE TRIAL',
  },
];

async function aiSummary(title: string, description: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    return `${title} — ${description}`;
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a deal copywriter. Write one catchy short sentence for a deal.' },
          { role: 'user', content: `Title: ${title}\nDescription: ${description}\nWrite a one-line catchy summary.` },
        ],
        max_tokens: 60,
      }),
    });
    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch {
    return `${title} — ${description}`;
  }
}

export async function GET() {
  const deals = await Promise.all(
    sample.map(async (d) => ({
      ...d,
      ai_summary: await aiSummary(d.title, d.description),
    }))
  );
  return NextResponse.json({ deals });
}
