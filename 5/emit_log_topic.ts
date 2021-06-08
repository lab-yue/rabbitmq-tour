import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = 'topic_logs';
  const args = process.argv.slice(2);
  const key = (args.length > 0) ? args[0] : 'anonymous.info';
  const msg = args.slice(1).join(' ') || 'Hello World!';

  channel.assertExchange(exchange, "topic", {
    durable: false,
  });
  channel.publish(exchange, key, Buffer.from(msg));
  console.log(` [x] Sent ${key}: '${msg}'`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

main();
