FROM mongo

COPY data /home/data
COPY mongo.sh /home/mongo.sh
RUN chmod 777 /home/mongo.sh

RUN /home/mongo.sh
