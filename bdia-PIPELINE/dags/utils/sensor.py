from airflow.sensors.base import BaseSensorOperator
from confluent_kafka import Consumer
import json

class SimpleKafkaSensor(BaseSensorOperator):
    def __init__(self, kafka_topic, kafka_config, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.kafka_topic = kafka_topic
        self.kafka_config = kafka_config

    def poke(self, context):
        consumer = Consumer(self.kafka_config)
        consumer.subscribe([self.kafka_topic])
        msg = consumer.poll(timeout=5.0)
        if msg is not None and not msg.error():
            message = msg.value().decode("utf-8")
            context['ti'].xcom_push(key="kafka_message", value=message)
            consumer.close()
            return True
        consumer.close()
        return False
