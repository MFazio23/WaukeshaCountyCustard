package org.faziodev.wcc

import org.faziodev.wcc.alexa.AlexaStreamHandler
import org.slf4j.LoggerFactory
import java.util.*

const val suffixList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const val fallback = "I'm sorry, we're having issues on our end.  Please try again later."

private val logger = LoggerFactory.getLogger(AlexaStreamHandler::class.java)

val staticResponses: ResourceBundle? = ResourceBundle.getBundle("static_responses")

fun getWelcomeResponse() = getRandomResponse("welcome", 2)
fun getAboutResponse() = getRandomResponse("about", 4)
fun getHelpResponse() = getRandomResponse("help", 2)
fun getGoodbyeResponse() = getRandomResponse("goodbye", 3)
fun getUnknownResponse() = getRandomResponse("unknown", 12)
fun getEndingQuestion() = getRandomResponse("endingQuestion", 5)

private fun getRandomResponse(prefix: String, count: Int) =
    staticResponses?.let { responses ->
        val response = (0 until count)
            .mapNotNull { ind -> responses.getString("$prefix${suffixList[ind]}") }
            .shuffled()
            .firstOrNull()

        logger.info("Response [$prefix, $count]: $response")

        return@let response ?: fallback
    } ?: fallback