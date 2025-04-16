"use client";

import GetDailyProperty from "@/action/daily_property/getdailyproperty";
import GetDailyShopFromProperty from "@/action/daily_property/getshopsfromproperty";
import BackButton from "@/components/backbutton";
import { LucideArrowBigLeft, LucideArrowBigRight } from "@/components/icons";
import { capitalcase, removeDuplicates } from "@/utils/methods";
import { ShopStatus, daily_shop, property, shop } from "@prisma/client";
import { Modal } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PropertiesViewProps {
  id: number;
}

const PropertiesView = (props: PropertiesViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<daily_shop[]>([]);

  const [property, setProperty] = useState<property>();

  const [category, setCategory] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [filtershop, setFilterShop] = useState<daily_shop[]>([]);

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterShop(shops);
    } else {
      const temp = shops.filter((item: any) => {
        return capitalcase(item.shop_category.name) === category;
      });
      setFilterShop(temp);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const propertyresponse = await GetDailyProperty({
        id: parseInt(props.id.toString()),
      });

      if (propertyresponse.status) {
        setProperty(propertyresponse.data!);
      }

      const shopresponse = await GetDailyShopFromProperty({
        propertyid: props.id,
      });

      if (shopresponse.status) {
        // short the shop by name

        //  example of sorting I-43,I-54,O-34,O-23 to I-43,I-54,O-23,O-34

        const customSort = (a: any, b: any) => {
          let numA: number;
          let numB: number;

          // Extract numeric part from shop IDs
          if (a.shopNumber.includes("-")) {
            numA = parseInt(a.shopNumber.split("-")[1]);
          } else {
            numA = parseInt(a.shopNumber);
          }

          if (b.shopNumber.includes("-")) {
            numB = parseInt(b.shopNumber.split("-")[1]);
          } else {
            numB = parseInt(b.shopNumber);
          }

          // Compare numeric parts
          return numA - numB;
        };

        const sortshop = shopresponse.data?.sort(customSort);

        // shopresponse.data?.sort((a: any, b: any) => {
        //   if (a.shopNumber < b.shopNumber) {
        //     return -1;
        //   }
        //   if (a.shopNumber > b.shopNumber) {
        //     return 1;
        //   }
        //   return 0;
        // });

        // console.log(shopresponse.data);

        setShops(shopresponse.data ?? []);
        setFilterShop(shopresponse.data ?? []);
      }

      let temp: string[] = [];

      shopresponse.data?.map((item: any) => {
        if (!temp.includes(item.shop_category.name)) {
          temp.push(capitalcase(item.shop_category.name));
        }
      });

      setCategory(["All", ...removeDuplicates(temp)]);

      setIsLoading(false);
    };
    init();
  }, [props.id]);

  const [open, setOpen] = useState(false);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="flex gap-2 border-b border-gray-300 items-center">
            <BackButton />
            <p className="text-xl p-2  font-semibold">Property Details</p>
            <div className="grow"></div>
            <button
              onClick={() => setOpen(true)}
              className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
            >
              Terms & Condition
            </button>
            <div className="w-2"></div>
          </div>
          <div className="px-4 py-2 grid grid-cols-2 gap-4 mt-2">
            <p className="text-xs leading-3">
              Propery Name <br />
              <span className="text-sm text-gray-500 font-medium">
                {property?.name}
              </span>
            </p>
            <p className="text-xs leading-3">
              Locality <br />
              <span className="text-sm text-gray-500 font-medium">
                {property?.locality}
              </span>
            </p>
            <p className="text-xs leading-3">
              City <br />
              <span className="text-sm text-gray-500 font-medium">
                {property?.city}
              </span>
            </p>

            <p className="text-xs leading-3">
              Pin Code <br />
              <span className="text-sm text-gray-500 font-medium">
                {property?.pincode}
              </span>
            </p>
            <p className="text-xs leading-3 col-span-2">
              Address <br />
              <span className="text-sm text-gray-500 font-medium">
                {property?.address}
              </span>
            </p>
          </div>
          <div className="flex gap-2 p-2 mt-2">
            <div className="grow"></div>

            {/* {shops.length < property?.total_shops! && (
              <Link
                href={`/dashboard/dailyshops/add/${props.id}`}
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
              >
                Add Units
              </Link>
            )} */}
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm">
          <iframe
            src={`https://maps.google.com/maps?q=${property?.latitude},${property?.longitude}&output=embed`}
            width="400"
            height="300"
            loading="lazy"
            className="border-0 w-full h-full rounded-sm"
          ></iframe>
        </div>
      </div>

      {filtershop.length >= 1 && (
        <>
          <div className="mt-4 flex">
            {category.map((item: string, index: number) => (
              <p
                key={index}
                onClick={() => {
                  filtershopbycategory(item);
                  setSelectedCategory(item);
                }}
                className={`border-b-2 border-gray-300 px-4 py-2 text-sm font-medium cursor-pointer ${
                  selectedCategory === item ? "border-green-500" : ""
                }`}
              >
                {item}
              </p>
            ))}
            <p className="border-b-2 border-gray-300 px-4 grow"></p>
          </div>
          <div className="w-full bg-white rounded-sm shadow-sm mt-4">
            <div className="bg-white rounded-sm shadow-sm">
              <ShowShops
                shops={filtershop}
                name={capitalcase(selectedCategory) + " Units"}
              />
            </div>
          </div>
        </>
      )}
      <Modal
        title="Terms & Condition"
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        className="my-10 h-[600px] overflow-y-scroll"
      >
        <p className="text-sm  font-normal my-2 text-rose-500">
          1. The DNHPDA reserves the right to cancel the allotment of space at
          Kala-Kendra, Auditorium and Banquet Hall in case of any government
          functions without assigning any reason thereof.
        </p>

        <p className="text-sm text-gray-800 font-normal my-2">
          2. The applicant shall ensure that they shall maintain the floor and
          premises of the Banquet hall clean by avoiding littering of food
          materials over the wooden floors, by sufficient provision of waste
          bins etc.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, and penalty
          shall be levied amounting to Rs. 5000/- and the security deposit
          submitted to the department shall be forfeited without any further
          explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          4. The applicant shall not stick any adhesive based posters in the
          entire premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          5. The applicant shall ensure that there shall not be any damages to
          the assets such as Auditorium and Banquet Hall/Exhibition Hall space,
          Acoustic wall panels, lighting components, floor carpets, stage
          platform, mic podiums, projectors, lighting Components and its
          accessories, Audio sound system and accessories, seating chairs, V.I.P
          chairs, recliners, electrical connections, main stage accessories,
          viewers chairs at Pavilion area, seating steps at Open air
          Amphitheatre area etc. of the allotted space area/ premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          6. The penalty of Rs. 100/- per Sq. Mt is imposed in case the
          applicant has not taken the permission and approval from the competent
          authority for utilizing the extra open space (Outer space) occupied
          for function other than allotment space.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          7. Havan, Pooja, Outdoor cooking, Tandoor etc. is prohibited in the
          Extra Open Space (Outer Space).
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          8. The entire premises shall be available from 7:00 AM to 10:00 PM
          only.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          9. The applicant shall obey the timing orders and failing to do so,
          shall lead to forfeiture of the deposit submitted by the applicant.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          10. Havan, Pooja, Katha, Crackers etc. shall not be allowed and is
          strictly prohibited in Auditorium Hall, Banquet hall, Exhibition Hall,
          Bride room and Groom Room. The same shall only be allowed in Open Air
          Amphitheatre with all the preventive measures.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          11. Eating and drinking is strictly prohibited inside the Auditorium
          Halls and if found, the applicant shall have to pay a penalty amount
          of Rs. 5000/- to the concerned department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          12. After receiving or informing the applicant about the Allotment
          Order, the payment should be done within a week by the applicant. If
          the applicant fails to do so, the booked date / allotted date shall be
          considered as cancelled without any intimation and same shall be
          allotted to the other applicant in the queue.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          13. If the applicant has to change their booked date / allotted date,
          25% shifting charges shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          14. If the applicant has to cancel their booked date / allotted date,
          50% Cancellation charges shall be applied and the remaining amount
          shall be transferred to the applicant by the department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          15. If the applicant has to cancel their booked date / allotted date
          before 1 week, in that case 100% Cancellation charge shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          16. Smoking, drinking of alcohol, non-vegetarian food, chewing of
          tobacco is strictly prohibited in the entire premises and if found,
          you shall have to pay a penalty amount of Rs. 5000/- and also the
          security deposit submitted to the department shall be forfeited
          without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          17. Violation or lapses found in any of the above conditions by the
          applicant, the competent authority has the right to take necessary
          action or by imposing the penalty as assigned thereof.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          18. The applicant shall manage all the parking arrangements of their
          guests by their own and shall not park the vehicles at service roads /
          main road. The applicant must not tamper with any of the car park
          systems, including access control, ventilation, fire protection,
          surveillance and communications in the parking area.
        </p>
      </Modal>
    </div>
  );
};

