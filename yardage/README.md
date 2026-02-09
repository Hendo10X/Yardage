# Yardage — Student Marketplace Backend

A multivendor e-commerce API where students buy and sell their stuff. Built with tRPC, Elysia, Drizzle ORM, better-auth, and UploadThing.

## Stack

- **Runtime**: Next.js 16 (App Router) + Elysia (standalone option)
- **API**: tRPC v11 — type-safe RPC, no REST boilerplate
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **Auth**: better-auth (email/password, session cookies)
- **File Upload**: UploadThing (product images, store avatars)
- **Validation**: Zod
- **State Management**: TanStack Query v5 (frontend ready)

## Setup

```bash
npm install
```

Create a `.env` file:

```
DATABASE_URL=your_neon_connection_string
BETTER_AUTH_SECRET=your_secret
UPLOADTHING_TOKEN=your_uploadthing_token
```

Run database migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Start the dev server:

```bash
npm run dev          # Next.js on port 3000 (includes tRPC at /api/trpc)
npm run dev:api      # Standalone Elysia server on port 3001 (requires Bun)
```

## Database Schema

| Table | Purpose |
|---|---|
| `user` | Auth users (managed by better-auth) |
| `session` | User sessions |
| `account` | OAuth accounts |
| `verification` | Email verification tokens |
| `stores` | Vendor profiles (one per user) |
| `categories` | Product categories |
| `products` | Listings with price, condition, status, images |
| `orders` | Buyer orders with status tracking |
| `order_items` | Individual items per order, price snapshot at purchase |
| `reviews` | Product reviews with 1-5 rating |
| `conversations` | Message threads tied to a buyer + product (unique per pair) |
| `messages` | Individual messages within a conversation, with read tracking |

## API Reference

All procedures are available at `/api/trpc/<router>.<procedure>`.

Queries are `GET`, mutations are `POST`. Input is passed as JSON in the `?input=` query param (queries) or request body (mutations), wrapped in `{"json": {...}}` due to the superjson transformer.

### Auth

Handled by better-auth at `/api/auth/*`. Sign up, sign in, and sign out create/destroy session cookies that are automatically sent with every tRPC request.

### Procedure Tiers

| Tier | Access |
|---|---|
| `publicProcedure` | Anyone |
| `protectedProcedure` | Logged-in users (`ctx.user`, `ctx.session`) |
| `sellerProcedure` | Users with a store (`ctx.user`, `ctx.session`, `ctx.store`) |

### Store

| Procedure | Type | Tier | Description |
|---|---|---|---|
| `store.create` | mutation | protected | Create a store (one per user) |
| `store.getMine` | query | protected | Get your store |
| `store.getById` | query | public | Get store by ID |
| `store.getBySlug` | query | public | Get store by URL slug |
| `store.update` | mutation | protected | Update your store |

### Product

| Procedure | Type | Tier | Description |
|---|---|---|---|
| `product.create` | mutation | seller | List a product (price in cents) |
| `product.getById` | query | public | Get product with store + category |
| `product.update` | mutation | seller | Update product (blocked if sold) |
| `product.list` | query | public | Paginated list with filters |
| `product.listMine` | query | seller | Your products with status filter |

**`product.list` filters**: `categoryId`, `storeId`, `condition`, `minPrice`, `maxPrice`, `search`, `sort` (newest, oldest, price_asc, price_desc)

### Category

| Procedure | Type | Tier | Description |
|---|---|---|---|
| `category.create` | mutation | protected | Create a category |
| `category.list` | query | public | All categories (alphabetical) |
| `category.getById` | query | public | Get category by ID |

### Order

| Procedure | Type | Tier | Description |
|---|---|---|---|
| `order.create` | mutation | protected | Place order (validates products, snapshots prices, blocks self-purchase) |
| `order.getById` | query | protected | View order (buyer or seller only) |
| `order.listMyOrders` | query | protected | Your orders as buyer |
| `order.listStoreOrders` | query | seller | Orders containing your products |
| `order.updateStatus` | mutation | seller | Transition order status |

**Order status flow**:

