"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Review } from "@/lib/types";
import { Calendar, Image as ImageIcon } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  userName?: string;
  productName?: string;
  userAvatar?: string | null;
}

export function ReviewCard({
  review,
  userName = "Anonymous",
  productName = "Product",
  userAvatar,
}: ReviewCardProps) {
  const images = review.images?.filter((img) => img) || [];
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Header with User Info */}
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{review.title}</CardTitle>
              <CardDescription className="mt-1">{userName}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            {productName}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-foreground text-sm leading-relaxed">{review.description}</p>

        {/* Images Gallery */}
        {images.length > 0 && (
          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
              <ImageIcon className="size-4" />
              <span>
                {images.length} image{images.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div
              className={`grid gap-2 ${
                images.length === 1
                  ? "grid-cols-1"
                  : images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
              }`}
            >
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className="bg-muted relative aspect-square overflow-hidden rounded-lg"
                >
                  <ImageIcon className="object-cover transition-transform duration-200 hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Calendar className="size-4" />
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
