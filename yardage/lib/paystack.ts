const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const BASE_URL = "https://api.paystack.co";

interface InitializeParams {
  email: string;
  amount: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface InitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface VerifyData {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel: string;
  paid_at: string;
  created_at: string;
  metadata: Record<string, unknown>;
  customer: {
    email: string;
  };
}

export async function initializeTransaction(
  params: InitializeParams,
): Promise<PaystackResponse<InitializeData>> {
  const response = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: String(params.amount),
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to initialize Paystack transaction");
  }

  return response.json();
}

export async function verifyTransaction(
  reference: string,
): Promise<PaystackResponse<VerifyData>> {
  const response = await fetch(
    `${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify Paystack transaction");
  }

  return response.json();
}
