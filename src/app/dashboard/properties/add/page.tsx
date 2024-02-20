"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AddPropertyPage = () => {
  return (
    <>
      <div className="p-6 sm:p-10">
        <h1 className="text-[#162f57] text-2xl font-semibold">
          Add a property
        </h1>
        <p className="text-sm mt-4 mb-2">
          Get started by addding your property&apos;s address and details below.
        </p>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500">GENERAL INFORMATION</p>

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="name">Property name</Label>
            <Input id="name" type="text" className="w-full bg-gray-100" />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="address">Property address</Label>
            <Input id="address" type="text" className="w-full bg-gray-100" />
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="pin">Zip/Postcode</Label>
              <Input id="pin" type="text" className="w-full bg-gray-100" />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="mobile">City</Label>
              <Input id="mobile" type="text" className="w-full bg-gray-100" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="shops">Total Shops</Label>
              <Input id="shops" type="text" className="w-full bg-gray-100" />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="floors">Total Floors</Label>
              <Input id="floors" type="text" className="w-full bg-gray-100" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="personname">Contact Person Name</Label>
              <Input
                id="personname"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="contact">Contact Person Number</Label>
              <Input id="contact" type="text" className="w-full bg-gray-100" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="text" className="w-full bg-gray-100" />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
          </div>

          <Button className="w-full mt-4">Submit</Button>
        </div>
      </div>
    </>
  );
};
export default AddPropertyPage;
