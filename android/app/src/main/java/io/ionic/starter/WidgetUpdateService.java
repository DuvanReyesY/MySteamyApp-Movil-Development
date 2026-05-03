package io.ionic.starter;

import android.app.Service;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class WidgetUpdateService extends Service implements SharedPreferences.OnSharedPreferenceChangeListener {

    private Handler handler = new Handler();
    private ExecutorService executor = Executors.newSingleThreadExecutor();
    private SharedPreferences prefs;

    private String gameTitle = "";
    private Bitmap gameBackground = null;
    private List<DealInfo> currentDeals = new ArrayList<>();
    private HashMap<String, StoreInfo> storesMap = new HashMap<>();

    private int currentDealIndex = 0;
    private int currentFlipperPage = 0;

    @Override
    public void onCreate() {
        super.onCreate();
        prefs = getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        prefs.registerOnSharedPreferenceChangeListener(this);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String favoriteGameJson = prefs.getString("favoriteGame", null);

        if (favoriteGameJson != null) {
            try {
                JSONObject json = new JSONObject(favoriteGameJson);
                String gameId = json.getString("gameID");
                executor.execute(() -> fetchGameAndDeals(gameId));
            } catch (Exception e) {
                Log.e("GameWidget", "Error parseando JSON de Capacitor", e);
            }
        }
        return START_STICKY;
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        if ("favoriteGame".equals(key)) {
            String favoriteGameJson = sharedPreferences.getString("favoriteGame", null);

            if (favoriteGameJson != null) {
                try {
                    JSONObject json = new JSONObject(favoriteGameJson);
                    String gameId = json.getString("gameID");

                    Log.d("GameWidget", "¡Nuevo juego detectado! Actualizando widget al instante...");
                    executor.execute(() -> fetchGameAndDeals(gameId));

                } catch (Exception e) {
                    Log.e("GameWidget", "Error parseando nuevo JSON", e);
                }
            } else {
                handler.removeCallbacksAndMessages(null);
            }
        }
    }

    private void fetchGameAndDeals(String gameId) {
        try {
            String storesJson = makeHttpRequest("https://www.cheapshark.com/api/1.0/stores");
            JSONArray storesArray = new JSONArray(storesJson);
            for (int i = 0; i < storesArray.length(); i++) {
                JSONObject storeObj = storesArray.getJSONObject(i);
                String storeID = storeObj.getString("storeID");
                String storeName = storeObj.getString("storeName");
                String logoPath = storeObj.getJSONObject("images").getString("logo");
                storesMap.put(storeID, new StoreInfo(storeName, "https://www.cheapshark.com" + logoPath));
            }

            String gameJson = makeHttpRequest("https://www.cheapshark.com/api/1.0/games?id=" + gameId);
            JSONObject gameObj = new JSONObject(gameJson);

            JSONObject info = gameObj.getJSONObject("info");
            gameTitle = info.getString("title");
            gameBackground = downloadImage(info.getString("thumb"));

            JSONArray dealsArray = gameObj.getJSONArray("deals");
            currentDeals.clear();
            for (int i = 0; i < dealsArray.length(); i++) {
                JSONObject d = dealsArray.getJSONObject(i);
                DealInfo dealInfo = new DealInfo();
                dealInfo.storeID = d.getString("storeID");
                dealInfo.price = d.getString("price");
                dealInfo.retailPrice = d.getString("retailPrice");
                currentDeals.add(dealInfo);
            }

            // D) Iniciar Rotación
            if (!currentDeals.isEmpty()) {
                currentDealIndex = 0;
                startWidgetRotation();
            }

        } catch (Exception e) {
            Log.e("GameWidget", "Error en fetchGameAndDeals", e);
        }
    }

    private void startWidgetRotation() {
        handler.removeCallbacksAndMessages(null);

        Runnable rotationRunnable = new Runnable() {
            @Override
            public void run() {
                updateWidgetUI();
                currentDealIndex = (currentDealIndex + 1) % currentDeals.size();
                handler.postDelayed(this, 5000);
            }
        };
        handler.post(rotationRunnable);
    }

    private void updateWidgetUI() {
        Context context = getApplicationContext();
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName thisWidget = new ComponentName(context, GameWidget.class);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.game_widget);

        if (currentDeals.isEmpty()) return;

        DealInfo deal = currentDeals.get(currentDealIndex);
        StoreInfo store = storesMap.get(deal.storeID);

        int targetPage = (currentFlipperPage == 0) ? 1 : 0;

        int logoId = (targetPage == 0) ? R.id.store_logo0 : R.id.store_logo1;
        int storeNameId = (targetPage == 0) ? R.id.store_name0 : R.id.store_name1;
        int retailPriceId = (targetPage == 0) ? R.id.retail_price0 : R.id.retail_price1;
        int salePriceId = (targetPage == 0) ? R.id.sale_price0 : R.id.sale_price1;

        if (gameBackground != null) {
            views.setImageViewBitmap(R.id.game_bg, gameBackground);
        }
        views.setTextViewText(R.id.game_title, gameTitle);

        views.setTextViewText(storeNameId, store.name);

        if (store.logoUrl != null) {
            executor.execute(() -> {
                try {
                    URL url = new URL(store.logoUrl);
                    Bitmap logoBitmap = BitmapFactory.decodeStream(url.openConnection().getInputStream());
                    if (logoBitmap != null) {
                        handler.post(() -> {
                            views.setImageViewBitmap(logoId, logoBitmap);
                            appWidgetManager.updateAppWidget(thisWidget, views);
                        });
                    }
                } catch (Exception e) {
                    Log.e("GameWidget", "Error descargando logo", e);
                }
            });
        }

        views.setTextViewText(salePriceId, "$" + deal.price);

        String retailPriceStr = "$" + deal.retailPrice;
        views.setTextViewText(retailPriceId, retailPriceStr);
      views.setInt(retailPriceId, "setPaintFlags", android.graphics.Paint.STRIKE_THRU_TEXT_FLAG | android.graphics.Paint.ANTI_ALIAS_FLAG);

        views.setDisplayedChild(R.id.viewFlipper, targetPage);
        currentFlipperPage = targetPage;

        appWidgetManager.updateAppWidget(thisWidget, views);
    }

    private String makeHttpRequest(String urlString) throws Exception {
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        InputStream is = conn.getInputStream();
        java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
        return s.hasNext() ? s.next() : "";
    }

    private Bitmap downloadImage(String urlString) {
        try {
            URL url = new URL(urlString);
            return BitmapFactory.decodeStream(url.openConnection().getInputStream());
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (prefs != null) {
            prefs.unregisterOnSharedPreferenceChangeListener(this);
        }
        handler.removeCallbacksAndMessages(null);
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }

    class DealInfo { String storeID, price, retailPrice; }
    class StoreInfo {
        String name, logoUrl;
        StoreInfo(String n, String url) { name = n; logoUrl = url; }
    }
}
