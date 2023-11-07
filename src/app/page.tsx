import AuthButton from "@/components/auth-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <>
      <ThemeToggle />
      <AuthButton />
    </>
  );
}
