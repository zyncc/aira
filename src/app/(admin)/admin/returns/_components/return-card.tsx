"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ApproveFinalReturn,
  ApproveReturn,
  DeclineFinalReturn,
  DeclineReturn,
} from "@/functions/returns/admin-return-actions";
import { convertImage } from "@/lib/convert-image";
import { FullReturnType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { Calendar, CheckCircle, CircleOff, Loader2, Package, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface ReturnsCardProps {
  data: FullReturnType;
}

export function ReturnsCard({ data }: ReturnsCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const reasonSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
  });

  const returnForm = useForm<z.infer<typeof reasonSchema>>({
    resolver: zodResolver(reasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  const finalReturnForm = useForm<z.infer<typeof reasonSchema>>({
    resolver: zodResolver(reasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onReturnSubmit(values: z.infer<typeof reasonSchema>) {
    setIsDeclineReturnLoading(true);
    const { message, success } = await DeclineReturn(data.id, values.reason);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    setIsDeclineReturnOpen(false);
    setIsDeclineReturnLoading(false);
  }

  async function onFinalReturnSubmit(values: z.infer<typeof reasonSchema>) {
    setIsDeclineFinalApproveLoading(true);
    const { message, success } = await DeclineFinalReturn(data.id, values.reason);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    setIsDeclineFinalApproveOpen(false);
    setIsDeclineFinalApproveLoading(false);
  }

  const [isApproveReturnLoading, setIsApproveReturnLoading] = useState(false);
  const [isFinalApproveLoading, setIsFinalApproveLoading] = useState(false);
  const [isDeclineReturnLoading, setIsDeclineReturnLoading] = useState(false);
  const [isDeclineFinalApproveLoading, setIsDeclineFinalApproveLoading] = useState(false);
  const [isDeclineReturnOpen, setIsDeclineReturnOpen] = useState(false);
  const [isDeclineFinalApproveOpen, setIsDeclineFinalApproveOpen] = useState(false);

  async function handleReturnApprove() {
    setIsApproveReturnLoading(true);
    const { message, success } = await ApproveReturn(data.id);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    setIsApproveReturnLoading(false);
  }

  async function handleFinalReturnApprove() {
    setIsFinalApproveLoading(true);
    const { message, success } = await ApproveFinalReturn(data.id);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    setIsFinalApproveLoading(false);
  }

  return (
    <Card className="mx-auto w-full shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold text-balance">
              #{data.id}
            </CardTitle>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm md:gap-3">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                Order: #{data.order.id}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(data.createdAt)}
              </div>
              {data.user && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <Link href={`/admin/users/${data.user.id}`}>{data.user.name}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <Badge
          variant={data.type == "return" ? "destructive" : "default"}
          className="mt-2"
        >
          {_.capitalize(data.type)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {data.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-muted relative aspect-[9/16] max-h-[500px] w-full overflow-hidden rounded-lg">
                      <Image
                        src={convertImage(image, 500)}
                        alt={`Return product image ${index + 1}`}
                        fill
                        className="aspect-[9/16] object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="space-y-6">
            <p className="space-y-2 text-pretty">{data.reason}</p>
            {data.notApprovedReason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h4 className="mb-1 font-medium text-red-800">
                  Initial Rejection Reason
                </h4>
                <p className="text-sm text-red-700">{data.notApprovedReason}</p>
              </div>
            )}
            {data.finalNotApprovedReason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h4 className="mb-1 font-medium text-red-800">Final Rejection Reason</h4>
                <p className="text-sm text-red-700">{data.finalNotApprovedReason}</p>
              </div>
            )}
            <div className="space-y-3 border-t pt-4">
              {!data.approved && (
                <div className="flex items-center gap-x-3">
                  <AlertDialog
                    open={isDeclineReturnOpen}
                    onOpenChange={setIsDeclineReturnOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1" variant="destructive">
                        <CircleOff className="mr-2 h-4 w-4" />
                        Decline Return
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Decline Return Request</AlertDialogTitle>
                      </AlertDialogHeader>
                      <Form {...returnForm}>
                        <form
                          onSubmit={returnForm.handleSubmit(onReturnSubmit)}
                          id="decline-return-form"
                        >
                          <FormField
                            control={returnForm.control}
                            name="reason"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reason</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Reason"
                                    {...field}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeclineReturnLoading}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          disabled={isDeclineReturnLoading}
                          form="decline-return-form"
                          type="submit"
                          variant={"destructive"}
                        >
                          {isDeclineReturnLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Decline Return
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1" variant="default">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Return
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve Return Request</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isApproveReturnLoading}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          disabled={isApproveReturnLoading}
                          onClick={handleReturnApprove}
                        >
                          {isApproveReturnLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Approve Return
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              {data.approved === true && !data.finalApproved && (
                <div className="flex items-center gap-x-3">
                  <AlertDialog
                    open={isDeclineFinalApproveOpen}
                    onOpenChange={setIsDeclineFinalApproveOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1" variant="destructive">
                        <CircleOff className="mr-2 h-4 w-4" />
                        Decline Final Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Decline Final Approval</AlertDialogTitle>
                      </AlertDialogHeader>
                      <Form {...finalReturnForm}>
                        <form
                          onSubmit={finalReturnForm.handleSubmit(onFinalReturnSubmit)}
                          id="decline-final-approve-form"
                        >
                          <FormField
                            control={finalReturnForm.control}
                            name="reason"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reason</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Reason"
                                    {...field}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeclineFinalApproveLoading}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          disabled={isDeclineFinalApproveLoading}
                          variant={"destructive"}
                          form="decline-final-approve-form"
                        >
                          {isDeclineFinalApproveLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Decline Final Approve
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1" variant="default">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Final Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Final Approval</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to give final approval to this return?
                          This action confirms that the returned product has been
                          inspected and meets return criteria.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isFinalApproveLoading}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          disabled={isFinalApproveLoading}
                          onClick={handleFinalReturnApprove}
                        >
                          {isFinalApproveLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Final Approve
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
