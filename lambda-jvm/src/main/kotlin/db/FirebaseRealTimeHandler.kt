package org.faziodev.wcc.db
/*import com.github.salomonbrys.kotson.fromJson
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.database.*
import com.google.gson.Gson
import org.faziodev.wcc.types.Flavor
import org.faziodev.wcc.types.Store
import java.lang.Exception*/

/*class FirebaseRealTimeHandler {
    private val databaseBaseUrl = "https://waukeshacountycustard.firebaseio.com/"
    private var flavorsRef: DatabaseReference? = null
    private var storesRef: DatabaseReference? = null

    var flavors: Map<String, Map<String, List<Flavor>>> = mapOf()
    var stores: Map<String, Store> = mapOf()

    init {
        try {
            println("Initializing FirebaseRealTimeHandler")

            val classLoader = javaClass.classLoader
            val serviceAccount = classLoader?.getResourceAsStream("service-account-key.json")
            val firebaseOptions = FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl(databaseBaseUrl)
                .build()

            println("Initializing FirebaseApp")
            FirebaseApp.initializeApp(firebaseOptions)

            val dbReference = FirebaseDatabase.getInstance().reference
            flavorsRef = dbReference.child("flavors")
            storesRef = dbReference.child("stores")

            println("Heading off to initialize the listeners...")
            initializeListeners()
        } catch(e: Exception) {
            println("Exception thrown.")
            e.printStackTrace()
        }
    }

    private fun initializeListeners() {
        println("FlavorsRef: $flavorsRef")
        flavorsRef?.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot?) {
                val value = snapshot?.getValue(String::class.java) ?: ""

                flavors = Gson().fromJson(value)

                println("Data value: ${flavors["20180919"]}")
                println("Value: $value")
            }

            override fun onCancelled(error: DatabaseError?) {}
        })
        println("StoresRef: $storesRef")
        storesRef?.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot?) {
                val value = snapshot?.getValue(String::class.java) ?: ""
                stores = Gson().fromJson(value)
            }

            override fun onCancelled(error: DatabaseError?) {}
        })
    }
}*/
