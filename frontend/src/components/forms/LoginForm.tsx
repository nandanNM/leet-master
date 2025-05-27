import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "../LoadingButton";
import { useAuthStore } from "@/store";

export default function LoginForm() {
  const { login, isLoggingIn: isPending } = useAuthStore();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });
  async function onSubmit(values: LoginValues) {
    try {
      await login(values);
    } catch (error) {
      console.error("Error during login:", error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-md space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  disabled={isPending}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  disabled={isPending}
                  type="password"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="-mt-3 ml-auto w-fit">
          <Link to={"/forgot-password"} className="hover:underline">
            Forgot Password ?
          </Link>
        </div>

        <LoadingButton loading={isPending} className="w-full" type="submit">
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
}
