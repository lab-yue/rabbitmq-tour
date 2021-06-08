import { ensureQueue } from "../common";

async function main() {
  const queue = "task_queue";
  const msg = process.argv.slice(2).join(" ") || "Hello World!";

  const { connection, channel } = await ensureQueue(queue);

  channel.sendToQueue(queue, Buffer.from(msg), {
    persistent: true,
  });
  console.log(" [x] Sent '%s'", msg);
  setTimeout(async () => {
    await connection.close();
    process.exit();
  }, 500);
}

main();
