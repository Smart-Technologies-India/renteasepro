import { SolarAltArrowDownLinear } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardPage = () => {
  return (
    <>
      <div className="p-6 sm:p-10">
        <div className="flex flex-wrap w-full gap-4 items-center my-6">
          <p className="font-semibold text-xl text-[#162f56]">TABREZ CHOUHAN</p>
          <div className="grow"></div>
          {/* dropdown one start here */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 flex bg-[#e2e9f1] hover:bg-[#e2e9f1] outline-none border-0 focus:outline-none focus:border-0"
              >
                <p className="font-semibold text-lg text-[#99a4ae]">
                  Properties
                </p>
                <SolarAltArrowDownLinear className="textx-2xl" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Keyboard shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  New Team
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GitHub</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* dropdown one end here */}

          {/* dropdown two start here */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 flex bg-[#e2e9f1] hover:bg-[#e2e9f1] outline-none border-0 focus:outline-none focus:border-0"
              >
                <p className="font-semibold text-lg text-[#99a4ae]">
                  Categories
                </p>
                <SolarAltArrowDownLinear className="textx-2xl" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Keyboard shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  New Team
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GitHub</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* dropdown two end here */}

          {/* dropdown three start here */}
          <Button className="bg-transparent rounded-md border-2 border-gray-600 hover:bg-transparent text-slate-700">
            Go to legacy dashboard
          </Button>
          {/* dropdown three end here */}
        </div>

        <div className="grid grid-cols-2 grid-rows-7 gap-4 md:grid-cols-5 md:grid-rows-3">
          <div className="bg-white h-20 shadow-sm rounded-md p-4 col-span-2 md:col-span-3">
            01
          </div>
          <div className="bg-white h-20 shadow-sm rounded-md p-4">02</div>
          <div className="bg-white h-20 shadow-sm rounded-md p-4">03</div>
          <div className="bg-white shadow-sm rounded-md p-4 col-span-2 row-span-3 md:col-span-3 md:row-span-2">
            04
          </div>
          <div className="bg-white h-20 shadow-sm rounded-md p-4 col-span-2 md:col-span-2">
            05
          </div>
          <div className="bg-white h-20 shadow-sm rounded-md p-4 col-span-2 md:col-span-2">
            06
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
