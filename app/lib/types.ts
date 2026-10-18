export interface Store {
  name: string;
  description: string;
  link: string;
  category?: string;
}

export interface Deal {
  store: string;
  title: string;
  description: string;
  link: string;
  category: string;
  discount: string;
  ai_summary: string;
}
