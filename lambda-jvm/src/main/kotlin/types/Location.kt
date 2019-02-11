package org.faziodev.wcc.types

data class Location(
    val storeId: String,
    val address: String,
    val city: String,
    val phone: String,
    val hours: StoreHours
) {
    fun getStoreName() = Store.convertStoreIdToName(storeId)
}