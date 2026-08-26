type EnvMap = Record<string, string | undefined>;

export function getServerEnv(name: string) {
  const fromProcess =
    typeof process !== "undefined" ? process.env?.[name] : undefined;

  if (fromProcess) {
    return fromProcess;
  }

  const fromImportMeta = (import.meta as ImportMeta & { env?: EnvMap }).env?.[
    name
  ];

  return fromImportMeta;
}
