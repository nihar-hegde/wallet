import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NoWalletFound() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          No Wallet Detected
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          It appears that you don&apos;t have any wallet in this browser. Would
          you like to create a new account or import one?
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" variant="default">
          Create New Account
        </Button>
        <Button className="w-full" variant="outline">
          Import Existing Account
        </Button>
        <div className="text-center mt-4">
          <Link
            href="/onboarding/1"
            className="text-sm text-primary hover:underline"
          >
            Go to Onboarding
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
