import { copyFile, mkdir } from "fs/promises";
import { join } from "path";

async function copyManifest() {
  try {
    // Create dist directory if it doesn't exist
    await mkdir("dist", { recursive: true });

    // Copy manifest.json
    await copyFile("manifest.json", "dist/manifest.json");

    // Create icons directory in dist
    await mkdir("dist/icons", { recursive: true });

    // Copy icons
    const iconSizes = [16, 48, 128];
    for (const size of iconSizes) {
      await copyFile(`icons/icon${size}.png`, `dist/icons/icon${size}.png`);
    }

    console.log("Build files copied successfully!");
  } catch (error) {
    console.error("Error copying build files:", error);
    process.exit(1);
  }
}

copyManifest();
