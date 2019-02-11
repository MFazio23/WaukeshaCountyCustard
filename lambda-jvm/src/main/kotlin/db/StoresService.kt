package org.faziodev.wcc.db

import org.faziodev.wcc.types.Location

object StoresService {
    fun getStore(storeId: String? = null) = FirebaseHandler.stores[storeId]

    fun getLocations(storeId: String? = null, city: String? = null): List<Location> =
        (if (storeId != null) FirebaseHandler.stores[storeId]?.locations?.values ?: listOf()
        else FirebaseHandler.stores.values.flatMap { it.locations.values })
            .filter { location -> city == null || location.city == city }
}