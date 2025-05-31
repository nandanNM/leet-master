import SignUpForm from "@/components/forms/SignUpForm";
import GoogleSignInButton from "@/components/GoogleSigninButton";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="space-y-7 lg:p-10">
      <h1 className="text-center text-xl font-semibold">
        Sign up to Leet Master
      </h1>
      <GoogleSignInButton />
      <div className="flex items-center gap-3">
        <div className="bg-muted h-px flex-1" />
        <span>OR</span>
        <div className="bg-muted h-px flex-1" />
      </div>
      <SignUpForm />
      <div className="mx-auto max-w-md">
        <p>
          Already have account ?{" "}
          <Link to="/login" className="text-primary drop-shadow-md">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
