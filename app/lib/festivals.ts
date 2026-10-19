export interface Festival {
  name: string;
  emoji: string;
  wish: string;
  cta: string;
  // [startMonth, startDay, endMonth, endDay] — month is 1-12
  window: [number, number, number, number];
}

export const festivals: Festival[] = [
  {
    name: 'New Year Sale',
    emoji: '🎉',
    wish: 'Happy New Year! Start 2026 with the best deals.',
    cta: 'Shop New Year Deals',
    window: [12, 31, 1, 5],
  },
  {
    name: 'Republic Day Sale',
    emoji: '🇮🇳',
    wish: 'Happy Republic Day! Celebrate with patriotic deals.',
    cta: 'Shop Republic Day Deals',
    window: [1, 24, 1, 28],
  },
  {
    name: "Valentine's Day Sale",
    emoji: '💝',
    wish: "Happy Valentine's Day! Perfect gifts for your loved ones.",
    cta: 'Shop Gift Deals',
    window: [2, 12, 2, 15],
  },
  {
    name: 'Holi Sale',
    emoji: '🎨',
    wish: 'Happy Holi! Splash into colourful discounts.',
    cta: 'Shop Holi Deals',
    window: [3, 13, 3, 16],
  },
  {
    name: 'Eid Sale',
    emoji: '🌙',
    wish: 'Eid Mubarak! Festive deals on fashion, food and gifts.',
    cta: 'Shop Eid Deals',
    window: [3, 20, 3, 24],
  },
  {
    name: 'Raksha Bandhan Sale',
    emoji: '🧵',
    wish: 'Happy Raksha Bandhan! Find the perfect gift for your sibling.',
    cta: 'Shop Rakhi Deals',
    window: [8, 7, 8, 10],
  },
  {
    name: 'Independence Day Sale',
    emoji: '🇮🇳',
    wish: 'Happy Independence Day! Freedom deals are live.',
    cta: 'Shop Independence Deals',
    window: [8, 13, 8, 17],
  },
  {
    name: 'Big Billion Days',
    emoji: '🛍️',
    wish: 'Big Billion Days are here! Biggest discounts of the year.',
    cta: 'Shop Big Billion Deals',
    window: [9, 23, 9, 30],
  },
  {
    name: 'Great Indian Festival',
    emoji: '🔥',
    wish: 'Amazon Great Indian Festival — blockbuster offers live!',
    cta: 'Shop Festival Deals',
    window: [10, 1, 10, 8],
  },
  {
    name: 'Navratri Sale',
    emoji: '🙏',
    wish: 'Happy Navratri! Festive shopping begins now.',
    cta: 'Shop Navratri Deals',
    window: [9, 22, 9, 30],
  },
  {
    name: 'Dussehra Sale',
    emoji: '🏹',
    wish: 'Happy Dussehra! Victory of savings over high prices.',
    cta: 'Shop Dussehra Deals',
    window: [10, 1, 10, 3],
  },
  {
    name: 'Diwali Sale',
    emoji: '🪔',
    wish: 'Happy Diwali! Light up your savings with festive deals.',
    cta: 'Shop Diwali Deals',
    window: [10, 18, 10, 23],
  },
  {
    name: 'Black Friday Sale',
    emoji: '🖤',
    wish: 'Black Friday is live! Global mega deals unlocked.',
    cta: 'Shop Black Friday Deals',
    window: [11, 27, 11, 30],
  },
  {
    name: 'Christmas Sale',
    emoji: '🎄',
    wish: 'Merry Christmas! Jolly deals on gifts and more.',
    cta: 'Shop Christmas Deals',
    window: [12, 23, 12, 27],
  },
];

export function getActiveFestival(today: Date = new Date()): Festival | null {
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return (
    festivals.find(({ window: [sm, sd, em, ed] }) => {
      if (sm <= em) {
        return (month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em);
      }
      return (month === sm && day >= sd) || (month === em && day <= ed);
    }) || null
  );
}
