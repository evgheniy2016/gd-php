FROM ubuntu:devel

RUN apt-get update
RUN apt-get install -y git php sqlite php-mbstring php-dom php-zip gip openssl ca-certificates php7.1-sqlite
RUN apt-get install -y curl nodejs

RUN /usr/bin/ssh-keygen -t rsa -N password -f /tmp/key
RUN echo "cache-bust 7" && git clone https://gitlab.com/AlexeyRudkovskiy/bt_app.git -b frontend/ui /usr/src/binarytrade.app

RUN php -r " copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php composer-setup.php --filename=composer --install-dir=bin
RUN php -r "unlink('composer-setup.php');"

WORKDIR /usr/src/binarytrade.app

RUN chmod +x /usr/src/binarytrade.app/populate.sh
ENTRYPOINT [ "/usr/src/binarytrade.app/populate.sh" ]

EXPOSE 8000
CMD /usr/bin/php ./bin/console server:run 0.0.0.0:8000