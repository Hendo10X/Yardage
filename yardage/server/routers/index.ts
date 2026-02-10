import { router } from "../trpc";
import { storeRouter } from "./store";
import { productRouter } from "./product";
import { categoryRouter } from "./category";
import { orderRouter } from "./order";
import { reviewRouter } from "./review";
import { vendorRouter } from "./vendor";
import { messageRouter } from "./message";
import { authRouter } from "./auth";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  store: storeRouter,
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  review: reviewRouter,
  vendor: vendorRouter,
  message: messageRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