```
PENDING → CONFIRMED → COMPLETED
  ↓            ↓
CANCELLED   CANCELLED
```

Completing an order marks all products in it as SOLD.

### Review

| Procedure | Type | Tier | Description |
|---|---|---|---|
| `review.create` | mutation | protected | Review a purchased product (1-5 rating, one per product) |
| `review.getByProduct` | query | public | Reviews for a product (includes average rating) |
| `review.getByStore` | query | public | Reviews across a store (includes average rating) |
| `review.update` | mutation | protected | Edit your review |
| `review.delete` | mutation | protected | Delete your review |

### Vendor

| Procedure | Type | Tier | Description |
|---|---|---|---|
| `vendor.checkStatus` | query | protected | Check if user has a store (buyer vs vendor mode) |
| `vendor.stats` | query | seller | Dashboard stats: active, pending, sold counts + total earned |

**`vendor.stats` response**: `{ active, pending, sold, earned }` — `pending` counts products with in-progress orders, `earned` is total cents from completed orders.

### Message

| Procedure | Type | Tier | Description |
|---|---|---|---|
| `message.startConversation` | mutation | protected | Start or continue a conversation about a product (sends first message) |
| `message.send` | mutation | protected | Send a message in an existing conversation |
| `message.getConversation` | query | protected | Get conversation with paginated messages (auto-marks as read) |
| `message.listMine` | query | protected | List your conversations with latest message (filterable by `role`: buyer/seller) |
| `message.listByProduct` | query | seller | Vendor inbox — conversations for a specific product |
| `message.markAsRead` | mutation | protected | Mark all unread messages from the other participant as read |

One conversation per buyer per product. Both buyer and seller can send messages. `listByProduct` powers the vendor inbox where conversations are grouped by product (e.g. "[Lamp photo] - Message from John").

### File Upload

UploadThing endpoints at `/api/uploadthing`:

| Endpoint | Config |
|---|---|
| `productImage` | Up to 10 images, 4MB each |
| `storeImage` | 1 image, 4MB |

Both require authentication.

## Enums

```
ProductCondition: new, like_new, good, fair, poor
ProductStatus:    active, sold, draft
OrderStatus:      pending, confirmed, completed, cancelled
SortBy:           newest, oldest, price_asc, price_desc
```

## Prices

All prices are stored as integers in **cents**. `1500` = $15.00. This avoids floating-point rounding issues.

## Error Handling

All errors are thrown as `TRPCError` with standard codes:

| Code | When |
|---|---|
| `UNAUTHORIZED` | Not logged in |
| `FORBIDDEN` | No permission (wrong owner, no store) |
| `NOT_FOUND` | Resource doesn't exist |
| `BAD_REQUEST` | Invalid operation (buying own product, updating sold item) |
| `CONFLICT` | Duplicate (store already exists, already reviewed) |

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts    # better-auth handler
│   │   ├── trpc/[...trpc]/route.ts   # tRPC handler
│   │   └── uploadthing/
│   │       ├── core.ts               # upload endpoints
│   │       └── route.ts              # uploadthing handler
│   └── layout.tsx
├── components/
│   └── providers.tsx                  # tRPC + TanStack Query providers
├── db/
│   ├── drizzle.ts                     # database connection
│   └── schema.ts                      # all tables, relations, enums
├── lib/
│   ├── auth.ts                        # better-auth server config
│   ├── auth-client.ts                 # better-auth client
│   ├── errors.ts                      # error helpers
│   ├── trpc.ts                        # typed tRPC React hooks
│   ├── uploadthing.ts                 # typed upload components
│   └── utils.ts                       # slug generation, cn()
├── server/
│   ├── enums.ts                       # TypeScript enums
│   ├── index.ts                       # standalone Elysia server
│   ├── trpc.ts                        # tRPC init, context, procedures
│   └── routers/
│       ├── index.ts                   # app router (combines all)
│       ├── store.ts
│       ├── product.ts
│       ├── category.ts
│       ├── order.ts
│       ├── review.ts
│       ├── vendor.ts
│       └── message.ts
└── drizzle.config.ts
```
