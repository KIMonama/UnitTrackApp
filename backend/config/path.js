import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dataDir = path.join(__dirname, "..", "data");

export const adminsFile = path.join(dataDir, "admins.json");
export const reportsFile = path.join(dataDir, "reports.json");
export const unitsFile = path.join(dataDir, "units.json");
