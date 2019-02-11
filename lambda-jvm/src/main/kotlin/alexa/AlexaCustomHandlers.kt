package org.faziodev.wcc.alexa

import com.amazon.ask.dispatcher.request.handler.HandlerInput
import com.amazon.ask.dispatcher.request.handler.RequestHandler
import com.amazon.ask.model.Response
import com.amazon.ask.request.Predicates
import org.faziodev.wcc.currentCentralTimeDate
import org.faziodev.wcc.db.FirebaseHandler
import org.faziodev.wcc.response.FlavorResponseHandler
import org.faziodev.wcc.response.StoreResponseHandler
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

class FlavorsIntentHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?) = input?.matches(Predicates.intentName("Flavors")) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> {
        val slotMap = input?.getSlotMap()

        val date =
            if (slotMap?.get("date")?.id != null)
                LocalDate.parse(slotMap["date"]?.id, DateTimeFormatter.ISO_LOCAL_DATE)
                ?: currentCentralTimeDate()
            else currentCentralTimeDate()

        return input.buildSimpleResponse(FlavorResponseHandler.handle(date, slotMap?.get("store")?.id))
    }
}

class HoursIntentHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?) = input?.matches(Predicates.intentName("Hours")) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> {
        val slotMap = input?.getSlotMap()

        return input.buildSimpleResponse(
            StoreResponseHandler.handle(
                slotMap?.get("store")?.id,
                slotMap?.get("city")?.id,
                true
            )
        )
    }
}

class StoresIntentHandler : RequestHandler {
    override fun canHandle(input: HandlerInput?) = input?.matches(Predicates.intentName("Stores")) ?: false

    override fun handle(input: HandlerInput?): Optional<Response> {
        val slotMap = input?.getSlotMap()

        return input.buildSimpleResponse(
            StoreResponseHandler.handle(
                slotMap?.get("store")?.id, slotMap?.get("city")?.id
            )
        )
    }
}