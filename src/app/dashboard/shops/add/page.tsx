"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AddPropertyPage = () => {
  return (
    <>
      <div className="p-6 sm:p-10">
        <h1 className="text-[#162f57] text-2xl font-semibold">Add a Shop </h1>
        <p className="text-sm mt-4 mb-2">
          Get started by addding your shop&apos;s details below.
        </p>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500">GENERAL INFORMATION</p>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="propertes">Select Property</Label>
              <Input
                id="propertes"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="category">Select Shop Category</Label>
              <Input id="category" type="text" className="w-full bg-gray-100" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="shopnumber">Shop Number</Label>
              <Input
                id="shopnumber"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="floornumber">Floor Number</Label>
              <Input
                id="floornumber"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="size">Shop Size</Label>
              <Input id="size" type="text" className="w-full bg-gray-100" />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="meter">Meter Number</Label>
              <Input id="meter" type="text" className="w-full bg-gray-100" />
            </div>
          </div>
          <Button className="w-full mt-4">Submit</Button>
        </div>
      </div>
    </>
  );
};
export default AddPropertyPage;
