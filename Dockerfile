#------- start of file Dockerfile
# Dockerfile for ui app
FROM stash.trinet-devops.com:8443/httpd:2.4
MAINTAINER Eng Release eng.release@trinet.com
# since the http image sets the current directory :( we need to reset it on next line
WORKDIR /
COPY /dist /usr/local/apache2/htdocs/UI_APP_NAME/
COPY ./ui-app-httpd.conf /usr/local/apache2/conf/httpd.conf
# Expose our port so clients can communicate to our app in the image
EXPOSE 81
