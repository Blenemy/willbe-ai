import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";

const ProfileTab = () => {
  return (
    <Card className="h-full w-full p-4">
      <h2 className="mb-5 font-bold text-xl">My profile</h2>

      <Card>
        <CardContent className="py-6">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div>
                  <p className="font-bold">User name</p>
                </div>
                <div className="flex flex-col">
                  <p className="-mb-1">User role</p>
                  <p>User location</p>
                </div>
              </div>
            </div>

            <div>
              <Button type="button" variant={"outline"}>
                Edit <Edit />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Card>
  );
};

export default ProfileTab;
