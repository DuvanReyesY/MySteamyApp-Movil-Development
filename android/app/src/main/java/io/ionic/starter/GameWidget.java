package io.ionic.starter;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;

public class GameWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Intent intent = new Intent(context, WidgetUpdateService.class);
        context.startService(intent);
    }

    @Override
    public void onEnabled(Context context) {
        Intent intent = new Intent(context, WidgetUpdateService.class);
        context.startService(intent);
    }
}