import state from "./../state/state.js";  // annab state seisu
import fs from "fs/promises";
import { DATA_FILE } from "../config/env.js"; // annab export const DATA_FILE = path.join(__dirname, 'data.json');

export async function saveState() {
    await fs.writeFile(
        DATA_FILE,
        JSON.stringify(state, null, "\t"),
    "utf-8");
};

export function loadState() {

}