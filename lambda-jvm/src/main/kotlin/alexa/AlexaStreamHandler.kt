package org.faziodev.wcc.alexa

import com.amazon.ask.AlexaSkill
import com.amazon.ask.Skills
import com.amazon.ask.exception.AskSdkException
import com.amazon.ask.model.RequestEnvelope
import com.amazon.ask.model.ResponseEnvelope
import com.amazon.ask.request.impl.BaseSkillRequest
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestStreamHandler
import org.apache.commons.io.IOUtils
import org.slf4j.LoggerFactory
import java.io.InputStream
import java.io.OutputStream
import java.util.*

class AlexaStreamHandler : RequestStreamHandler {

    private val logger = LoggerFactory.getLogger(AlexaStreamHandler::class.java)
    private val skill: AlexaSkill<RequestEnvelope, ResponseEnvelope>

    init {
        val resources = ResourceBundle.getBundle("alexa-wcc")
        val skillId = resources?.getString("wcc.alexa.skillId")

        //TODO: Add the other handlers.
        skill = Skills.standard()
            .addRequestHandlers(
                LaunchRequestHandler(),
                AboutIntentHandler(),
                HelpIntentHandler(),
                CancelStopIntentHandler(),
                FallbackIntentHandler(),
                SessionEndedRequestHandler(),
                FlavorsIntentHandler(),
                HoursIntentHandler(),
                StoresIntentHandler()
            )
            .withSkillId(skillId)
            .build()
    }

    fun handleBytesRequest(inputBytes: ByteArray, output: OutputStream?, context: Context?) {
        val response = skill.execute(BaseSkillRequest(inputBytes))
        if (response != null) {
            if (response.isPresent) {
                response.writeTo(output)
            }
            return
        }

        throw AskSdkException("Could not find a skill to handle the incoming request")
    }

    override fun handleRequest(input: InputStream?, output: OutputStream?, context: Context?) {
        handleBytesRequest(IOUtils.toByteArray(input), output, context)
    }
}