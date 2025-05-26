import Logo from "@/components/Logo";
import TextAnimationHeading from "@/components/TextAnimationHeading";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="to-primary min-h-screen overflow-hidden bg-gradient-to-b from-white via-white">
      <header className="flex h-20 items-center">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4">
          <Logo />
          <nav>
            <Button
              onClick={() => navigate("/login")}
              className="cursor-pointer"
            >
              Login
            </Button>
          </nav>
        </div>
      </header>

      {/* text */}
      <TextAnimationHeading classNameAnimationContainer="mx-auto" />

      {/***dashboard landing image */}
      <div className="mx-auto w-fit shadow-lg">
        <img src="/banner-animate.gif" width={1000} height={400} alt="banner" />
      </div>

      <footer className="mt-6 bg-black py-4 text-neutral-200">
        <p className="mx-auto w-fit px-4 text-base font-semibold">
          Made by <span className="text-primary">Dynamic Coding with Amit</span>
        </p>
      </footer>
    </div>
  );
}
