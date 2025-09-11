import config from "config";
import { KafkaBroker } from "../../configuration/kafka";
import { MessageBroker } from "../../types/broker";

let broker: MessageBroker | null = null;

export const createMessageBroker = (): MessageBroker => {
  console.log("connecting to kafka broker...", config.get("kafka.broker"));
  // singleton
  if (!broker) {
    broker = new KafkaBroker("order-service", config.get("kafka.broker"));
  }
  return broker;
};
