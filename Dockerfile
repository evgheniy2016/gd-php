FROM ubuntu:rolling

RUN apt-get update
RUN apt-get install -y git php sqlite php-mbstring php-dom php-zip gip openssl ca-certificates php7.1-sqlite

RUN git clone git@gitlab.com:AlexeyRudkovskiy/bt_app.git /usr/src/binarytrade.app

WORKDIR /usr/src/binarytrade.app

ENTRYPOINT [ "./populate.sh" ]

EXPOSE 8000
CMD /usr/bin/php ./bin/console server:run 0.0.0.0:8000