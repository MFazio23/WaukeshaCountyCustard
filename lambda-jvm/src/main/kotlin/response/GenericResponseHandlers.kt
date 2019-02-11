package org.faziodev.wcc.response

import org.faziodev.wcc.convertFlavorsToResponse
import org.faziodev.wcc.convertLocationsToResponse
import org.faziodev.wcc.currentCentralTimeDate
import org.faziodev.wcc.db.FlavorService
import org.faziodev.wcc.db.StoresService
import org.faziodev.wcc.types.Store
import java.text.MessageFormat
import java.time.LocalDate
import java.util.*

object FlavorResponseHandler {
    fun handle(date: LocalDate = currentCentralTimeDate(), storeId: String? = null): String {
        val responses = ResourceBundle.getBundle("static_responses")
        val flavorTrouble = responses?.getString("flavorTrouble") ?: "Unknown error."
        return try {
            val flavors = FlavorService.getFlavorsForDate(date, storeId)

            if (flavors.any())
                convertFlavorsToResponse(flavors, date)
            else
                flavorTrouble

        } catch (e: Exception) {
            flavorTrouble
        }
    }
}

object StoreResponseHandler {
    fun handle(storeId: String? = null, city: String? = null, forHours: Boolean = false): String {
        val responses = ResourceBundle.getBundle("static_responses")
        val storeTrouble = responses?.getString("storeTrouble")?.let {template ->
            MessageFormat.format(
                template,
                if(storeId != null) Store.convertStoreIdToName(storeId) else "stores",
                if(city != null) " in $city" else "")
        } ?: "Unknown Error"

        return try {
            val locations = StoresService.getLocations(storeId, city)

            return if(locations.any()) {
                convertLocationsToResponse(locations, storeId, city, forHours)
            } else {
                storeTrouble
            }
        } catch (e: Exception) {
            storeTrouble
        }
    }
}