export default PropertiesView;

const ShowShops = (props: { shops: daily_shop[]; name: string }) => {
  const count = 20;
  const [skip, setSkip] = useState(0);
  const [shop, setShop] = useState<daily_shop[]>(props.shops.slice(0, count));

  const next = () => {
    if (skip + count < props.shops.length) {
      setSkip(skip + count);
      setShop(props.shops.slice(skip + count, skip + count + count));
    }
  };
  const prev = () => {
    if (skip - count >= 0) {
      setSkip(skip - count);
      setShop(props.shops.slice(skip - count, skip));
    }
  };

  useEffect(() => {
    setSkip(0);
    setShop(props.shops.slice(0, count));
  }, [props.shops]);
  return (
    <>
      <div className="flex  border-b border-gray-300 pr-4 items-center gap-2">
        <p className="text-lg p-2 font-medium">{props.name}</p>
        <div className="grow"></div>

        <button
          className="bg-white text-2xl rounded-full border border-black"
          onClick={prev}
        >
          <LucideArrowBigLeft />
        </button>

        <button
          className="bg-white text-2xl rounded-full border border-black"
          onClick={next}
        >
          <LucideArrowBigRight />
        </button>
      </div>
      <div className="flex p-2 gap-4 flex-wrap justify-start">
        {shop.map((item: daily_shop, index: number) => (
          <PropertiesDeatils
            key={index}
            id={item.id.toString()}
            status={item.status}
            name={item.name}
          />
        ))}
      </div>
    </>
  );
};

