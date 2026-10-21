import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function ComponentExamples() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="shadow-none">
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => setSaved(!saved)}>
            {saved ? <Check /> : <Plus />}
            {saved ? "Saved" : "Save example"}
          </Button>
          <Button variant="outline" onClick={() => setSaved(false)}>
            Reset
          </Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardContent className="flex flex-wrap gap-3">
          <Badge>Active</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="outline">In review</Badge>
          <Badge variant="destructive">Needs attention</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
