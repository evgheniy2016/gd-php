FROM debian:9

RUN apt update
RUN apt install apt-transport-https lsb-release ca-certificates wget -y
RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN sh -c 'echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list'
RUN apt update

#RUN docker-php-ext-install mbstring zip dom pdo pdo_mysql fpm
#RUN docker-php-ext-enable mbstring zip dom pdo pdo_mysql

RUN apt-get install php7.2 php7.2-fpm php7.2-cli php7.2-mbstring php7.2-zip php7.2-dom php7.2-mysql gip openssl ca-certificates mysql-client curl -y
RUN apt-get install gnupg2 -y

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install nodejs -y
RUN npm --version

RUN php -r " copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php composer-setup.php --filename=composer --install-dir=/bin
RUN php -r "unlink('composer-setup.php');"

RUN mkdir /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]

CMD [ "php", "bin/console", "server:start" ]
EXPOSE 8000
