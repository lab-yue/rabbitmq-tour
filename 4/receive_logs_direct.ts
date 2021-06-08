import amqp from "amqplib";

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "direct_logs";

  await channel.assertExchange(exchange, "direct", {
    durable: false,
  });

  const q = await channel.assertQueue("", {
    exclusive: true,
  });

  console.log(" [*] Waiting for logs. To exit press CTRL+C");

  args.forEach((severity) => {
    channel.bindQueue(q.queue, exchange, severity);
  });

  channel.consume(
    q.queue,
    (msg) => {
      if (!msg) return;
      console.log(` [x] ${msg.fields.routingKey}: '${msg.content.toString()}'`);
    },
    {
      noAck: true,
    }
  );
}

main();
