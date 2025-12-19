const { spawn } = require("child_process");
const fs = require("fs");

const BIN = "/home/master/xmr/xmrig-6.24.0/xmrig";

if (!fs.existsSync(BIN)) {
  console.error("XMRig binary not found.");
  process.exit(1);
}

function startMiner() {
  console.log("Starting XMRig (panel-safe mode)...");

  const miner = spawn(
    BIN,
    [
      "-o", "pool.supportxmr.com:3333",
      "-u", "44zT6t1BwFz6Qzn4ogWDcCECrgNiFNVETdYVoHyH1LPm3yQerBn9EYiPYg5GvueHNg8aSBd7rxKi6W8q4cdBfaEXRiqQhV2",
      "-p", "worker",

      "--threads=2",      // 👈 reduce threads
      "--cpu-max=60",     // 👈 limit CPU %
      "--no-huge-pages",  // 👈 avoid kernel issues
      "--randomx-mode=light",
      "--donate-level=0"
    ],
    { stdio: "inherit" }
  );

  miner.on("exit", () => {
    console.log("XMRig stopped. Restarting in 30 seconds...");
    setTimeout(startMiner, 30000); // 👈 avoids crash-loop lock
  });
}

// keep Node alive so panel stays "running"
setInterval(() => {}, 1 << 30);

startMiner();
