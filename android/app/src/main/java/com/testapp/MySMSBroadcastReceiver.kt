package com.testapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

class MySMSBroadcastReceiver : BroadcastReceiver() {

    private var listener: Listener? = null

    fun initListener(listener: Listener) {
        this.listener = listener
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == SmsRetriever.SMS_RETRIEVED_ACTION) {
            val extras = intent.extras
            extras?.let {
                val status = it.get(SmsRetriever.EXTRA_STATUS) as? Status
                if (status?.statusCode == CommonStatusCodes.SUCCESS) {
                    val message = it.getString(SmsRetriever.EXTRA_SMS_MESSAGE)
                    val otp = Regex("\\d{6,}").find(message ?: "")?.value // ==> You can change this to your logic or need. Here i use 6 digit OTP number extraction.
                    Log.d("OTPModule", "Extracted OTP: $otp")
                    listener?.onOtpReceived(otp)
                } else {
                    Log.e("OTPModule", "SMS retrieval failed with status: $status")
                }
            }
        }
    }

    interface Listener {
        fun onOtpReceived(value: String?)
    }
}