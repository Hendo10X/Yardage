import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { order } from "@/db/schema";
import { verifyTransaction } from "@/lib/paystack";
import { OrderStatus, PaymentStatus } from "@/server/enums";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const reference = event.data.reference as string;

    const [found] = await db
      .select()
      .from(order)
      .where(eq(order.paymentReference, reference))
      .limit(1);

    if (!found || found.paymentStatus === PaymentStatus.PAID) {
      return new Response("OK", { status: 200 });
    }

    const result = await verifyTransaction(reference);

    if (
      result.data.status === "success" &&
      result.data.amount === found.totalAmount
    ) {
      await db
        .update(order)
        .set({
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
          paidAt: new Date(result.data.paid_at),
        })
        .where(eq(order.id, found.id));
    }
  }

  return new Response("OK", { status: 200 });
}
