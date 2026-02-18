#!/bin/bash

CALLDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$CALLDIR/../app.asar.unpacked/jetty_base"

../../jre/bin/java -jar -Djava.awt.headless=true -DSTOP.PORT=19226 -DSTOP.KEY=rwavolII7 -XX:+HeapDumpOnOutOfMemoryError -Xmx1024m ../jetty/start.jar
