package org.faziodev.wcc.db

import org.faziodev.wcc.currentCentralTimeDate
import org.faziodev.wcc.types.Flavor
import java.time.LocalDate
import java.time.format.DateTimeFormatter

object FlavorService {
    private val dateFormat = DateTimeFormatter.BASIC_ISO_DATE

    fun getFlavorsForDate(date: LocalDate = currentCentralTimeDate(), storeId: String?): Map<String, List<Flavor>> {
        val selectedDate = (date).format(dateFormat)
        val flavorsForDate = FirebaseHandler.flavors[selectedDate] ?: mapOf()

        return if (storeId != null) {
            mapOf(storeId to (flavorsForDate[storeId] ?: listOf()))
        } else {
            flavorsForDate
        }
    }
}