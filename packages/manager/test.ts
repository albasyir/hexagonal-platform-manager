const isDeno = typeof globalThis.Deno !== "undefined"
const isBun = typeof globalThis.Bun !== "undefined"
const isNode = !isBun && !isDeno && typeof process !== "undefined"

async function getSpecFiles(): Promise<string[]> {
  // when deno
  if (isDeno) {
    // Generate import_map.json
    const pkg = JSON.parse(globalThis.Deno.readTextFileSync("package.json"));
    const imports = {};
    for (const dep in pkg.devDependencies) {
      imports[dep] = `npm:${dep}@${pkg.devDependencies[dep]}`;
    }
    await globalThis.Deno.writeTextFile("import_map.json", JSON.stringify({ imports }, null, 2));

    // Load test spec files
    const { walk } = await import("https://deno.land/std@0.224.0/fs/walk.ts")
    const files: string[] = []
    for await (const entry of walk("./src", { exts: [".spec.ts"], includeFiles: true, includeDirs: false })) {
      files.push(`./${entry.path}`)
    }
    return files
  }

  // when node or bun
  if (isNode || isBun) {
    // directly load files
    const { globby } = await import("globby")
    const { fileURLToPath } = await import("url")
    const { dirname, join } = await import("path")
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const srcDir = join(__dirname, "src")
    return globby("**/*.spec.ts", { cwd: srcDir, absolute: true })
  }

  throw new Error("Unknown runtime")
}

async function main() {
  try {
    const files = await getSpecFiles()
    for (const file of files) await import(file)
  } catch (error) {
    console.error("Error running tests:", error)
    process.exit(1)
  }
}

main()