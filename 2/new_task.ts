import amqp from "amqplib";

async function main() {
  const queue = "task_queue";
  const msg = process.argv.slice(2).join(" ") || "Hello World!";

  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  channel.assertQueue(queue, {
    durable: false,
  });
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
