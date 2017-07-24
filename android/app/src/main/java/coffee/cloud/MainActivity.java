package coffee.cloud;

import android.os.Bundle;

import com.bambora.nativepayment.handlers.BNPaymentHandler;
import com.facebook.react.ReactPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import coffee.cloud.generated.ExponentBuildConstants;
import host.exp.expoview.ExponentActivity;

public class MainActivity extends ExponentActivity {

  String mMerchantID = "T638003301";
  @Override
  protected void onStart() {
    super.onStart();
    BNPaymentHandler.BNPaymentBuilder bnPaymentBuilder = new BNPaymentHandler.BNPaymentBuilder(getApplicationContext())
            .merchantAccount(mMerchantID)
            .debug(true);
    BNPaymentHandler.setupBNPayments(bnPaymentBuilder);
  }

  @Override
  public String publishedUrl() {
    return "exp://exp.host/@ryszardrzepa/coffee-cloud";
  }

  @Override
  public String developmentUrl() {
    return ExponentBuildConstants.DEVELOPMENT_URL;
  }

  @Override
  public List<String> sdkVersions() {
    return new ArrayList<>(Arrays.asList("17.0.0"));
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    return expBundle;
  }
}
