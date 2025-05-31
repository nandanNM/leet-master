import { TypeAnimation } from "react-type-animation";
import { cn } from "@/lib/utils";

type TextAnimationHeadingProps = {
  className?: string;
  classNameAnimationContainer?: string;
};

export default function TextAnimationHeading({
  className,
  classNameAnimationContainer,
}: TextAnimationHeadingProps) {
  return (
    <div
      className={cn(
        "mx-auto my-6 flex flex-col gap-3 text-center text-xl font-bold lg:gap-5 lg:text-5xl",
        className,
      )}
    >
      <div className="text-primary drop-shadow-md">Build Space</div>
      <div className={cn("w-fit text-center", classNameAnimationContainer)}>
        <TypeAnimation
          sequence={[
            "Your Team.",
            1000,
            "Your Ideas.",
            1000,
            "One Platform.",
            1000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </div>
    </div>
  );
}
