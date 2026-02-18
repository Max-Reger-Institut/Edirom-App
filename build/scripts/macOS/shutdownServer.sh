#!/bin/bash

CALLDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$CALLDIR/../app.asar.unpacked/jetty_base"

../../jre/bin/java -jar -DSTOP.PORT=19226 -DSTOP.KEY=rwavolII7 ../jetty/start.jar --stop
