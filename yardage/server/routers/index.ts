import { router } from "../trpc";
import { productRouter } from "./product";
import { wishlistRouter } from "./wishlist";
import { authRouter } from "./auth";
import { storeRouter } from "./store";
import { categoryRouter } from "./category";
import { orderRouter } from "./order";
import { reviewRouter } from "./review";
import { vendorRouter } from "./vendor";
import { messageRouter } from "./message";
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
  wishlist: wishlistRouter,
});

export type AppRouter = typeof appRouter;
