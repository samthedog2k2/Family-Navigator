
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFormState, SubmitHandler } from "react-hook-form";
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
import { getHealthData, updateHealthData } from "@/services/client-data-service";
import { Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";

const familyMembers: FamilyMember[] = ["Adam", "Holly", "Ethan", "Elle"];

const healthSchema = z.object({
  height: z.string().min(1, "Height is required"),
  age: z.coerce.number().positive("Age must be positive"),
  gender: z.enum(["", "Male", "Female", "Other"]),
  weight: z.string().min(1, "Weight is required"),
  glucose: z.string().min(1, "Glucose level is required"),
  notes: z.string().max(140, "Notes must be 140 characters or less").optional(),
});

type HealthFormData = z.infer<typeof healthSchema>;

function HealthForm({
  member,
  data,
  onSave,
  isSaving,
}: {
  member: FamilyMember;
  data: HealthData;
  onSave: (member: FamilyMember, data: HealthData) => void;
  isSaving: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<HealthFormData>({
    resolver: zodResolver(healthSchema),
    defaultValues: data,
  });
  
  const { errors } = useFormState({ control });

  useEffect(() => {
    reset(data);
  }, [data, reset]);


  const onSubmit: SubmitHandler<HealthFormData> = (formData) => {
    const dataToSave: HealthData = {
        ...formData,
        gender: formData.gender as "Male" | "Female" | "Other"
    };
    onSave(member, dataToSave);
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
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Data
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export function HealthTracker() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<FamilyMember>(familyMembers[0]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getHealthData();
        const { source, ...healthData } = data;
        setAppState(healthData as AppState);
        setDataSource(source);
      } catch (error) {
        toast({
          title: "Error Loading Data",
          description: "Could not retrieve health data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (member: FamilyMember, data: HealthData) => {
    setIsSaving(true);
    try {
      const updatedData = await updateHealthData(member, data);
      setAppState(updatedData);
      toast({
        title: "Data Saved",
        description: `Health data for ${member} has been updated.`,
      });
    } catch (error) {
       toast({
        title: "Error Saving Data",
        description: `Could not save health data for ${member}.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!appState) {
    return <p>Could not load health data.</p>;
  }

  return (
    <div className="relative">
        {dataSource && (
            <Badge variant="outline" className="absolute top-0 right-0">
                Data Source: {dataSource}
            </Badge>
        )}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FamilyMember)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            {familyMembers.map((member) => (
            <TabsTrigger key={member} value={member}>
                {member}
            </TabsTrigger>
            ))}
        </TabsList>
        {familyMembers.map((member) => (
            <TabsContent key={member} value={member} forceMount={true} hidden={activeTab !== member}>
              <HealthForm
                  member={member}
                  data={appState[member]}
                  onSave={handleSave}
                  isSaving={isSaving}
              />
            </TabsContent>
        ))}
        </Tabs>
    </div>
  );
}
