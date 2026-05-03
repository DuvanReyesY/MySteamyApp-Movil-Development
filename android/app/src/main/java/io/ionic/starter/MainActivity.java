package io.ionic.starter;

import android.content.Intent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onResume() {
        super.onResume();
        try {
            // Le decimos al servicio del widget que despierte y vuelva a rotar
            Intent intent = new Intent(this, WidgetUpdateService.class);
            startService(intent);
        } catch (Exception e) {
            // Por si el OS bloquea el servicio en algún momento extremo
            e.printStackTrace();
        }
    }
}
