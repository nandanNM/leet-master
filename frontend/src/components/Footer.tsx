import { Blocks } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative mt-auto border-t border-gray-800/50">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-gray-400">
            <Blocks className="size-5" />
            <span>Built for developers, by developers</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="#"
              className="text-gray-400 transition-colors hover:text-gray-300"
            >
              Support
            </Link>
            <Link
              to="#"
              className="text-gray-400 transition-colors hover:text-gray-300"
            >
              Privacy
            </Link>
            <Link
              to="#"
              className="text-gray-400 transition-colors hover:text-gray-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
