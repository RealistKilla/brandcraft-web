"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { api, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Building2, User, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const accountTypeSchema = z.object({
  accountType: z.enum(["individual", "organization"]),
});

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  organizationName: z.string().optional(),
  existingOrganization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AccountTypeData = z.infer<typeof accountTypeSchema>;
type RegistrationData = z.infer<typeof registrationSchema>;

export function SignUpFlow() {
  const [step, setStep] = useState<"account-type" | "registration">("account-type");
  const [accountType, setAccountType] = useState<"individual" | "organization" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const accountTypeForm = useForm<AccountTypeData>({
    resolver: zodResolver(accountTypeSchema),
  });

  const registrationForm = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      existingOrganization: "",
    },
  });

  const handleAccountTypeSubmit = (data: AccountTypeData) => {
    setAccountType(data.accountType);
    setStep("registration");
  };

  const handleRegistrationSubmit = async (data: RegistrationData) => {
    if (!accountType) return;

    setIsLoading(true);

    try {
      await api.auth.signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        accountType,
        organizationName: data.organizationName,
        existingOrganization: data.existingOrganization,
      });

      toast({
        title: "Success",
        description: "Your account has been created successfully!",
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign up error:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep("account-type");
    setAccountType(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === "account-type" && (
          <motion.div
            key="account-type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                What will you be using Brandcraft for?
              </h1>
              <p className="text-gray-600">
                This allows us to correctly set up your Brandcraft account.
              </p>
            </div>

            <Form {...accountTypeForm}>
              <form onSubmit={accountTypeForm.handleSubmit(handleAccountTypeSubmit)} className="space-y-6">
                <FormField
                  control={accountTypeForm.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => field.onChange("individual")}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                              field.value === "individual"
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              <div className="p-3 rounded-lg bg-blue-100">
                                <Building2 className="h-8 w-8 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">Small business</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  You're here if you're operating from a single branch with low volumes.
                                </p>
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => field.onChange("organization")}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                              field.value === "organization"
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              <div className="p-3 rounded-lg bg-purple-100">
                                <User className="h-8 w-8 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">Large company</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  You're here if you're a branch of a larger company.
                                </p>
                              </div>
                            </div>
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                  disabled={!accountTypeForm.watch("accountType")}
                >
                  Continue
                </Button>
              </form>
            </Form>
          </motion.div>
        )}

        {step === "registration" && (
          <motion.div
            key="registration"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Register</h1>
                <p className="text-gray-600">
                  Welcome to Brandcraft! Let's get started by creating your account.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            </div>

            <Form {...registrationForm}>
              <form onSubmit={registrationForm.handleSubmit(handleRegistrationSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={registrationForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Name"
                              className="bg-gray-100 border-0 rounded-lg py-3 px-4 placeholder-gray-500"
                              {...field}
                            />
                            {registrationForm.formState.errors.name && (
                              <p className="text-xs text-red-500 mt-1 italic">
                                {registrationForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Email Address"
                              type="email"
                              className="bg-gray-100 border-0 rounded-lg py-3 px-4 placeholder-gray-500"
                              {...field}
                            />
                            {registrationForm.formState.errors.email && (
                              <p className="text-xs text-red-500 mt-1 italic">
                                {registrationForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {accountType === "organization" && (
                  <FormField
                    control={registrationForm.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Organization Name"
                              className="bg-gray-100 border-0 rounded-lg py-3 px-4 placeholder-gray-500"
                              {...field}
                            />
                            {registrationForm.formState.errors.organizationName && (
                              <p className="text-xs text-red-500 mt-1 italic">
                                {registrationForm.formState.errors.organizationName.message}
                              </p>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                {accountType === "individual" && (
                  <FormField
                    control={registrationForm.control}
                    name="existingOrganization"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Join Existing Organization (Optional)"
                              className="bg-gray-100 border-0 rounded-lg py-3 px-4 placeholder-gray-500"
                              {...field}
                            />
                            <p className="text-xs text-gray-500 mt-1 italic">
                              Leave blank to create your own workspace
                            </p>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={registrationForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Password"
                              type="password"
                              className="bg-gray-100 border-0 rounded-lg py-3 px-4 placeholder-gray-500"
                              {...field}
                            />
                            {registrationForm.formState.errors.password && (
                              <p className="text-xs text-red-500 mt-1 italic">
                                {registrationForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Confirm Password"
                              type="password"
                              className="bg-gray-100 border-0 rounded-lg py-3 px-4 placeholder-gray-500"
                              {...field}
                            />
                            {registrationForm.formState.errors.confirmPassword && (
                              <p className="text-xs text-red-500 mt-1 italic">
                                {registrationForm.formState.errors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium mt-8"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}