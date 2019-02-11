package org.faziodev.wcc.alexa

import com.amazon.ask.dispatcher.request.handler.HandlerInput
import com.amazon.ask.model.IntentRequest
import com.amazon.ask.model.Response
import com.amazon.ask.model.Slot
import com.amazon.ask.model.slu.entityresolution.Value
import org.faziodev.wcc.getEndingQuestion
import java.util.*

const val defaultCardTitle = "Waukesha County Custard"

fun HandlerInput?.getSlots(): Slots? {
    val request = this?.request
    return if (request is IntentRequest) {
        return request.intent?.slots
    } else null
}

fun HandlerInput?.getSlotMap(): Map<String, Value?> =
    this.getSlots()?.entries?.associate { (slotName, slot) ->
        val value = slot.resolutions?.resolutionsPerAuthority?.firstOrNull()?.values?.firstOrNull()?.value
            ?: Value.builder().withId(slot.value).withName(slot.value).build()
        return@associate slotName to value
    } ?: mapOf()

fun HandlerInput?.buildSimpleResponse(
    text: String,
    title: String = defaultCardTitle,
    shouldEnd: Boolean = false
): Optional<Response> {
    val newText = if (!shouldEnd) "$text  ${getEndingQuestion()}" else text

    return this?.responseBuilder
        ?.withSpeech(newText)
        ?.withSimpleCard(title, newText)
        ?.withShouldEndSession(shouldEnd)
        ?.build() ?: Optional.empty<Response?>()
}


typealias Slots = Map<String, Slot>