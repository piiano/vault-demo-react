FROM docker

WORKDIR /demo/terminal
RUN apk update
RUN apk upgrade
RUN apk add bash jq curl postgresql-client
# Add python and pip
RUN apk add py3-pip
# Add pyxtermjscd 
RUN pip install pyxtermjs

# Serve the app
ENTRYPOINT [ "pyxtermjs"]
