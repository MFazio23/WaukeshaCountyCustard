package org.faziodev.wcc.db

import com.github.kittinunf.fuel.httpGet
import com.github.salomonbrys.kotson.fromJson
import com.google.gson.Gson
import org.faziodev.wcc.types.Flavor
import org.faziodev.wcc.types.Store

object FirebaseHandler {
    private const val flavorsUrl = "https://waukeshacountycustard.firebaseio.com/flavors.json"
    private const val storesUrl = "https://waukeshacountycustard.firebaseio.com/stores.json"

    private val gson = Gson()

    var flavors: FlavorMap = mapOf()
    var stores: StoreMap = mapOf()

    init {
        val (_, _, flavorsResult) = flavorsUrl.httpGet().responseString()
        flavors = gson.fromJson(flavorsResult.get())

        val (_, _, storesResult) = storesUrl.httpGet().responseString()
        val storeMap = gson.fromJson<StoreMap>(storesResult.get())
        stores = storeMap.mapValues { (storeId, store) ->
            store.copy(
                id = storeId,
                locations = store.locations.mapValues { (_, location) -> location.copy(storeId = storeId) })
        }
    }
}

typealias FlavorMap = Map<String, Map<String, List<Flavor>>>
typealias StoreMap = Map<String, Store>