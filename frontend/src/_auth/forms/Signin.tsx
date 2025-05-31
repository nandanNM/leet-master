import LoginForm from "@/components/forms/LoginForm";
import GoogleSignInButton from "@/components/GoogleSigninButton";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="space-y-7 lg:p-10">
      <h1 className="text-center text-xl font-semibold">
        Login to Leet Master
      </h1>
      <GoogleSignInButton />
      <div className="flex items-center gap-3">
        <div className="bg-muted h-px flex-1" />
        <span>OR</span>
        <div className="bg-muted h-px flex-1" />
      </div>
      <LoginForm />
      <div className="mx-auto max-w-md">
        <p>
          Don't have account ?{" "}
          <Link to="/signup" className="text-primary drop-shadow-md">
            Create here
          </Link>
        </p>
      </div>
    </div>
  );
}
