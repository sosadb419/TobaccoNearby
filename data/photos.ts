export type ShopPhoto = {
  id: string;
  shop_id?: string;
  shop_slug: string;
  storage_path: string;
  status: "approved";
  submitted_at?: string;
  approved_at?: string;
  display_name?: string;
  signed_url: string;
};
