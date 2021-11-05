package org.faziodev.wcc.types

data class Store(
    val id: String,
    val name: String,
    val shortName: String,
    val flavorsUrl: String,
    val locations: Map<String, Location>
) {
    val properStoreName = storeNameMapping[name]

    companion object {
        private val storeNameMapping = mapOf(
            "kopps" to "Kopp's",
            "oscars" to "Oscar's",
            "murfs" to "Murf's",
            "leducs" to "LeDuc's"
        )
        fun convertStoreIdToName(id: String) = storeNameMapping[id]
    }
}