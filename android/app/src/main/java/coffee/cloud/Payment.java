package coffee.cloud;

import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.DialogInterface;
import android.content.Intent;
import android.widget.Toast;

import com.bambora.nativepayment.handlers.BNPaymentHandler;
import com.bambora.nativepayment.interfaces.ITransactionListener;
import com.bambora.nativepayment.managers.CreditCardManager;
import com.bambora.nativepayment.models.PaymentSettings;
import com.bambora.nativepayment.models.creditcard.CreditCard;
import com.bambora.nativepayment.network.RequestError;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import coffee.cloud.adapter.CardListAdapter;

public class Payment extends ReactContextBaseJavaModule {

    Callback _callback = null;
    static Callback _forceCallback = null;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    ReactContext reactContext;

    public Payment(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Payment";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void show(String message, Callback callback) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_LONG).show();
        callback.invoke("str");
    }

    @ReactMethod
    public void getCreditCardCount(final Callback callback) {
        BNPaymentHandler.getInstance().getRegisteredCreditCards(getReactApplicationContext(), new CreditCardManager.IOnCreditCardRead() {
            @Override
            public void onCreditCardRead(List<CreditCard> creditCards) {
                if (creditCards != null && creditCards.size() > 0) {
                    callback.invoke(creditCards.size());
                } else {
                    callback.invoke(0);
                }
            }
        });
    }

    @ReactMethod
    public void goToRegisterCardView(Callback callback) {
        _forceCallback = callback;
        Intent intent = new Intent(getCurrentActivity(), NativeCardRegistrationActivity.class);
        getCurrentActivity().startActivity(intent);
//        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        getCurrentActivity().finish();
    }

    @ReactMethod
    public void makePayment(Callback callback) {
        _callback = callback;
        BNPaymentHandler.getInstance().getRegisteredCreditCards(getReactApplicationContext(), new CreditCardManager.IOnCreditCardRead() {
            @Override
            public void onCreditCardRead(List<CreditCard> creditCards) {
                showCardListDialog(creditCards);
            }
        });
    }

    //handle payment
    private void showCardListDialog(final List<CreditCard> creditCardList) {
        CardListAdapter listAdapter = new CardListAdapter(getCurrentActivity(), creditCardList);
        if (creditCardList.size() == 1) {
            makeTransaction(creditCardList.get(0));
        } else {
            Builder builder = new Builder(getCurrentActivity());
            builder.setTitle("Select a card");
            builder.setNegativeButton("Cancel", null);
            builder.setAdapter(listAdapter, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    makeTransaction(creditCardList.get(which));
                }
            });
            builder.create().show();
        }
    }

    private void makeTransaction(CreditCard creditCard) {
        String paymentId = "test-payment-" + new Date().getTime();
        PaymentSettings paymentSettings = new PaymentSettings();
        paymentSettings.amount = 100;
        paymentSettings.currency = "SEK";
        paymentSettings.comment = "This is a test transaction.";
        paymentSettings.creditCardToken = creditCard.getCreditCardToken();
        BNPaymentHandler.getInstance().makeTransaction(paymentId, paymentSettings, new ITransactionListener() {
            @Override
            public void onTransactionSuccess() {
                showDialog("Success", "The payment succeeded.");
                _callback.invoke("paid");
            }

            @Override
            public void onTransactionError(RequestError error) {
                showDialog("Failure", "The payment did not succeed.");
                _callback.invoke("unpaid");
            }
        });
    }

    private void showDialog(String title, String message) {
        new AlertDialog.Builder(getCurrentActivity())
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                }
            })
            .setIcon(android.R.drawable.ic_dialog_alert)
            .show();
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }
}