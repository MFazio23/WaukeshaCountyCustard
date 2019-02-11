package org.faziodev.wcc

import org.faziodev.wcc.types.Flavor
import org.faziodev.wcc.types.Location
import org.faziodev.wcc.types.Store
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.WeekFields
import java.util.*

private val weekOfYear = WeekFields.of(Locale.US).weekOfWeekBasedYear()
private val onDateFormat = DateTimeFormatter.ofPattern("MMMM d")
private val dayOfWeekFormat = DateTimeFormatter.ofPattern("EEEE")

fun convertFlavorsToResponse(flavorMap: Map<String, List<Flavor>>, date: LocalDate): String {
    val isInPast = date.isBefore(currentCentralTimeDate())

    val response = StringBuilder("${date.getTextVersion()}, ")

    flavorMap.keys.forEachIndexed { index, storeId ->
        val flavors = flavorMap[storeId] ?: listOf()
        response.append(Store.convertStoreIdToName(storeId))
        response.append(" ${if (isInPast) "had" else "has"} ")
        response.append(flavors.joinToString(" and ") { flavor -> flavor.flavorName })
        if (flavorMap.count() > 1 && flavorMap.count() - 2 >= index) {
            response.append(", ")
            if (flavorMap.count() - 2 == index) response.append("and ")
        }
    }

    return "$response."
}

fun convertLocationsToResponse(
    locations: List<Location>,
    storeId: String? = null,
    city: String? = null,
    forHours: Boolean = false
): String =
    if (forHours && locations.count() == 1) {
        val location = locations.first()

        "The ${location.getStoreName()} in ${location.city} opens at ${location.hours.open} and closes at ${location.hours.close}."
    } else {
        val storeText = when {
            storeId != null -> Store.convertStoreIdToName(storeId)
            locations.count() > 1 -> "stores"
            else -> "store"
        }

        val response = StringBuilder("I found ${locations.count()} $storeText")
        if (city != null) response.append(" in $city")
        response.append(": ")
        response.append(locations.joinToString("; ") { location ->
            when {
                storeId != null && city != null -> "It"
                storeId != null -> "The ${location.city} store"
                city != null -> location.getStoreName() ?: ""
                else -> "${location.getStoreName()} in ${location.city}"
            } + getLocationResponseContent(location, forHours)
        })

        "$response."
    }

fun getLocationResponseContent(location: Location, isForHours: Boolean): String =
    if (isForHours) " opens at ${location.hours.open} and closes at ${location.hours.close}"
    else " is located at ${location.address}"

fun LocalDate.getTextVersion(baseDate: LocalDate = currentCentralTimeDate()): String {
    val now = baseDate
    val currentWeek = now.get(weekOfYear)
    val inputWeek = this.get(weekOfYear)

    println("Checking dates: Now=[$now], Date to check=[$this]")

    return when {
        this == now -> "Today"
        this == now.plusDays(1) -> "Tomorrow"
        this == now.minusDays(1) -> "Yesterday"
        currentWeek == inputWeek -> "This week ${this.format(dayOfWeekFormat)}"
        currentWeek + 1 == inputWeek -> "Next week ${this.format(dayOfWeekFormat)}"
        currentWeek - 1 == inputWeek -> "Last week ${this.format(dayOfWeekFormat)}"
        else -> "On ${this.format(onDateFormat)}${this.getOrdinalSuffix()}"
    }
}

fun LocalDate.getOrdinalSuffix() = this.dayOfMonth.let { day ->
    if (day in 11..13) "th"
    else when (day.rem(10)) {
        1 -> "st"
        2 -> "nd"
        3 -> "rd"
        else -> "th"
    }
}