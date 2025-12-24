import Image from "next/image";
import Experience from "./experience/experience";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-neutral-950 text-neutral-50">
      <Experience />
    </div>
  );
}
