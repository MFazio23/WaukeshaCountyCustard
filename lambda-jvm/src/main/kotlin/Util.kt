package org.faziodev.wcc

import java.time.ZoneId
import java.time.ZonedDateTime

// I know a Util class/file isn't great practice, but meh.

fun currentCentralTimeDate() = ZonedDateTime.now(ZoneId.of("America/New_York")).toLocalDate()