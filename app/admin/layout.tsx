import type { Metadata } from "next";
import KeystaticApp from "./keystatic";
import RussianInterface from "../../cms/app/keystatic/russian-interface";
import SetupRequired from "./setup-required";
import { isGitHubStorageEnabled } from "../../keystatic.config";

export const metadata: Metadata = {
  title: "Управление сайтом — СМП МАРКО",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (process.env.KEYSTATIC_STORAGE === "github" && !isGitHubStorageEnabled) {
    return <SetupRequired />;
  }

  return (
    <>
      <KeystaticApp />
      <RussianInterface />
      {children}
    </>
  );
}
