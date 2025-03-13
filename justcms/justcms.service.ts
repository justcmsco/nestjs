import { Injectable, HttpException, HttpStatus, Inject, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  Category,
  CategoriesResponse,
  PagesResponse,
  PageDetail,
  Menu,
  PageFilters,
  Image,
  ImageVariant,
  Layout,
} from './interfaces';

export interface JustCmsModuleOptions {
  token?: string;
  projectId?: string;
}

@Injectable()
export class JustCmsService {
  private readonly BASE_URL = 'https://api.justcms.co/public';
  private readonly token: string;
  private readonly projectId: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Optional() @Inject('JUST_CMS_OPTIONS') options?: JustCmsModuleOptions,
  ) {
    // Use provided options or fallback to environment variables
    this.token = options?.token || this.configService.get<string>('JUST_CMS_TOKEN');
    this.projectId = options?.projectId || this.configService.get<string>('JUST_CMS_PROJECT');

    if (!this.token) {
      throw new Error('JustCMS API token is required');
    }
    if (!this.projectId) {
      throw new Error('JustCMS project ID is required');
    }
  }

  private buildUrl(endpoint: string = '', queryParams?: Record<string, any>): string {
    let url = `${this.BASE_URL}/${this.projectId}`;
    if (endpoint) {
      url += `/${endpoint}`;
    }
    const searchParams = new URLSearchParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const qs = searchParams.toString();
    if (qs) {
      url += `?${qs}`;
    }
    return url;
  }

  private async get<T>(endpoint: string = '', queryParams?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, queryParams);
    try {
      const response = await this.httpService.axiosRef.get<T>(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorText = error.response.data || error.response.statusText;
        throw new HttpException(`JustCMS API error ${error.response.status}: ${errorText}`, error.response.status);
      }
      throw new HttpException('JustCMS API error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves all categories.
   */
  async getCategories(): Promise<Category[]> {
    const data = await this.get<CategoriesResponse>('');
    return data.categories;
  }

  /**
   * Retrieves pages with optional filtering and pagination.
   * @param params.filters Optional filters (e.g., by category slug).
   * @param params.start Pagination start index.
   * @param params.offset Number of items to return.
   */
  async getPages(params?: { filters?: PageFilters; start?: number; offset?: number }): Promise<PagesResponse> {
    const query: Record<string, any> = {};
    if (params?.filters?.category?.slug) {
      query['filter.category.slug'] = params.filters.category.slug;
    }
    if (params?.start !== undefined) {
      query['start'] = params.start;
    }
    if (params?.offset !== undefined) {
      query['offset'] = params.offset;
    }
    return this.get<PagesResponse>('pages', query);
  }

  /**
   * Retrieves a single page by its slug.
   * @param slug The page slug.
   * @param version (Optional) If provided, adds the `v` query parameter (e.g., 'draft').
   */
  async getPageBySlug(slug: string, version?: string): Promise<PageDetail> {
    const query: Record<string, any> = {};
    if (version) {
      query['v'] = version;
    }
    return this.get<PageDetail>(`pages/${slug}`, query);
  }

  /**
   * Retrieves a single menu by its ID.
   * @param id The menu ID.
   */
  async getMenuById(id: string): Promise<Menu> {
    return this.get<Menu>(`menus/${id}`);
  }

  /**
   * Retrieves a single layout by its ID.
   * @param id The layout ID.
   */
  async getLayoutById(id: string): Promise<Layout> {
    return this.get<Layout>(`layouts/${id}`);
  }

  /**
   * Retrieves multiple layouts by their IDs.
   * @param ids Array of layout IDs.
   */
  async getLayoutsByIds(ids: string[]): Promise<Layout[]> {
    const idsString = ids.join(';');
    return this.get<Layout[]>(`layouts/${idsString}`);
  }

  // Utility Functions

  /**
   * Checks if a content block has a specific style (case-insensitive).
   */
  isBlockHasStyle(block: { styles: string[] }, style: string): boolean {
    return block.styles.map((s: string) => s.toLowerCase()).includes(style.toLowerCase());
  }

  /**
   * Returns the large image variant (assumed to be the second variant).
   */
  getLargeImageVariant(image: Image): ImageVariant | undefined {
    return image.variants[1];
  }

  /**
   * Returns the first image from an image block.
   */
  getFirstImage(block: { images: Image[] }): Image | undefined {
    return block.images[0];
  }

  /**
   * Checks if a page has a specific category.
   */
  hasCategory(page: { categories: { slug: string }[] }, categorySlug: string): boolean {
    return page.categories.map((category) => category.slug).includes(categorySlug);
  }
}
