
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio } from "lucide-react";

export function HomeTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Button size="lg" className="gap-2">
              <Radio className="h-5 w-5" />
              Start Radio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
