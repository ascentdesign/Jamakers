import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/LoginForm";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <Link href="/">
            <Button variant="ghost" size="sm" className="-ml-2 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}