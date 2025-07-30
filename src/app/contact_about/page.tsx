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
        <h4 className="text-2xl font-bold text-center grow">
          Contact Us
        </h4>
      </div>

      <div className="bg-white p-8 shadow rounded-md w-full mt-6">
        <h1 className="text-3xl font-bold">About US</h1>
        <p className="text-lg">
          Welcome to PDA DNH RENT, your premier destination for accessing
          PDA-owned rental properties in Dadra and Nagar Haveli. PDA DNH, an
          integral part of the Union Territory Government of Dadra and Nagar
          Haveli and Silvassa, oversees the management and rental of PDA -owned
          properties with a commitment to fostering equitable access and
          sustainable development.
        </p>
        <p className="text-lg mt-2">
          Based at &quot;A&quot; Wing, Second Floor, District Secretariat,
          Silvassa-396230, our platform is dedicated to facilitating transparent
          and efficient rental transactions exclusively for government-owned
          properties. When you&apos;re in need of commercial spaces, our curated
          listings showcase a diverse range of properties tailored to meet the
          needs of citizens.
        </p>
        <p className="text-lg mt-2">
          At PDA DNH, we prioritize integrity and accountability in all our
          endeavors. Our team is dedicated to providing exceptional service,
          ensuring that both department and tenants experience a seamless rental
          process. As a semi-government entity, we adhere to the highest
          standards of professionalism while serving the community of Dadra and
          Nagar Haveli.
        </p>
        <p className="text-lg mt-2">
          For inquiries or assistance, please don&apos;t hesitate to contact us
          at ATP, Planning and Development Authority, &quot;A&quot; Wing, Second
          Floor, District Secretariat, Silvassa-396230, or via email at
          dnhpda@gmail.com. We&apos;re here to support you in finding the ideal
          government-owned rental property to suit your needs.
        </p>
        <p className="text-lg mt-2">
          Thank you for choosing PDA DNH RENT as your trusted partner for
          government rentals in Dadra and Nagar Haveli.
        </p>
        <h1 className="text-3xl font-bold mt-6 mb-4">Contact Us</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            Planning and Development Authority DNH
          </h2>
          <p className="text-lg">
            Address: &quot;A&quot; Wing, Second Floor, District Secretariat,
            Silvassa-396230
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Office Hours:</h2>
          <p className="text-lg">Monday to Friday: 10:00 AM - 5:00 PM</p>
          <p className="text-lg">Saturday and Sunday: Closed</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Email: </h2>
          <p className="text-lg">dnhpda@gmail.com</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Phone: </h2>
          <p className="text-lg">0260-2630146/147</p>
          <p className="text-lg">
            For inquiries, assistance with rental agreements, or any other
            concerns, please don&apos;t hesitate to reach out to us via email or
            phone. Our dedicated team at PDA DNH is here to assist you with all
            your government-owned rental property needs.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermAndConditionPage;
