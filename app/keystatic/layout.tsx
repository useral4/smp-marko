import type { Metadata } from "next";
import KeystaticApp from "./keystatic";
import RussianInterface from "../../cms/app/keystatic/russian-interface";
import SetupRequired from "../../cms/app/keystatic/setup-required";
import { isGitHubSetupEnabled, isGitHubStorageEnabled } from "../../keystatic.config";

export const metadata: Metadata = {
  title: "Управление сайтом — СМП МАРКО",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout() {
  if (
    process.env.KEYSTATIC_STORAGE === "github" &&
    !isGitHubStorageEnabled &&
    !isGitHubSetupEnabled
  ) {
    return <SetupRequired />;
  }

  return (
    <>
      <KeystaticApp />
      <RussianInterface />
    </>
  );
}
