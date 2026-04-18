import state from "./../state/state.js";  // annab state seisu
import correctTimeAfterStartup from "../state/timer.js"
import fs from "fs/promises";
import { DATA_FILE } from "../config/env.js"; // annab export const DATA_FILE = path.join(__dirname, 'data.json');

export async function saveState() {
    await fs.writeFile(
        DATA_FILE,
        JSON.stringify(state, null, "\t"),
    "utf-8");
};

export async function loadState() {
    try {
    const fileContents  = await fs.readFile(DATA_FILE, "utf-8");
    Object.assign(state, JSON.parse(fileContents));
    console.log(`Server (loadState()): State recovered from ${DATA_FILE}`);
    correctTimeAfterStartup()
    return true;
    } catch {
        console.log(`Server(loadState()): State could not be loaded from ${DATA_FILE}, initializing anew.`);
        return false;
    }
}