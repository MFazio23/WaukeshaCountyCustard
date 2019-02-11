package org.faziodev.wcc.alexa

import com.amazon.ask.dispatcher.request.handler.HandlerInput
import com.amazon.ask.dispatcher.request.handler.RequestHandler
import com.amazon.ask.model.LaunchRequest
import com.amazon.ask.model.Response
import com.amazon.ask.model.SessionEndedRequest
import com.amazon.ask.request.Predicates
import org.faziodev.wcc.*
import java.util.*

//TODO: Have these responses go into a static location or just reference the static_responses_en_US.properties file.
//  The other location will return one of the responses, which are strings loaded from the properties file.

class LaunchRequestHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?): Boolean =
        input?.matches(Predicates.requestType(LaunchRequest::class.java)) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> = input.buildSimpleResponse(getWelcomeResponse())
}

class AboutIntentHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?): Boolean =
        input?.matches(Predicates.intentName("About")) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> = input.buildSimpleResponse(getAboutResponse())
}

class HelpIntentHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?): Boolean =
        input?.matches(
            Predicates
                .intentName("AMAZON.HelpIntent")
                .or(Predicates.intentName("Help"))) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> = input.buildSimpleResponse(getHelpResponse())
}

class CancelStopIntentHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?): Boolean =
        input?.matches(
            Predicates
                .intentName("AMAZON.CancelIntent")
                .or(Predicates.intentName("AMAZON.StopIntent"))
        ) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> =
        input.buildSimpleResponse(getGoodbyeResponse(), shouldEnd = true)
}

class FallbackIntentHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?): Boolean =
        input?.matches(Predicates.intentName("AMAZON.FallbackIntent")) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> = input.buildSimpleResponse(getUnknownResponse())
}

class SessionEndedRequestHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?): Boolean =
        input?.matches(Predicates.requestType(SessionEndedRequest::class.java)) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> {
        //Cleanup here if needed.

        return input.buildSimpleResponse(getGoodbyeResponse())
    }
}