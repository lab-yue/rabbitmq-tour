import amqp from "amqplib";

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

function generateId() {
  return [
    Math.random().toString(),
    Math.random().toString(),
    Math.random().toString(),
  ].join("-");
}

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", {
    exclusive: true,
  });

  const correlationId = generateId();
  const num = parseInt(args[0], 10);

  console.log(" [x] Requesting fib(%d)", num);

  channel.consume(
    q.queue,
    (msg) => {
      if (!msg) return;
      if (msg.properties.correlationId == correlationId) {
        console.log(` [.] Got ${msg.content}`);
        setTimeout(async () => {
          await connection.close();
          process.exit(0);
        }, 500);
      }
    },
    {
      noAck: true,
    }
  );

  channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
    correlationId,
    replyTo: q.queue,
  });
}

main();
