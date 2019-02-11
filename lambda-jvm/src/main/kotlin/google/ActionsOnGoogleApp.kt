package org.faziodev.wcc.google

import com.google.actions.api.ActionRequest
import com.google.actions.api.ActionResponse
import com.google.actions.api.DialogflowApp
import com.google.actions.api.ForIntent
import com.google.api.services.actions_fulfillment.v2.model.BasicCard
import org.faziodev.wcc.*
import org.faziodev.wcc.response.FlavorResponseHandler
import org.faziodev.wcc.response.StoreResponseHandler
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

const val defaultCardTitle = "Waukesha County Custard"

class ActionsOnGoogleApp : DialogflowApp() {
    private val logger = LoggerFactory.getLogger(ActionsOnGoogleApp::class.java)

    private fun buildSimpleResponse(
        request: ActionRequest,
        text: String,
        shouldEnd: Boolean = false
    ): ActionResponse {
        val newText = if (!shouldEnd) "$text  ${getEndingQuestion()}" else text

        val response = getResponseBuilder(request)
            .add(newText)
            .add(BasicCard().setTitle(defaultCardTitle).setFormattedText(newText))

        if (shouldEnd) response.endConversation()

        return response.build()
    }

    @ForIntent("Default Welcome Intent")
    fun welcomeIntent(request: ActionRequest) = buildSimpleResponse(request, getWelcomeResponse())

    @ForIntent("Default Fallback Intent")
    fun fallbackIntent(request: ActionRequest) = buildSimpleResponse(request, getUnknownResponse())

    @ForIntent("Default Exit Intent")
    fun exitIntent(request: ActionRequest) = buildSimpleResponse(request, getGoodbyeResponse())

    @ForIntent("About")
    fun aboutIntent(request: ActionRequest) = buildSimpleResponse(request, getAboutResponse())

    @ForIntent("Help")
    fun helpIntent(request: ActionRequest) = buildSimpleResponse(request, getHelpResponse())

    @ForIntent("Flavors")
    fun flavorsIntent(request: ActionRequest): ActionResponse {
        val date = if (request.getParameterStringOrNull("date") != null)
            LocalDate.parse(request.getParameterStringOrNull("date"), DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                ?: currentCentralTimeDate()
        else currentCentralTimeDate()

        val store = request.getParameterStringOrNull("store")

        return buildSimpleResponse(
            request,
            FlavorResponseHandler.handle(date, store)
        )
    }

    @ForIntent("Hours")
    fun hoursIntent(request: ActionRequest): ActionResponse = buildSimpleResponse(
        request,
        StoreResponseHandler.handle(
            request.getParameterStringOrNull("store"),
            request.getParameterStringOrNull("city"),
            true
        )
    )

    @ForIntent("Stores")
    fun storesIntent(request: ActionRequest): ActionResponse = buildSimpleResponse(
        request,
        StoreResponseHandler.handle(
            request.getParameterStringOrNull("store"),
            request.getParameterStringOrNull("city")
        )
    )
}

fun ActionRequest.getParameterStringOrNull(parameterName: String) =
    this.getParameter(parameterName)?.toString()?.let { if (it == "") null else it }