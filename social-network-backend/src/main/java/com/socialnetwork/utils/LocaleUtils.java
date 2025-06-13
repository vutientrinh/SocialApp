package com.socialnetwork.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.annotation.Resource;

import org.springframework.stereotype.Component;

import com.socialnetwork.model.importFailure.ImportFailure;
import com.socialnetwork.service.BasedService;
import com.socialnetwork.service.ImportFailureService;

@Component
public class LocaleUtils extends BasedService {

    @Resource
    private ImportFailureService importFailureService;

    @Resource
    private HashMap<String, HashMap<String, HashMap<String, String>>> messagesMap;

    public static String getMessage(
            HashMap<String, HashMap<String, HashMap<String, String>>> messageMap,
            String locale,
            String type,
            String key) {
        return messageMap.get(locale).get(type).get(key);
    }

    public String getMessageImportComplete(List<ImportFailure> importFailures, String modelType, String locale) {
        importFailureService.mapReasonKeyWithReasonValue(importFailures, locale);
        Map<String, Integer> countErrorAndWarning = importFailureService.countErrorAndWarning(importFailures);
        String baseMessage = LocaleUtils.getMessage(messagesMap, locale, "success", "import-complete");
        return String.format(
                baseMessage, modelType, countErrorAndWarning.get("error"), countErrorAndWarning.get("warning"));
    }
}
