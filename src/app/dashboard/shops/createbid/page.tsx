"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const AddPropertyPage = () => {
  const items = [
    {
      id: "forwomen",
      label: "For Women",
    },
    {
      id: "category",
      label: "For Reserved Category",
    },
    {
      id: "abled",
      label: "For Differently Abled",
    },
  ] as const;

  const [field, setField] = useState<string[]>([]);

  return (
    <>
      <div className="p-6 sm:p-10">
        <h1 className="text-[#162f57] text-2xl font-semibold">Create Bid</h1>
        <p className="text-sm mt-4 mb-2">
          Get started by addding your Bid details below.
        </p>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500 text-center">General Information</p>

          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="title">Bid Title</Label>
            <Input id="title" type="text" className="w-full bg-gray-100" />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="description">Bid Description</Label>
            <Textarea
              id="description"
              className="w-full bg-gray-100 h-20 resize-none"
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="instructions">Bid Instructions</Label>
            <Textarea
              id="instructions"
              className="w-full bg-gray-100 h-20 resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="starttime">Start Date Time</Label>
              <Input
                id="starttime"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="enddatetime">End Date Time</Label>
              <Input
                id="enddatetime"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="enddatetime">Document Deadline Date</Label>
              <Input
                id="enddatetime"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="minbid">Minimum Bid</Label>
              <Input id="minbid" type="text" className="w-full bg-gray-100" />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bidinc">Bid Increment % / Amount</Label>
              <RadioGroup defaultValue="bypercentage" className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bypercentage" id="r1" />
                  <Label htmlFor="r1">By Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="byamount" id="r2" />
                  <Label htmlFor="r2">By Amount</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="minbid">Min Bid Increment</Label>
              <Input id="minbid" type="text" className="w-full bg-gray-100" />
            </div>
          </div>

          <p className="text-gray-500 mt-4 text-center">Fees Structure</p>
          <Separator />

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feesamount">Fees Amount</Label>
              <Input
                id="feesamount"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feespercentage">Fees % / Amount</Label>
              <RadioGroup
                defaultValue="feesbypercentage"
                className="flex gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feesbypercentage" id="fr1" />
                  <Label htmlFor="fr1">By Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feesbyamount" id="fr2" />
                  <Label htmlFor="fr2">By Amount</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feespercentage">Is Fees Refundable</Label>
              <RadioGroup
                defaultValue="no"
                className="flex gap-2"
                id="feespercentage"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="rr1" />
                  <Label htmlFor="rr1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="rr2" />
                  <Label htmlFor="rr2">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdamount">EMD Amount</Label>
              <Input
                id="emdamount"
                type="text"
                className="w-full bg-gray-100"
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdpercentage">EMD % / Amount</Label>
              <RadioGroup defaultValue="emdbypercentage" className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emdbypercentage" id="emdr1" />
                  <Label htmlFor="emdr1">By Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emdbyamount" id="emdr2" />
                  <Label htmlFor="emdr2">By Amount</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdpercentage">Is EMD Refundable</Label>
              <RadioGroup
                defaultValue="yes"
                className="flex gap-2"
                id="emdpercentage"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="emdrr1" />
                  <Label htmlFor="emdrr1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="emdrr2" />
                  <Label htmlFor="emdrr2">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgamount">BG Amount</Label>
              <Input id="bgamount" type="text" className="w-full bg-gray-100" />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgpercentage">BG % / Amount</Label>
              <RadioGroup
                id={"bgpercentage"}
                defaultValue="bgbypercentage"
                className="flex gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bgbypercentage" id="bgfr1" />
                  <Label htmlFor="bgfr1">By Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bgbyamount" id="bgfr2" />
                  <Label htmlFor="bgfr2">By Amount</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgpercentage">Is BG Refundable</Label>
              <RadioGroup defaultValue="yes" className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="bgrr1" />
                  <Label htmlFor="bgrr1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="bgrr2" />
                  <Label htmlFor="bgrr2">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <p className="text-gray-500 mt-4 text-center">Document Required</p>
          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="doctitle">Document Title</Label>
            <Input id="doctitle" type="text" className="w-full bg-gray-100" />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="docdescription">Document Description</Label>
            <Textarea
              id="docdescription"
              className="w-full bg-gray-100 h-20 resize-none"
            />
          </div>

          <p className="text-gray-500 mt-4 text-center">
            Terms & Conditions Document
          </p>
          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="filenumber">File Number</Label>
            <Input id="filenumber" type="text" className="w-full bg-gray-100" />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="filesubject">File Subject</Label>
            <Textarea
              id="filesubject"
              className="w-full bg-gray-100 h-20 resize-none"
            />
          </div>

          <div className="flex gap-4 mt-4 items-center">
            <Label htmlFor="termfile">Terms & Conditions File</Label>
            <Button variant={"secondary"}>Upload File</Button>
            <p className="text-sm">No File Selected</p>
          </div>

          <p className="text-gray-500 mt-4">Select Bidder Category</p>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mt-1 items-center ">
              <Checkbox
                id={item.id.toString()}
                checked={field.includes(item.id)}
                onCheckedChange={(value) => {
                  if (value) {
                    setField((prev) => [...prev, item.id]);
                  } else {
                    setField((prev) => prev.filter((x) => x !== item.id));
                  }
                }}
              />

              <Label
                className="text-sm font-normal cursor-pointer"
                htmlFor={item.id.toString()}
              >
                {item.label}
              </Label>
            </div>
          ))}

          <Button className="w-full mt-4">Submit</Button>
        </div>
      </div>
    </>
  );
};
export default AddPropertyPage;
