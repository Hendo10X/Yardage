import { router } from "../trpc";
import { storeRouter } from "./store";
import { productRouter } from "./product";
import { categoryRouter } from "./category";
import { orderRouter } from "./order";
import { reviewRouter } from "./review";

export const appRouter = router({
  store: storeRouter,
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;
