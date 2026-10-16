import { defineRailway, github, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "bti7-qr-generator";
export default defineRailway(() => {
  const qrGenerator = service("qr-generator", {
    source: github("BeyondTheInnovation/bti7-qr-generator", { branch: "main", checkSuites: false }),
    build: { buildCommand: "bun run build", buildEnvironment: "V3" },
    start: "bun run start",
    healthcheck: "/",
    healthcheckTimeout: 300,
    replicas: { "europe-west4-drams3a": 1 },
    domains: ["qr.beyondtheinnovation.com", "qr.gamified.studio"],
  });

  return project("bti7-qr-generator", {
    variables: { managed: false },
    resources: [qrGenerator],
  });
});
