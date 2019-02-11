package org.faziodev.wcc.google

import com.amazonaws.services.lambda.runtime.Context
import com.github.salomonbrys.kotson.toMap
import com.google.gson.Gson
import com.google.gson.JsonObject
import org.json.simple.JSONObject
import java.io.OutputStream
import java.io.OutputStreamWriter
import java.nio.charset.StandardCharsets

class ActionsHandler {
    private val actionsApp = ActionsOnGoogleApp()
    private val gson = Gson()

    fun handleRequestWithBody(body: String, headers: JsonObject, outputStream: OutputStream, context: Context) {
        val logger = context.logger
        val awsResponse = mutableMapOf<String, Any>()

        logger.log("Into ActionsHandler")
        logger.log("Body: $body")

        actionsApp.handleRequest(body, headers.toMap())
            .thenAccept { webhookResponseJson ->
                logger.log("Generated json = $webhookResponseJson")

                val responseHeaders = JSONObject()
                responseHeaders["Content-Type"] = "application/json"

                awsResponse["statusCode"] = "200"
                awsResponse["headers"] = responseHeaders
                awsResponse["body"] = webhookResponseJson
                writeResponse(outputStream, awsResponse)
            }
            .exceptionally { throwable ->
                awsResponse["statusCode"] = "500"
                awsResponse["exception"] = throwable
                writeResponse(outputStream, awsResponse)
                return@exceptionally null
            }
    }

    private fun writeResponse(outputStream: OutputStream, responseMap: MutableMap<String, Any>) {
        val writer = OutputStreamWriter(outputStream, StandardCharsets.UTF_8)
        writer.write(gson.toJson(responseMap))
        writer.close()
    }
}