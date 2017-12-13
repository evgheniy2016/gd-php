FROM ubuntu:devel

RUN apt-get update
RUN apt-get install -y git php sqlite php-mbstring php-dom php-zip gip openssl ca-certificates php7.1-sqlite

RUN /usr/bin/ssh-keygen -t rsa -N password -f /tmp/key
RUN git clone https://gitlab.com/AlexeyRudkovskiy/bt_app.git /usr/src/binarytrade.app

WORKDIR /usr/src/binarytrade.app

RUN ls /usr/src/binarytrade.app
RUN chmod +x /usr/src/binarytrade.app/populate.sh
ENTRYPOINT [ "/usr/src/binarytrade.app/populate.sh" ]

EXPOSE 8000
CMD /usr/bin/php ./bin/console server:run 0.0.0.0:8000