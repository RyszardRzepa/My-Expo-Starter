package coffee.cloud;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

import com.bambora.nativepayment.interfaces.ICardRegistrationCallback;
import com.bambora.nativepayment.models.creditcard.CreditCard;
import com.bambora.nativepayment.network.RequestError;
import com.bambora.nativepayment.widget.CardRegistrationFormLayout;
import com.facebook.react.ReactInstanceManager;

public class NativeCardRegistrationActivity extends AppCompatActivity implements ICardRegistrationCallback {

    private ReactInstanceManager mReactInstanceManager;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_native_card_registration);
        CardRegistrationFormLayout registrationForm = (CardRegistrationFormLayout) findViewById(R.id.registration_form);
        registrationForm.setRegistrationResultListener(this);
    }

    @Override
    public void onRegistrationSuccess(CreditCard creditCard) {
        finish();
        Payment._forceCallback.invoke("success");
    }

    @Override
    public void onRegistrationError(RequestError error) {
        Toast.makeText(this, "Card registration failed.", Toast.LENGTH_SHORT).show();
    }
}