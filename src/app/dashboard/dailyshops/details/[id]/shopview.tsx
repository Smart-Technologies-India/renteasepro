"use client";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";

import GetUser from "@/action/user/getuser";

import {
  daily_property,
  daily_rent,
  daily_rent_photo,
  daily_shop,
  RentTransactStatus,
  shop_category,
  user,
} from "@prisma/client";
import { getCookie } from "cookies-next";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import GetDailyShop from "@/action/dailyshop/getdailyshop";
import GetDailyRent from "@/action/dailyrent/getdailyrent";

import { Swiper as SwiperType } from "swiper";
import SwiperInstance from "swiper";
import { Fa6SolidAngleLeft, Fa6SolidAngleRight } from "@/components/icons";
interface ShowShopProps {
  id: number;
}

const ShopView = (props: ShowShopProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const router = useRouter();

  interface ItemsType {
    name: string;
    status: RentTransactStatus;
  }

  interface yearsDetails {
    year: number;
    rentdetails: ItemsType[];
  }

  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState<
    daily_shop & {
      property: daily_property;
      shop_category: shop_category;
      daily_rent_photo: daily_rent_photo[];
    }
  >();

  const [user, setUser] = useState<user>();

  const [rentdates, setRentdates] = useState<Date[]>([]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const shopresponse = await GetDailyShop({
        id: parseInt(props.id.toString()),
      });

      if (shopresponse.status) {
        setShop(shopresponse.data!);
      }

      const userresponse = await GetUser({ id: userid });
      if (userresponse.status) {
        setUser(userresponse.data!);
      }

      const rentresponse = await GetDailyRent({ id: props.id });

      if (rentresponse.status) {
        let rentdates_temp: Date[] = [];
        rentresponse.data
          ?.filter(
            (rent) =>
              !(
                rent.status == "USERCANCELLED" ||
                rent.status == "CANCELLED" ||
                rent.status == "NONE" ||
                rent.status == "FAILED"
              )
          )
          .forEach((rent) => {
            let start_date = new Date(rent.event_from_date);
            let end_date = new Date(rent.event_to_date);

            let dates = eachDayOfInterval({ start: start_date, end: end_date });

            if (rent.prep_day) {
              dates.push(new Date(rent.prep_day));
            }
            if (rent.handover_day) {
              dates.push(new Date(rent.handover_day));
            }

            rentdates_temp.push(...dates);
          });

        setRentdates(rentdates_temp);
      }

      setIsLoading(false);
    };
    init();
  }, [props.id, userid]);

  const swiperRef = useRef<SwiperType | null>(null);
  const calSwiperRef = useRef<SwiperType | null>(null);

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
          <div className="flex gap-2 border-b border-gray-300 py-2 px-4">
            <p className="text-xl  font-semibold">About Property</p>
            <div className="grow"></div>
            {["ADMIN", "MANAGER", "ACCOUNTANT"].includes(user?.role!) && (
              <>
                <button
                  onClick={() => {
                    router.push(`/dashboard/dailyshops/createrent/${props.id}`);
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Add Booking
                </button>
              </>
            )}

            {["USER"].includes(user?.role!) && (
              <>
                <button
                  onClick={() => {
                    router.push(
                      `/dashboard/dailyshops/createrent/${props.id}/${userid}`
                    );
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Book
                </button>
              </>
            )}
          </div>
          <div className="px-4 py-2 grid grid-cols-2 gap-4 mt-2">
            <p className="text-xs leading-3">
              Propery Name <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.property.name}
              </span>
            </p>
            <p className="text-xs leading-3">
              Unit Name <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.name}
              </span>
            </p>

            <p className="text-xs leading-3">
              Rate/Day
              <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.rate_per_day}
              </span>
            </p>
            <p className="text-xs leading-3">
              Rate Prep Day <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.rate_prep_day}
              </span>
            </p>

            <p className="text-xs leading-3">
              Rate Handover Day <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.rate_handover_day}
              </span>
            </p>

            <p className="text-xs leading-3">
              Deposit/Day <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.deposit_per_day ?? "N/A"}
              </span>
            </p>
          </div>
          <div className="flex pl-4 pb-4 gap-4 flex-wrap">
            {["ADMIN", "MANAGER", "ACCOUNTANT"].includes(user?.role!) && (
              <>
                <button
                  onClick={() => {
                    router.push(
                      `/dashboard/dailyshops/bookinghistory/${props.id}`
                    );
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  History Booking
                </button>
                {/* <button
                  onClick={() => {
                    router.push(`/dashboard/dailyshops/createrent/${props.id}`);
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Booking
                </button> */}
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-sm shadow-sm">
          <iframe
            // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.712992782698!2d73.00302414832767!3d20.270734449556546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cb42b635e293%3A0x3f857d55206a66f5!2sOffice%20Of%20District%20Collector!5e0!3m2!1sen!2sin!4v1708165544653!5m2!1sen!2sin"
            src={`https://maps.google.com/maps?q=${shop!.property?.latitude},${
              shop!.property?.longitude
            }&output=embed`}
            width="400"
            height="300"
            loading="lazy"
            className="border-0 w-full h-full rounded-sm"
          ></iframe>
        </div>
      </div>
      {shop?.daily_rent_photo.length! > 0 && (
        <>
          <div className="flex mt-4 mb-2 gap-2 items-center">
            <h1 className="text-lg font-semibold text-gray-600">
              Photo Gallery
            </h1>
            <div className="grow"></div>
            <PrevButton swiperRef={swiperRef} />{" "}
            {/* Pass the ref to PrevButton */}
            <NextButton swiperRef={swiperRef} />{" "}
            {/* Pass the ref to NextButton */}
          </div>

          <Swiper
            spaceBetween={50}
            slidesPerView={3}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            scrollbar={{ draggable: true }}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper: any) => (swiperRef.current = swiper)}
            loop={true}
            modules={[Autoplay, Pagination, Navigation]}
          >
            {shop?.daily_rent_photo.map((photo, index) => (
              <SwiperSlide key={index}>
                <div className="relative aspect-video">
                  <Image
                    src={photo.path}
                    alt="Property"
                    fill={true}
                    className="w-full h-64 object-cover rounded-sm object-center"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
      {/* 
      <h1 className="text-lg font-semibold text-gray-600 mt-4 text-center">
        Event Calendar
      </h1> */}{" "}
      <div className="flex mt-4 mb-2 gap-2 items-center">
        <h1 className="text-lg font-semibold text-gray-600">Event Calendar</h1>
        <div className="grow"></div>
        <PrevButton swiperRef={calSwiperRef} />{" "}
        {/* Pass the ref to PrevButton */}
        <NextButton swiperRef={calSwiperRef} />{" "}
        {/* Pass the ref to NextButton */}
      </div>
      <CalendarMonths
        // avaliableDays={{
        //   unavailable: [new Date("2025-04-04"), new Date("2025-03-18")],
        //   disabled: [new Date("2025-04-05"), new Date("2025-03-19")],
        // }}
        calref={calSwiperRef}
        avaliableDays={rentdates}
      />
    </div>
  );
};

export default ShopView;

interface CalendarMonthsProps {
  avaliableDays: Date[];
  calref: MutableRefObject<SwiperType | null>;
}

const CalendarMonths = (props: CalendarMonthsProps) => {
  const today = new Date();
  const months = [0, 1, 2, 3, 4, 5].map((offset) => addMonths(today, offset));
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i), "EEE")
  );

  return (
    // <div className="flex mt-2 w-full flex-wrap justify-center gap-6">

    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      // autoplay={{
      //   delay: 2500,
      //   disableOnInteraction: false,
      // }}
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      }}
      scrollbar={{ draggable: true }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper: any) => (props.calref.current = swiper)}
      // loop={true}
      modules={[Autoplay, Pagination, Navigation]}
    >
      {months.map((month, index) => {
        const firstDay = startOfMonth(month);
        const lastDay = endOfMonth(month);
        const days = eachDayOfInterval({ start: firstDay, end: lastDay });
        const startWeekday = firstDay.getDay();

        return (
          <SwiperSlide key={index}>
            <div key={index} className="bg-white shadow p-2 rounded-md">
              <h2 className="text-center font-semibold mb-2">
                {format(month, "MMMM yyyy")}
              </h2>
              <div className="grid grid-cols-7 gap-3 text-center text-sm font-medium place-items-center">
                {weekDays.map((day) => (
                  <div key={day} className="text-gray-500">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startWeekday }).map((_, i) => (
                  <div key={"empty-" + i}></div>
                ))}
                {days.map((day) => {
                  const isUnavailable = props.avaliableDays.some((d) =>
                    isSameDay(d, day)
                  );

                  return (
                    <div
                      key={day.toISOString()}
                      className={`py-1 rounded-full w-6 h-6 flex items-center justify-center ${
                        isUnavailable ? "bg-rose-500 text-white" : ""
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
            </div>
          </SwiperSlide>
        );
      })}
      {/* </div> */}
    </Swiper>
  );
};

export interface SwiperButtonProps {
  swiperRef: React.RefObject<SwiperInstance | null>; // Define the type for swiperRef
}

const NextButton = ({ swiperRef }: SwiperButtonProps) => {
  return (
    <button
      onClick={() => swiperRef.current?.slideNext()}
      className="bg-gray-200 h-8 w-8 rounded-full grid place-items-center"
    >
      <Fa6SolidAngleRight />
    </button>
  );
};

const PrevButton = ({ swiperRef }: SwiperButtonProps) => {
  return (
    <button
      onClick={() => swiperRef.current?.slidePrev()}
      className="bg-gray-200 h-8 w-8 rounded-full grid place-items-center"
    >
      <Fa6SolidAngleLeft />
    </button>
  );
};
