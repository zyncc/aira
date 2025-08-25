import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ContactModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card border-border/20 shadow-2xl sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-foreground">Get in Touch</DialogTitle>
          <DialogDescription className="text-muted-foreground leading-relaxed">
            Have a question or need support? We&apos;d love to hear from you. Reach out to
            us directly via email.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 space-y-6">
          <div className="space-y-4 text-center">
            <div className="bg-muted/30 border-border/20 rounded-lg border p-6">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                <Link
                  href={"mailto:support@airaclothing.in"}
                  className="text-foreground font-mono text-lg"
                >
                  support@airaclothing.in
                </Link>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
