import { init } from "next/dist/compiled/webpack/webpack";

export interface ProductFormProps {
  onSubmit: (data: any) => void;
  isEditMode?: boolean;
  initialData?: {
    ean: string | number;
    name?: string;
    brand?: string;
    description?: string;
    image?: string;
    user_rating?: number;
    user_note?: string;
  };
}
