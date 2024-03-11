"use client";

import CreateProperty from "@/action/property/createproperty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreatePropertySchema } from "@/schema/createproperty";
import { handleDecimalChange, handleNumberChange } from "@/utils/methods";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

const AddPropertyPage = () => {
  const userid: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();
  const name = useRef<HTMLInputElement>(null);
  const address = useRef<HTMLInputElement>(null);
  const pin = useRef<HTMLInputElement>(null);
  const locality = useRef<HTMLInputElement>(null);
  const shops = useRef<HTMLInputElement>(null);
  const floors = useRef<HTMLInputElement>(null);
  const personname = useRef<HTMLInputElement>(null);
  const contact = useRef<HTMLInputElement>(null);
  const latitude = useRef<HTMLInputElement>(null);
  const longitude = useRef<HTMLInputElement>(null);

  const create = async () => {
    const result = safeParse(CreatePropertySchema, {
      name: name.current?.value,
      address: address.current?.value,
      pincode: pin.current?.value,
      locality: locality.current?.value,
      city: "Silvassa",
      total_shops: parseInt(shops.current?.value ?? "0"),
      total_floors: parseInt(floors.current?.value ?? "0"),
      contact_person: personname.current?.value,
      contact_number: contact.current?.value,
      latitude: parseFloat(latitude.current?.value ?? "0"),
      longitude: parseFloat(longitude.current?.value ?? "0"),
      priority: 1,
    });

    if (result.success) {
      const createProperty = await CreateProperty({
        name: result.data.name,
        address: result.data.address,
        pincode: result.data.pincode,
        locality: result.data.locality,
        city: "Silvassa",
        total_shops: result.data.total_shops,
        total_floors: result.data.total_floors,
        contact_person: result.data.contact_person,
        contact_number: result.data.contact_number,
        latitude: result.data.latitude,
        longitude: result.data.longitude,
        priority: 1,
        creadtedById: userid,
      });

      if (!createProperty.status) return toast.error(createProperty.message);
      toast.success("Property added successfully");
      router.back();
    } else {
      let errorMessage = "";
      if (result.issues[0].input) {
        errorMessage = result.issues[0].message;
      } else {
        errorMessage = result.issues[0].path![0].key + " is required";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="p-6 sm:p-10">
        <h1 className="text-[#162f57] text-2xl font-semibold">
          Add a property
        </h1>
        <p className="text-sm mt-4 mb-2">
          Get started by adding your property&apos;s address and details below.
        </p>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500">GENERAL INFORMATION</p>

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="name">Property name</Label>
            <Input
              id="name"
              type="text"
              className="w-full bg-gray-100"
              ref={name}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="address">Property address</Label>
            <Input
              id="address"
              type="text"
              className="w-full bg-gray-100"
              ref={address}
            />
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="pin">Zip/Postcode</Label>
              <Input
                id="pin"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                maxLength={6}
                ref={pin}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="locality">Locality</Label>
              <Input
                id="locality"
                type="text"
                className="w-full bg-gray-100"
                ref={locality}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="shops">Total Shops</Label>
              <Input
                id="shops"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={shops}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="floors">Total Floors</Label>
              <Input
                id="floors"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={floors}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="personname">Contact Person Name</Label>
              <Input
                id="personname"
                type="text"
                className="w-full bg-gray-100"
                ref={personname}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="contact">Contact Person Number</Label>
              <Input
                id="contact"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                maxLength={10}
                ref={contact}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleDecimalChange}
                ref={latitude}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleDecimalChange}
                ref={longitude}
              />
            </div>
          </div>

          <Button onClick={create} className="w-full mt-4">
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};
export default AddPropertyPage;
