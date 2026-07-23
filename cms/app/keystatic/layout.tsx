import KeystaticApp from "./keystatic";
import RussianInterface from "./russian-interface";
import SetupRequired from "./setup-required";
import { isGitHubSetupEnabled, isGitHubStorageEnabled } from "../../keystatic.config";

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
