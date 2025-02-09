# JustCMS NestJS Integration

A simple, type-safe integration for [JustCMS](https://justcms.co) in your NestJS project. This integration leverages a dedicated service that wraps the JustCMS public API endpoints, making it easy to fetch categories, pages, and menus.

## Features

- **TypeScript support:** Fully typed structures for API responses.
- **Dedicated Service:** All JustCMS API calls are encapsulated in a single service.
- **Flexible Configuration:** Configure your API token and project ID via environment variables or module options.
- **Utility Functions:** Helper functions for working with JustCMS content blocks.

## Installation

1. **Install Dependencies:**

   Make sure you have the required packages installed:

   ```bash
   npm install @nestjs/axios @nestjs/config rxjs
   ```

2. **Add the Integration Files:**

   Copy the following files into your project (e.g., under `src/justcms/\):

   - `interfaces.ts`
   - `justcms.service.ts`
   - `justcms.module.ts`

## Configuration

You can provide your JustCMS API token and project ID either via environment variables or by using the dynamic module options.

### Using Environment Variables

Set the following environment variables (e.g., in a \`.env\` file):

```env
JUST_CMS_TOKEN=YOUR_JUSTCMS_API_TOKEN
JUST_CMS_PROJECT=YOUR_JUSTCMS_PROJECT_ID
```

Make sure to load these variables using `@nestjs/config` in your app module.

### Using Module Options

Alternatively, configure the integration when importing the module:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JustCmsModule } from './justcms/justcms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JustCmsModule.forRoot({
      token: 'YOUR_JUSTCMS_API_TOKEN',
      projectId: 'YOUR_JUSTCMS_PROJECT_ID',
    }),
  ],
})
export class AppModule {}
```

## Usage

Inject the `JustCmsService` into your controllers or providers to access JustCMS API functionality.

### Example Controller

```ts
import { Controller, Get, Param } from '@nestjs/common';
import { JustCmsService } from './justcms/justcms.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly justCmsService: JustCmsService) {}

  @Get()
  async getPages() {
    return this.justCmsService.getPages();
  }

  @Get(':slug')
  async getPageBySlug(@Param('slug') slug: string) {
    return this.justCmsService.getPageBySlug(slug);
  }
}
```

### Available Methods

- **getCategories():** Fetches all categories.

```ts
const categories = await justCmsService.getCategories();
```

- **getPages(options?: { filters?: { category: { slug: string } }; start?: number; offset?: number }):** Fetches pages with optional filtering and pagination.

```ts
const pages = await justCmsService.getPages({ filters: { category: { slug: 'blog' } } });
```

- **getPageBySlug(slug: string, version?: string):** Fetches detailed information about a specific page.

```ts
const page = await justCmsService.getPageBySlug('about-us');
```

- **getMenuById(id: string):** Fetches a menu and its items by its unique identifier.

```ts
const menu = await justCmsService.getMenuById('main-menu');
```

### Utility Functions

- **isBlockHasStyle(block: ContentBlock, style: string):** Checks if a content block has a specific style (case-insensitive).

```ts
const isHighlighted = justCmsService.isBlockHasStyle(block, 'highlight');
```

- **getLargeImageVariant(image: Image):** Retrieves the large variant of an image (assumed to be the second variant).

```ts
const largeImage = justCmsService.getLargeImageVariant(image);
```

- **getFirstImage(block: ImageBlock):** Retrieves the first image from an image block.

```ts
const firstImage = justCmsService.getFirstImage(imageBlock);
```

- **hasCategory(page: PageDetail, categorySlug: string):** Checks if a page belongs to a specific category.

```ts
const isBlogPost = justCmsService.hasCategory(page, 'blog');
```

## API Endpoints Overview

The service wraps the following JustCMS API endpoints:

- **Get Categories:** Retrieve all categories for your project.
- **Get Pages:** Retrieve pages with optional filtering (by category slug) and pagination.
- **Get Page by Slug:** Retrieve detailed information about a specific page.
- **Get Menu by ID:** Retrieve a menu and its items by its unique identifier.

For more details on each endpoint, refer to the [JustCMS Public API Documentation](https://justcms.co/api).
