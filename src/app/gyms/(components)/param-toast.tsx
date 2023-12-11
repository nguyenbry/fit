"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ParamToast() {
  const toast = useToast();
  const sp = useSearchParams();
  const router = useRouter();

  const message = sp.get("message");
  useEffect(() => {
    if (message) {
      toast.toast({
        title: "Error creating gym",
        description: message,
        variant: "destructive",
      });
      router.replace("/gyms");
    }
  }, [message, router]);

  return null;
}
