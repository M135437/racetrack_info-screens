import { io } from "socket.io-client";
import { performance } from "node:perf_hooks";

const URL = "http://localhost:3000";

const socket = io(URL, {
  transports: ["websocket"],
});

function log(...args) {
  console.log(new Date().toISOString(), "-", ...args);
}

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// ===============================
// CORE mõõtmise helper
// ===============================
function trackTimerUpdates() {
  let lastUpdateTime = null;
  let lastPayload = null;

  function handler(payload) {
    lastUpdateTime = performance.now();
    lastPayload = payload;
  }

  socket.on("timer:update", handler);

  return {
    stop: () => socket.off("timer:update", handler),
    getLast: () => ({
      time: lastUpdateTime,
      payload: lastPayload
    })
  };
}

// ===============================
// TEST GENERATOR
// ===============================
async function runTimedTest(label, durationMs, manualStop = true) {
  log(`\n=== ${label} START ===`);

  const tracker = trackTimerUpdates();

  const start = performance.now();

  socket.emit("session:start");

  await wait(durationMs);

  if (manualStop) {
    socket.emit("session:endSession");
  }

  // oota natuke, et viimane TIMER_UPDATE kohale jõuaks
  await wait(200);

  const end = performance.now();

  const last = tracker.getLast();
  tracker.stop();

  const realElapsed = end - start;
  const lastUpdateDelay = last.time ? (last.time - start) : null;

  log("Real elapsed:", realElapsed.toFixed(3), "ms");

  if (last.time) {
    log("Last TIMER_UPDATE at:", lastUpdateDelay.toFixed(3), "ms since start");
  } else {
    log("❌ No TIMER_UPDATE received");
  }

  // ===============================
  // ANALÜÜS
  // ===============================
  let pass = false;

  if (lastUpdateDelay !== null) {
    const diff = Math.abs(lastUpdateDelay - durationMs);

    log("Difference from expected:", diff.toFixed(3), "ms");

    pass = diff < 200; // tolerants
  }

  log(pass ? "✅ PASS" : "❌ FAIL");

  return {
    pass,
    realElapsed,
    lastUpdateDelay
  };
}

// ===============================
// TEST 1 — 10s (manual stop)
// ===============================
async function test10s() {
  return runTimedTest("TEST 1 (10s manual stop)", 10000, true);
}

// ===============================
// TEST 2 — 30s (manual stop)
// ===============================
async function test30s() {
  return runTimedTest("TEST 2 (30s manual stop)", 30000, true);
}

// ===============================
// TEST 3 — 60s auto stop
// ===============================
async function test60sAuto() {
  log(`\n=== TEST 3 (60s auto) START ===`);

  const tracker = trackTimerUpdates();

  const start = performance.now();

  socket.emit("session:start");

  // ootame kuni TIMER_UPDATE lõppeb
  let lastTickTime = null;

  function handler() {
    lastTickTime = performance.now();
  }

  socket.on("timer:update", handler);

  // ootame kuni 2s jooksul ei tule ühtegi update'i
  while (true) {
    await wait(500);

    if (lastTickTime) {
      const silence = performance.now() - lastTickTime;

      if (silence > 2000) {
        break;
      }
    }
  }

  const end = performance.now();

  socket.off("timer:update", handler);

  const last = tracker.getLast();
  tracker.stop();

  const realElapsed = end - start;
  const lastUpdateDelay = last.time ? (last.time - start) : null;

  log("Real elapsed:", realElapsed.toFixed(3), "ms");

  if (lastUpdateDelay) {
    log("Last TIMER_UPDATE at:", lastUpdateDelay.toFixed(3), "ms");
  }

  // ===============================
  // ANALÜÜS (~60s)
  // ===============================
  let pass = false;

  if (lastUpdateDelay !== null) {
    const diff = Math.abs(lastUpdateDelay - 60000);

    log("Difference from 60s:", diff.toFixed(3), "ms");

    pass = diff < 500; // natuke suurem tolerants
  }

  log(pass ? "✅ PASS" : "❌ FAIL");

  return {
    pass,
    realElapsed,
    lastUpdateDelay
  };
}

// ===============================
// RUN ALL
// ===============================
async function run() {
  await new Promise(res => socket.on("connect", res));
  log("Connected:", socket.id);

  const results = [];

  results.push(await test10s());
  await wait(2000);

  results.push(await test30s());
  await wait(2000);

  results.push(await test60sAuto());

  const passed = results.filter(r => r.pass).length;

  log(`\n=== RESULT: ${passed}/${results.length} passed ===`);

  socket.disconnect();
}

run();