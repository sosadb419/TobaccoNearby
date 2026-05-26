export type ShopComment = {
  id: string;
  shop_id?: string;
  shop_slug: string;
  shop_name: string;
  display_name?: string;
  comment_text: string;
  category: string;
  status: "approved";
  created_at?: string;
  updated_at?: string;
};

export const commentCategories = [
  "Opening hours",
  "Accessibility",
  "Directions",
  "Contact information",
  "General note"
] as const;
