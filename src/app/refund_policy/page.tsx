"use client";
import { Fa6SolidArrowLeftLong } from "@/components/icons";
import { useRouter } from "next/navigation";

const TermAndConditionPage = () => {
  const router = useRouter();
  return (
    <div className="bg-gray-100 min-h-screen px-6 py-4">
      <div className="bg-white shadow rounded-md w-full flex gap-6 px-6 py-2 items-center">
        <Fa6SolidArrowLeftLong
          className="cursor-pointer"
          onClick={() => router.back()}
        />
        <h4 className="text-xl font-semibold text-center grow">
          Refund and Cancellation Policy
        </h4>
      </div>

      <div className="bg-white p-8 shadow rounded-md w-full mt-3">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Cancellation by Tenant
          </h2>
          <p className="text-lg">
            Tenants may request to cancel their rental agreement for PDA-owned
            properties listed on PDA DNH RENT under certain conditions.
            Cancellation requests must be submitted in writing to PDA DNH for
            review and approval.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
          <p className="text-lg">
            Refunds for cancelled rental agreements are subject to the terms
            outlined in the rental agreement and applicable laws and
            regulations. PDA DNH reserves the right to assess each cancellation
            request on a case-by-case basis to determine refund eligibility.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cancellation Fees</h2>
          <p className="text-lg">
            Depending on the terms of the rental agreement, tenants may be
            subject to cancellation fees in the event of a cancelled rental
            agreement. Cancellation fees, if applicable, will be deducted from
            any refund issued to the tenant.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Cancellation by PDA
          </h2>
          <p className="text-lg">
            In the event that a PDA-owned property becomes unavailable for rent
            due to unforeseen circumstances or other reasons, PDA DNH reserves
            the right to cancel the rental agreement. In such cases, tenants
            will be notified promptly, and any rental payments already made will
            be refunded in full.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Processing Time</h2>
          <p className="text-lg">
            Refunds for cancelled rental agreements will be processed within a
            reasonable timeframe, subject to administrative procedures and
            banking processing times. PDA DNH will make every effort to expedite
            the refund process and keep tenants informed of the status of their
            refund.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Non-Refundable Fees
          </h2>
          <p className="text-lg">
            Certain fees, such as administrative fees or processing fees, may be
            non-refundable in the event of a cancelled rental agreement. These
            fees will be clearly outlined in the rental agreement or
            communicated to the tenant at the time of cancellation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Refund Method</h2>
          <p className="text-lg">
            Refunds for cancelled rental agreements will be issued using the
            same payment method originally used by the tenant for rental
            payments, unless otherwise agreed upon by both parties.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p className="text-lg">
            For inquiries regarding refunds and cancellations, tenants can
            contact PDA DNH at the provided contact information. Our team is
            dedicated to assisting tenants and resolving any issues related to
            refunds and cancellations in a timely manner.Contact via
            E-mail:dnhpda@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermAndConditionPage;
