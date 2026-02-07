import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ── Enums ──

export const productConditionEnum = pgEnum("product_condition", [
  "new",
  "like_new",
  "good",
  "fair",
  "poor",
]);

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "sold",
  "draft",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

// ── Auth Tables (managed by better-auth) ──

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ── E-commerce Tables ──

export const store = pgTable(
  "stores",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    slug: text("slug").notNull().unique(),
    image: text("image"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("store_userId_idx").on(table.userId),
    index("store_slug_idx").on(table.slug),
  ],
);

export const category = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const product = pgTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    images: text("images").array().default([]),
    condition: productConditionEnum("condition").notNull(),
    status: productStatusEnum("status").default("draft").notNull(),
    storeId: text("store_id")
      .notNull()
      .references(() => store.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => category.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("product_storeId_idx").on(table.storeId),
    index("product_categoryId_idx").on(table.categoryId),
    index("product_status_idx").on(table.status),
  ],
);

export const order = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: orderStatusEnum("status").default("pending").notNull(),
    totalAmount: integer("total_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("order_buyerId_idx").on(table.buyerId)],
);

export const orderItem = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => product.id),
    storeId: text("store_id")
      .notNull()
      .references(() => store.id),
    price: integer("price").notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (table) => [
    index("orderItem_orderId_idx").on(table.orderId),
    index("orderItem_productId_idx").on(table.productId),
  ],
);

export const review = pgTable(
  "reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    storeId: text("store_id")
      .notNull()
      .references(() => store.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("review_user_product_idx").on(table.userId, table.productId),
    index("review_productId_idx").on(table.productId),
    index("review_storeId_idx").on(table.storeId),
  ],
);

// ── Relations ──

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  stores: many(store),
  orders: many(order),
  reviews: many(review),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const storeRelations = relations(store, ({ one, many }) => ({
  owner: one(user, { fields: [store.userId], references: [user.id] }),
  products: many(product),
  reviews: many(review),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  store: one(store, { fields: [product.storeId], references: [store.id] }),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  reviews: many(review),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  buyer: one(user, { fields: [order.buyerId], references: [user.id] }),
  items: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, { fields: [orderItem.orderId], references: [order.id] }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
  store: one(store, { fields: [orderItem.storeId], references: [store.id] }),
}));

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, { fields: [review.userId], references: [user.id] }),
  product: one(product, {
    fields: [review.productId],
    references: [product.id],
  }),
  store: one(store, { fields: [review.storeId], references: [store.id] }),
}));
