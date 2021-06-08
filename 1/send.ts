import amqp from "amqplib";

async function main() {
  const queue = "hello";
  const msg = "Hello world";
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  channel.assertQueue(queue, {
    durable: false,
  });
  channel.sendToQueue(queue, Buffer.from(msg));

  setTimeout(async () => {
    await connection.close();
    process.exit();
  }, 500);
}

main();
