export type ShopComment = {
  id: string;
  shop_id?: string;
  shop_slug: string;
  shop_name: string;
  parent_comment_id?: string;
  display_name?: string;
  comment_text: string;
  category: string;
  status: "approved";
  created_at?: string;
  updated_at?: string;
  like_count: number;
  visitor_has_liked?: boolean;
  replies: ShopComment[];
};

export const commentCategories = [
  "Opening hours",
  "Accessibility",
  "Directions",
  "Contact information",
  "General note"
] as const;
