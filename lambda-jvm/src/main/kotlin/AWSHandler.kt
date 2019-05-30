package org.faziodev.wcc

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestStreamHandler
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import org.apache.commons.io.IOUtils
import org.faziodev.wcc.alexa.AlexaStreamHandler
import org.faziodev.wcc.google.ActionsHandler
import java.io.InputStream
import java.io.OutputStream

class AWSHandler : RequestStreamHandler {

    private val jsonParser = JsonParser()

    override fun handleRequest(input: InputStream?, output: OutputStream?, context: Context?) {
        // If one of these values doesn't come in, we're probably hosed anyway.
        // We could use a better response, though.
        if (input == null || output == null || context == null) return

        val logger = context.logger
        logger?.log("Starting the request.")

        val inputBytes = IOUtils.toByteArray(input)
        val stringInput = String(inputBytes)
        logger.log("String input: $stringInput")
        val awsRequest = jsonParser.parse(stringInput) as JsonObject

        if (awsRequest.has("body")) {
            logger.log("Going to Google...")
            ActionsHandler().handleRequestWithBody(
                awsRequest["body"].asString,
                awsRequest["headers"] as JsonObject,
                output,
                context
            )
        } else {
            logger.log("Going to Alexa...")
            AlexaStreamHandler().handleBytesRequest(inputBytes, output, context)
        }
    }
}