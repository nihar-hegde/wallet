import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

export const CardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Card>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
