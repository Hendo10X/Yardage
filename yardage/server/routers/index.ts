import { router } from "../trpc";
import { storeRouter } from "./store";
import { productRouter } from "./product";
import { categoryRouter } from "./category";
import { orderRouter } from "./order";

export const appRouter = router({
  store: storeRouter,
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
