"use client";

import { type Session } from "@/auth/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { handleEmailOffers } from "@/functions/user/email-offers";
import { Activity } from "@/lib/types";
import { toast } from "sonner";

interface AccountProps {
  session: Session;
  getActivity: Activity[];
}

const Account = ({ session }: AccountProps) => {
  async function handleEmailOffersChange(event: boolean) {
    const res = await handleEmailOffers(event);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success("Settings updated successfully!");
  }

  return (
    <>
      <Card className="bg-background h-fit">
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
          <CardDescription>Manage your preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing">Marketing emails</Label>
            <Switch
              onCheckedChange={handleEmailOffersChange}
              defaultChecked={session.user.emailOffers}
              id="marketing"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Account;
