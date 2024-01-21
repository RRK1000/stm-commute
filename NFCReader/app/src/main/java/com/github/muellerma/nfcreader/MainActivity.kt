package com.github.muellerma.nfcreader

import android.app.PendingIntent
import android.content.Intent
import android.nfc.NdefMessage
import android.nfc.NdefRecord
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.MifareClassic
import android.nfc.tech.MifareUltralight
import android.os.AsyncTask
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.github.muellerma.nfcreader.record.ParsedNdefRecord
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.gson.GsonBuilder
import com.google.gson.JsonParser
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.*
import javax.net.ssl.HttpsURLConnection

class MainActivity : AppCompatActivity() {
    private var tagList: LinearLayout? = null
    private var nfcAdapter: NfcAdapter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        tagList = findViewById<View>(R.id.list) as LinearLayout
        resolveIntent(intent)
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        if (nfcAdapter == null) {
            showNoNfcDialog()
            return
        }
    }

    override fun onResume() {
        super.onResume()
        if (nfcAdapter?.isEnabled == false) {
            openNfcSettings()
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent_Mutable
        )
        nfcAdapter?.enableForegroundDispatch(this, pendingIntent, null, null)
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    public override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        resolveIntent(intent)
    }

    private fun showNoNfcDialog() {
        MaterialAlertDialogBuilder(this)
            .setMessage(R.string.no_nfc)
            .setNeutralButton(R.string.close_app) { _, _ ->
                finish()
            }
            .setCancelable(false)
            .show()
    }

    private fun openNfcSettings() {
        val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            Intent(Settings.Panel.ACTION_NFC)
        } else {
            Intent(Settings.ACTION_WIRELESS_SETTINGS)
        }
        startActivity(intent)
    }

    private fun resolveIntent(intent: Intent) {
        val validActions = listOf(
            NfcAdapter.ACTION_TAG_DISCOVERED,
            NfcAdapter.ACTION_TECH_DISCOVERED,
            NfcAdapter.ACTION_NDEF_DISCOVERED
        )
        if (intent.action in validActions) {
            // TODO
            val rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES)
            val messages = mutableListOf<NdefMessage>()
            var card_id = "9999999"
            if (rawMsgs != null) {
                rawMsgs.forEach {
                    messages.add(it as NdefMessage)
                }
            } else {
                // Unknown tag type
                val empty = ByteArray(0)
                val id = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID)
                val tag = intent.parcelable<Tag>(NfcAdapter.EXTRA_TAG) ?: return
                card_id = toReversedDec(tag.id).toString()
                val payload = dumpTagData(tag).toByteArray()
                val record = NdefRecord(NdefRecord.TNF_UNKNOWN, empty, id, payload)
                val msg = NdefMessage(arrayOf(record))
                messages.add(msg)
            }
            // Setup the views
            buildTagViews(messages)

            // Assuming you have an API endpoint and data to send
            val apiUrl = "https://stm-commute.pockethost.io/"
            val postData = JSONObject()
            Log.d("Messages", messages.toString())
            //postData.put("payload", messages.toString())
            //postData.put("id", "placeholder")
            postData.put("zone", "A")
            postData.put("location", "Saint Catherine - Metcalfe")
            postData.put("card_id", card_id)
            postData.put("status", "OK")

            // Make the API call asynchronously
            AuthApiCallTask().execute(apiUrl, postData.toString())
            //executeApiCallTasks(apiUrl, postData);
        }
    }

    private fun executeApiCallTasks(apiUrl: String, postData: JSONObject) {
        val authToken = getAuthKeyFromAPI(apiUrl)
        if(authToken == "") {
            //TODO fail screen
            Log.d("executeApiCallTasks", "Failed to get Auth token")
            return
        }
        val success = postTripAPICall(apiUrl, authToken, postData)
        if(!success) {
            //TODO fail screen
            Log.d("executeApiCallTasks", "Failed to write record")
            return
        }
        //TODO green tick screen
    }

    private fun getAuthKeyFromAPI(apiUrl: String): String {
        var authToken = ""
        val jsonObject = JSONObject()
        jsonObject.put("identity", "admin@admin.com")
        jsonObject.put("password", "admin123123")
        // Convert JSONObject to String
        val jsonObjectString = jsonObject.toString()
        Log.d("jsonObjectString", jsonObjectString)

        GlobalScope.launch(Dispatchers.IO){
            val url = URL(apiUrl + "api/admins/auth-with-password")
            val urlConnection = url.openConnection() as HttpsURLConnection
            urlConnection.requestMethod = "POST"
            urlConnection.setRequestProperty("Content-Type", "application/json")
            urlConnection.setRequestProperty("Accept", "application/json")
            urlConnection.doInput = true
            urlConnection.doOutput = true

            Log.d("urlConnection", urlConnection.toString())
            // Write the data to the server
            val outputStreamWriter = OutputStreamWriter(urlConnection.outputStream)
            outputStreamWriter.write(jsonObjectString)
            outputStreamWriter.flush()
            outputStreamWriter.close()
            Log.d("doInBackground", "Sent request to server")

            // Server response
            // Check if the connection is successful
            val responseCode = urlConnection.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                val response = urlConnection.inputStream.bufferedReader().use { it.readText() }
                // defaults to UTF-8
                withContext(Dispatchers.Main) {
                    // Convert raw JSON to pretty JSON using GSON library
                    val gson = GsonBuilder().setPrettyPrinting().create()
                    //Log.d("response", response)
                    val prettyJsonString = gson.toJson(JsonParser.parseString(response))
                    val returnedJsonObject = JSONObject(prettyJsonString)
                    Log.d("Pretty Printed JSON :", returnedJsonObject.toString())
                    authToken = returnedJsonObject["token"].toString()
                }
            } else {
                Log.d("HTTPURLCONNECTION_ERROR", responseCode.toString())
                authToken = "Error: $responseCode"
            }
            Log.d("authToken", authToken)
        }
        return authToken
    }

    private fun postTripAPICall(apiUrl: String, authToken: String, postData: JSONObject): Boolean {
        var success = false
        // Convert JSONObject to String
        val jsonObjectString = postData.toString()
        Log.d("jsonObjectString", jsonObjectString)

        GlobalScope.launch(Dispatchers.IO){
            val url = URL(apiUrl + "api/collections/trips/records")
            val urlConnection = url.openConnection() as HttpsURLConnection
            urlConnection.requestMethod = "POST"
            urlConnection.setRequestProperty("Content-Type", "application/json")
            urlConnection.setRequestProperty("Accept", "application/json")
            urlConnection.setRequestProperty("Authorization", authToken)
            urlConnection.doInput = true
            urlConnection.doOutput = true

            Log.d("urlConnection", urlConnection.toString())
            // Write the data to the server
            val outputStreamWriter = OutputStreamWriter(urlConnection.outputStream)
            outputStreamWriter.write(jsonObjectString)
            outputStreamWriter.flush()
            outputStreamWriter.close()
            Log.d("doInBackground", "Sent request to server")

            // Server response
            // Check if the connection is successful
            val responseCode = urlConnection.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                success = true
                val response = urlConnection.inputStream.bufferedReader().use { it.readText() }
                // defaults to UTF-8
                withContext(Dispatchers.Main) {
                    // Convert raw JSON to pretty JSON using GSON library
                    val gson = GsonBuilder().setPrettyPrinting().create()
                    //Log.d("response", response)
                    val prettyJsonString = gson.toJson(JsonParser.parseString(response))
                    val returnedJsonObject = JSONObject(prettyJsonString)
                    Log.d("Pretty Printed JSON :", returnedJsonObject.toString())
                }
            } else {
                Log.d("HTTPURLCONNECTION_ERROR", responseCode.toString())
                success = false
            }
            Log.d("Success", success.toString())
        }
        return success
    }

    private fun dumpTagData(tag: Tag): String {
        val sb = StringBuilder()
        val id = tag.id
        sb.append("ID (hex): ").append(toHex(id)).append('\n')
        sb.append("ID (reversed hex): ").append(toReversedHex(id)).append('\n')
        sb.append("ID (dec): ").append(toDec(id)).append('\n')
        sb.append("ID (reversed dec): ").append(toReversedDec(id)).append('\n')
        val prefix = "android.nfc.tech."
        sb.append("Technologies: ")
        for (tech in tag.techList) {
            sb.append(tech.substring(prefix.length))
            sb.append(", ")
        }
        sb.delete(sb.length - 2, sb.length)
        for (tech in tag.techList) {
            if (tech == MifareClassic::class.java.name) {
                sb.append('\n')
                var type = "Unknown"
                try {
                    val mifareTag = MifareClassic.get(tag)

                    when (mifareTag.type) {
                        MifareClassic.TYPE_CLASSIC -> type = "Classic"
                        MifareClassic.TYPE_PLUS -> type = "Plus"
                        MifareClassic.TYPE_PRO -> type = "Pro"
                    }
                    sb.appendLine("Mifare Classic type: $type")
                    sb.appendLine("Mifare size: ${mifareTag.size} bytes")
                    sb.appendLine("Mifare sectors: ${mifareTag.sectorCount}")
                    sb.appendLine("Mifare blocks: ${mifareTag.blockCount}")
                } catch (e: Exception) {
                    sb.appendLine("Mifare classic error: ${e.message}")
                }
            }
            if (tech == MifareUltralight::class.java.name) {
                sb.append('\n')
                val mifareUlTag = MifareUltralight.get(tag)
                var type = "Unknown"
                when (mifareUlTag.type) {
                    MifareUltralight.TYPE_ULTRALIGHT -> type = "Ultralight"
                    MifareUltralight.TYPE_ULTRALIGHT_C -> type = "Ultralight C"
                }
                sb.append("Mifare Ultralight type: ")
                sb.append(type)
            }
        }
        return sb.toString()
    }

    private fun toHex(bytes: ByteArray): String {
        val sb = StringBuilder()
        for (i in bytes.indices.reversed()) {
            val b = bytes[i].toInt() and 0xff
            if (b < 0x10) sb.append('0')
            sb.append(Integer.toHexString(b))
            if (i > 0) {
                sb.append(" ")
            }
        }
        return sb.toString()
    }

    private fun toReversedHex(bytes: ByteArray): String {
        val sb = StringBuilder()
        for (i in bytes.indices) {
            if (i > 0) {
                sb.append(" ")
            }
            val b = bytes[i].toInt() and 0xff
            if (b < 0x10) sb.append('0')
            sb.append(Integer.toHexString(b))
        }
        return sb.toString()
    }

    private fun toDec(bytes: ByteArray): Long {
        var result: Long = 0
        var factor: Long = 1
        for (i in bytes.indices) {
            val value = bytes[i].toLong() and 0xffL
            result += value * factor
            factor *= 256L
        }
        return result
    }

    private fun toReversedDec(bytes: ByteArray): Long {
        var result: Long = 0
        var factor: Long = 1
        for (i in bytes.indices.reversed()) {
            val value = bytes[i].toLong() and 0xffL
            result += value * factor
            factor *= 256L
        }
        return result
    }

    private fun buildTagViews(msgs: List<NdefMessage>) {
        if (msgs.isEmpty()) {
            return
        }
        val inflater = LayoutInflater.from(this)
        val content = tagList

        // Parse the first message in the list
        // Build views for all of the sub records
        val now = Date()
        val records = NdefMessageParser.parse(msgs[0])
        val size = records.size
        for (i in 0 until size) {
            val timeView = TextView(this)
            timeView.text = TIME_FORMAT.format(now)
            content!!.addView(timeView, 0)
            val record: ParsedNdefRecord = records[i]
            content.addView(record.getView(this, inflater, content, i), 1 + i)
            content.addView(inflater.inflate(R.layout.tag_divider, content, false), 2 + i)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.menu_main_clear -> {
                clearTags()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun clearTags() {
        for (i in tagList!!.childCount - 1 downTo 0) {
            val view = tagList!!.getChildAt(i)
            if (view.id != R.id.tag_viewer_text) {
                tagList!!.removeViewAt(i)
            }
        }
    }

    companion object {
        private val TIME_FORMAT = SimpleDateFormat.getDateTimeInstance()
    }

    private inner class AuthApiCallTask: AsyncTask<String, Void, String>() {

        private var apiUrl: String? = ""
        private var authToken = ""
        private var tripsPostData: String? = ""
        override fun doInBackground(vararg params: String?): String {
            apiUrl = params[0]
            tripsPostData = params[1]

            val jsonObject = JSONObject()
            jsonObject.put("identity", "admin@admin.com")
            jsonObject.put("password", "admin123123")
            // Convert JSONObject to String
            val jsonObjectString = jsonObject.toString()
            Log.d("jsonObjectString", jsonObjectString)

            val url = URL(apiUrl + "api/admins/auth-with-password")
            val urlConnection = url.openConnection() as HttpsURLConnection
            urlConnection.requestMethod = "POST"
            urlConnection.setRequestProperty("Content-Type", "application/json")
            urlConnection.setRequestProperty("Accept", "application/json")
            urlConnection.doInput = true
            urlConnection.doOutput = true

            Log.d("urlConnection", urlConnection.toString())
            // Write the data to the server
            val outputStreamWriter = OutputStreamWriter(urlConnection.outputStream)
            outputStreamWriter.write(jsonObjectString)
            outputStreamWriter.flush()
            outputStreamWriter.close()
            Log.d("doInBackground", "Sent request to server")

            // Server response
            // Check if the connection is successful
            val responseCode = urlConnection.responseCode
            var prettyJsonString = ""
            if (responseCode == HttpURLConnection.HTTP_OK) {
                val response = urlConnection.inputStream.bufferedReader().use { it.readText() }
                // defaults to UTF-8
                // Convert raw JSON to pretty JSON using GSON library
                val gson = GsonBuilder().setPrettyPrinting().create()
                //Log.d("response", response)
                prettyJsonString = gson.toJson(JsonParser.parseString(response))
                val returnedJsonObject = JSONObject(prettyJsonString)
                Log.d("Pretty Printed JSON :", returnedJsonObject.toString())
                authToken = returnedJsonObject["token"].toString()
            } else {
                Log.d("HTTPURLCONNECTION_ERROR", responseCode.toString())
                authToken = "Error: $responseCode"
            }
            Log.d("authToken", authToken)
            return prettyJsonString
        }

        override fun onPostExecute(response: String) {
            Log.d("onPostExecute",
                "AuthApiCallTask - Reached Post API call exec function! $authToken"
            )
            TripsWriteApiCallTask().execute(apiUrl, authToken, tripsPostData)
        }

    }

    private inner class TripsWriteApiCallTask: AsyncTask<String, Void, String>() {

        private var apiUrl: String? = ""
        private var authToken = ""
        private var tripsPostData: String? = ""
        private var isSuccess: Boolean? = false
        override fun doInBackground(vararg params: String): String {
            Log.d("doInBackground", "TripsWriteApiCallTask - Reached API call exec function!")
            apiUrl = params[0]
            authToken = params[1]
            tripsPostData = params[2]

            val url = URL(apiUrl + "api/collections/trips/records")
            val urlConnection = url.openConnection() as HttpsURLConnection
            urlConnection.requestMethod = "POST"
            urlConnection.setRequestProperty("Content-Type", "application/json")
            urlConnection.setRequestProperty("Accept", "application/json")
            urlConnection.setRequestProperty("Authorization", authToken)
            urlConnection.doInput = true
            urlConnection.doOutput = true

            Log.d("urlConnection", urlConnection.toString())
            // Write the data to the server
            val outputStreamWriter = OutputStreamWriter(urlConnection.outputStream)
            outputStreamWriter.write(tripsPostData)
            outputStreamWriter.flush()
            outputStreamWriter.close()
            Log.d("doInBackground", "Sent request to server")

            // Server response
            // Check if the connection is successful
            val responseCode = urlConnection.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                isSuccess = true
                val response = urlConnection.inputStream.bufferedReader().use { it.readText() }
                // defaults to UTF-8
                // Convert raw JSON to pretty JSON using GSON library
                val gson = GsonBuilder().setPrettyPrinting().create()
                //Log.d("response", response)
                val prettyJsonString = gson.toJson(JsonParser.parseString(response))
                val returnedJsonObject = JSONObject(prettyJsonString)
                Log.d("Pretty Printed JSON :", returnedJsonObject.toString())

            } else {
                Log.d("HTTPURLCONNECTION_ERROR", responseCode.toString())
                isSuccess = false
            }
            Log.d("Success", isSuccess.toString())
            return isSuccess.toString()
        }

        override fun onPostExecute(isSuccess: String) {
            Log.d("onPostExecute", "TripsWriteApiCallTask - Reached end of API call exec function!")
            if(isSuccess != "true") {
                Log.d("NOT VALID", "Failed to write trip")
                return
            }
            Log.d("VALID", "Wrote trip successfully")
        }
    }

    private inner class AuthApiCallTaskOld : AsyncTask<String, Void, String>() {

        private var authToken: String? = null
        private var tripPostData: JSONObject? = null;

        override fun doInBackground(vararg params: String): String {
            val apiUrl = params[0]
//            tripPostData = params[1]

            var result = ""
            var urlConnection: HttpsURLConnection? = null

            // Get auth token
            try {
                val jsonObject = JSONObject()
                jsonObject.put("identity", "admin@admin.com")
                jsonObject.put("password", "admin123123")
                // Convert JSONObject to String
                val jsonObjectString = jsonObject.toString()
                Log.d("jsonObjectString", jsonObjectString)

                val url = URL(apiUrl + "api/admins/auth-with-password")
                urlConnection = url.openConnection() as HttpsURLConnection
                urlConnection.requestMethod = "POST"
                urlConnection.setRequestProperty("Content-Type", "application/json")
                urlConnection.setRequestProperty("Accept", "application/json")

                urlConnection.doInput = true
                urlConnection.doOutput = true

                Log.d("urlConnection", urlConnection.toString())
                // Write the data to the server
                val outputStreamWriter = OutputStreamWriter(urlConnection.outputStream)
                outputStreamWriter.write(jsonObjectString)
                outputStreamWriter.flush()
                outputStreamWriter.close()
                Log.d("doInBackground", "Sent request to server")

                // Server response
                // Check if the connection is successful
                val responseCode = urlConnection.responseCode
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val response = urlConnection.inputStream.bufferedReader().use { it.readText() }
                    // defaults to UTF-8

                    // Convert raw JSON to pretty JSON using GSON library
                    val gson = GsonBuilder().setPrettyPrinting().create()
                    Log.d("response", response)
                    val prettyJson = gson.toJson(JsonParser.parseString(response))
                    Log.d("Pretty Printed JSON :", prettyJson)
                    result = prettyJson
                } else {
                    Log.d("HTTPURLCONNECTION_ERROR", responseCode.toString())
                    result = "Error: $responseCode"
                }
                Log.d("result", result)

            } catch (e: Exception) {
                result = "Error: ${e.message}"
            } finally {
                urlConnection?.disconnect()
            }

//
//            // Make actual API call
//            try {
//                val url = URL(apiUrl + "api/collections/trips/records")
//                urlConnection = url.openConnection() as HttpURLConnection
//                urlConnection.requestMethod = "POST"
//                urlConnection.setRequestProperty("Content-Type", "application/json")
//                urlConnection.setRequestProperty("Authorization", authToken)
//                urlConnection.doOutput = true
//
//                // Write the data to the server
//                val outputStream = DataOutputStream(urlConnection.outputStream)
//                outputStream.write(postData.toByteArray(Charsets.UTF_8))
//                outputStream.flush()
//                outputStream.close()
//
//                // Read the response from the server
//                val responseCode = urlConnection.responseCode
//                if (responseCode == HttpURLConnection.HTTP_OK) {
//                    val reader = BufferedReader(InputStreamReader(urlConnection.inputStream))
//                    var line: String?
//                    while (reader.readLine().also { line = it } != null) {
//                        result += line
//                    }
//                    reader.close()
//                } else {
//                    result = "HTTP error code: $responseCode"
//                }
//            } catch (e: Exception) {
//                result = "Error: ${e.message}"
//            } finally {
//                urlConnection?.disconnect()
//            }

            return result
        }

        override fun onPostExecute(result: String) {
            Log.d("onPostExecute", "AuthApiCallTask - Reached Post API call exec function!")
        }
    }
}