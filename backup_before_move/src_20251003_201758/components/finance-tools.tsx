"use client";

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generateFinanceSummary,
  FinanceSummaryInput,
} from "@/ai/flows/smart-finance-summaries";
import {
  retirementCollegeProjections,
  RetirementCollegeProjectionsInput,
} from "@/ai/flows/retirement-college-projections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Schema for Smart Finance Summary
const financeSummarySchema = z.object({
  income: z.coerce.number().positive("Income must be positive."),
  expenses: z.array(
    z.object({
      category: z.string().min(1, "Category is required."),
      amount: z.coerce.number().positive("Amount must be positive."),
    })
  ),
  savings: z.coerce.number().nonnegative("Savings can't be negative."),
  debt: z.coerce.number().nonnegative("Debt can't be negative."),
  financialGoals: z.array(z.object({ value: z.string().min(1, "Goal is required.") })),
});

// Schema for Retirement and College Projections
const projectionsSchema = z.object({
  currentAge: z.coerce.number().positive(),
  retirementAge: z.coerce.number().positive(),
  currentSavings: z.coerce.number().nonnegative(),
  annualContribution: z.coerce.number().nonnegative(),
  collegeCurrentAge: z.coerce.number().positive(),
  collegeStartAge: z.coerce.number().positive(),
  collegeSavings: z.coerce.number().nonnegative(),
  annualCollegeContribution: z.coerce.number().nonnegative(),
  marketOptimism: z.string(),
});

type FinanceSummaryFormData = z.infer<typeof financeSummarySchema>;
type ProjectionsFormData = z.infer<typeof projectionsSchema>;

function SmartFinanceSummaryForm() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, register, formState: { errors } } = useForm<FinanceSummaryFormData>({
    resolver: zodResolver(financeSummarySchema),
    defaultValues: { income: 5000, expenses: [{ category: "Housing", amount: 1500 }], savings: 10000, debt: 5000, financialGoals: [{ value: "Buy a house" }] },
  });
  const { fields: expenseFields, append: appendExpense, remove: removeExpense } = useFieldArray({ control, name: "expenses" });
  const { fields: goalFields, append: appendGoal, remove: removeGoal } = useFieldArray({ control, name: "financialGoals" });

  const onSubmit = async (data: FinanceSummaryFormData) => {
    setIsLoading(true);
    setSummary("");
    const input: FinanceSummaryInput = {
      ...data,
      financialGoals: data.financialGoals.map(g => g.value),
    };
    try {
      const result = await generateFinanceSummary(input);
      setSummary(result.summary);
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate summary.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Financial Snapshot</CardTitle>
            <CardDescription>Enter your current financial data for an AI summary.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monthly Income</Label>
                <Input type="number" {...register("income")} />
                {errors.income && <p className="text-sm text-destructive">{errors.income.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Total Savings</Label>
                <Input type="number" {...register("savings")} />
                 {errors.savings && <p className="text-sm text-destructive">{errors.savings.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Expenses</Label>
              {expenseFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input placeholder="Category" {...register(`expenses.${index}.category`)} />
                  <Input type="number" placeholder="Amount" {...register(`expenses.${index}.amount`)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeExpense(index)}><Trash2 className="size-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendExpense({ category: "", amount: 0 })}><PlusCircle className="mr-2 size-4"/>Add Expense</Button>
            </div>
            
             <div className="space-y-2">
              <Label>Financial Goals</Label>
              {goalFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input placeholder="e.g., Pay off debt" {...register(`financialGoals.${index}.value`)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeGoal(index)}><Trash2 className="size-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendGoal({ value: "" })}><PlusCircle className="mr-2 size-4"/>Add Goal</Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Summary
            </Button>
          </CardFooter>
        </form>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>AI-Generated Summary</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="size-8 animate-spin text-primary" /></div>}
            {summary && <p className="text-sm text-foreground">{summary}</p>}
            {!isLoading && !summary && <p className="text-sm text-muted-foreground text-center">Your financial summary will appear here.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectionsForm() {
  const [projections, setProjections] = useState<{ retirement: string; college: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, register, formState: { errors } } = useForm<ProjectionsFormData>({
    resolver: zodResolver(projectionsSchema),
    defaultValues: { marketOptimism: "Neutral" },
  });

  const onSubmit = async (data: ProjectionsFormData) => {
    setIsLoading(true);
    setProjections(null);
    try {
      const result = await retirementCollegeProjections(data);
      setProjections({ retirement: result.retirementProjection, college: result.collegeProjection });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate projections.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Savings Projections</CardTitle>
            <CardDescription>Plan for retirement and college education.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-foreground">Retirement</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Current Age</Label><Input type="number" {...register("currentAge")} /></div>
                <div className="space-y-2"><Label>Retirement Age</Label><Input type="number" {...register("retirementAge")} /></div>
                <div className="space-y-2"><Label>Current Savings</Label><Input type="number" {...register("currentSavings")} /></div>
                <div className="space-y-2"><Label>Annual Contribution</Label><Input type="number" {...register("annualContribution")} /></div>
            </div>
            <h3 className="font-semibold text-foreground">College</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Child's Current Age</Label><Input type="number" {...register("collegeCurrentAge")} /></div>
                <div className="space-y-2"><Label>College Start Age</Label><Input type="number" {...register("collegeStartAge")} /></div>
                <div className="space-y-2"><Label>Current College Savings</Label><Input type="number" {...register("collegeSavings")} /></div>
                <div className="space-y-2"><Label>Annual Contribution</Label><Input type="number" {...register("annualCollegeContribution")} /></div>
            </div>
             <div className="space-y-2">
                <Label>Market Optimism</Label>
                <Controller name="marketOptimism" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Very Pessimistic">Very Pessimistic</SelectItem>
                        <SelectItem value="Pessimistic">Pessimistic</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Optimistic">Optimistic</SelectItem>
                        <SelectItem value="Very Optimistic">Very Optimistic</SelectItem>
                    </SelectContent>
                    </Select>
                )} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Projections
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Card>
          <CardHeader><CardTitle>AI-Generated Projections</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="size-8 animate-spin text-primary" /></div>}
            {projections ? (
                <>
                    <div>
                        <h4 className="font-semibold text-foreground">Retirement Projection</h4>
                        <p className="text-sm text-foreground">{projections.retirement}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-foreground">College Savings Projection</h4>
                        <p className="text-sm text-foreground">{projections.college}</p>
                    </div>
                </>
            ) : !isLoading && (
                <p className="text-sm text-muted-foreground text-center">Your savings projections will appear here.</p>
            )}
          </CardContent>
      </Card>
    </div>
  );
}


export function FinanceTools() {
  return (
    <Tabs defaultValue="summary" className="space-y-4">
      <TabsList>
        <TabsTrigger value="summary">Smart Summary</TabsTrigger>
        <TabsTrigger value="projections">Savings Projections</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">
        <SmartFinanceSummaryForm />
      </TabsContent>
      <TabsContent value="projections">
        <ProjectionsForm />
      </TabsContent>
    </Tabs>
  );
}
