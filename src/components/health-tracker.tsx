"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import type { FamilyMember, HealthData, AppState } from "@/lib/types";

const familyMembers: FamilyMember[] = ["Adam", "Holly", "Ethan", "Elle"];

const healthSchema = z.object({
  height: z.string().min(1, "Height is required"),
  age: z.coerce.number().positive("Age must be positive"),
  gender: z.enum(["Male", "Female", "Other"]),
  weight: z.string().min(1, "Weight is required"),
  glucose: z.string().min(1, "Glucose level is required"),
  notes: z.string().max(140, "Notes must be 140 characters or less").optional(),
});

const initialHealthData: HealthData = {
  height: "",
  age: "",
  gender: "Male",
  weight: "",
  glucose: "",
  notes: "",
};

const initialAppState: AppState = {
  Adam: { ...initialHealthData },
  Holly: { ...initialHealthData, gender: "Female" },
  Ethan: { ...initialHealthData },
  Elle: { ...initialHealthData, gender: "Female" },
};

function HealthForm({
  member,
  data,
  onSave,
}: {
  member: FamilyMember;
  data: HealthData;
  onSave: (member: FamilyMember, data: HealthData) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<HealthData>({
    resolver: zodResolver(healthSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: HealthData) => {
    onSave(member, formData);
    toast({
      title: "Data Saved",
      description: `Health data for ${member} has been updated.`,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Log Vitals for {member}</CardTitle>
          <CardDescription>
            Enter the latest health information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`height-${member}`}>Height</Label>
              <Input
                id={`height-${member}`}
                placeholder="e.g., 5'10&quot;"
                {...register("height")}
              />
              {errors.height && <p className="text-destructive text-sm">{errors.height.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`age-${member}`}>Age</Label>
              <Input
                id={`age-${member}`}
                type="number"
                placeholder="e.g., 35"
                {...register("age")}
              />
              {errors.age && <p className="text-destructive text-sm">{errors.age.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`gender-${member}`}>Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id={`gender-${member}`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`weight-${member}`}>Weight (lbs)</Label>
              <Input
                id={`weight-${member}`}
                placeholder="e.g., 180"
                {...register("weight")}
              />
              {errors.weight && <p className="text-destructive text-sm">{errors.weight.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`glucose-${member}`}>Glucose (mg/dL)</Label>
              <Input
                id={`glucose-${member}`}
                placeholder="e.g., 95"
                {...register("glucose")}
              />
              {errors.glucose && <p className="text-destructive text-sm">{errors.glucose.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`notes-${member}`}>Notes</Label>
            <Textarea
              id={`notes-${member}`}
              placeholder="Any relevant notes (max 140 chars)"
              {...register("notes")}
            />
            {errors.notes && <p className="text-destructive text-sm">{errors.notes.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Data</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export function HealthTracker() {
  const [appState, setAppState] = useState<AppState>(initialAppState);

  const handleSave = (member: FamilyMember, data: HealthData) => {
    setAppState((prevState) => ({
      ...prevState,
      [member]: data,
    }));
  };

  return (
    <Tabs defaultValue={familyMembers[0]} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {familyMembers.map((member) => (
          <TabsTrigger key={member} value={member}>
            {member}
          </TabsTrigger>
        ))}
      </TabsList>
      {familyMembers.map((member) => (
        <TabsContent key={member} value={member}>
          <HealthForm
            member={member}
            data={appState[member]}
            onSave={handleSave}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