interface PropertiesDeatilsProps {
  name: string;
  status: string;
  id: string;
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
  const getColor = (value: ShopStatus): string => {
    switch (value) {
      case ShopStatus.VACANT:
        return "border-green-500 bg-gradient-to-r from-green-400 to-green-500";
      case ShopStatus.AUCTION:
        return "border-yellow-500 bg-gradient-to-r from-yellow-400 to-yellow-500";
      case ShopStatus.MAINTENANCE:
        return "border-blue-500 bg-gradient-to-r from-blue-400 to-blue-500";
      case ShopStatus.RENTED:
        return "border-red-500 bg-gradient-to-r from-red-400 to-red-500";
      case ShopStatus.UNAVAILABLE:
        return "border-purple-500 bg-gradient-to-r from-purple-400 to-purple-500";
      default:
        return "border-green-500 bg-gradient-to-r from-green-400 to-green-500";
    }
  };
  return (
    <Link href={`/dashboard/dailyshops/details/${props.id}`} target="_blank">
      <div
        className={`border rounded-md grid place-items-center p-2 min-w-24 `}
      >
        <p className="text-xs leading-3">Unit name</p>
        <p className="text-lg leading-5">{props.name}</p>
        {/* <p
          className={`text-sm   text-white px-2 rounded ${getColor(
            props.status as ShopStatus
          )}`}
        >
          {props.status}
        </p> */}
      </div>
    </Link>
  );
};
