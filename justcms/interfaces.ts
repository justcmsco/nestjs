export interface Category {
  name: string;
  slug: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface ImageVariant {
  url: string;
  width: number;
  height: number;
  filename: string;
}

export interface Image {
  alt: string;
  variants: ImageVariant[];
}

export interface PageSummary {
  title: string;
  subtitle: string;
  coverImage: Image | null;
  slug: string;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface PagesResponse {
  items: PageSummary[];
  total: number;
}

export interface HeaderBlock {
  type: 'header';
  styles: string[];
  header: string;
  subheader: string | null;
  size: string;
}

export interface ListBlock {
  type: 'list';
  styles: string[];
  options: {
    title: string;
    subtitle?: string | null;
  }[];
}

export interface EmbedBlock {
  type: 'embed';
  styles: string[];
  url: string;
}

export interface ImageBlock {
  type: 'image';
  styles: string[];
  images: {
    alt: string;
    variants: ImageVariant[];
  }[];
}

export interface CodeBlock {
  type: 'code';
  styles: string[];
  code: string;
}

export interface TextBlock {
  type: 'text';
  styles: string[];
  text: string;
}

export interface CtaBlock {
  type: 'cta';
  styles: string[];
  text: string;
  url: string;
  description?: string | null;
}

export interface CustomBlock {
  type: 'custom';
  styles: string[];
  blockId: string;
  [key: string]: any;
}

export type ContentBlock =
  | HeaderBlock
  | ListBlock
  | EmbedBlock
  | ImageBlock
  | CodeBlock
  | TextBlock
  | CtaBlock
  | CustomBlock;

export interface PageDetail {
  title: string;
  subtitle: string;
  meta: {
    title: string;
    description: string;
  };
  coverImage: Image | null;
  slug: string;
  categories: Category[];
  content: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  title: string;
  subtitle?: string;
  icon: string;
  url: string;
  styles: string[];
  children: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface PageFilters {
  category: {
    slug: string;
  };
}
