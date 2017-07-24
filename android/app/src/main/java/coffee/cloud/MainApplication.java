package coffee.cloud;

import android.support.multidex.MultiDexApplication;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

// Needed for `react-native link`

public class MainApplication extends MultiDexApplication {

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
//      new MainReactPackage(),
      new BamboraPackage(this)
    );
  }
}
