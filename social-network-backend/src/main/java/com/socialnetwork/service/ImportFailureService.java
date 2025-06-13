package com.socialnetwork.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.annotation.Resource;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.socialnetwork.model.enums.ImportFailureType;
import com.socialnetwork.model.filters.ImportFailureFilter;
import com.socialnetwork.model.importFailure.ImportFailure;
import com.socialnetwork.repository.ImportFailureRepository;
import com.socialnetwork.utils.ConvertDataFilterUtils;
import com.socialnetwork.utils.LocaleUtils;

@Service
public class ImportFailureService {

    @Resource
    private HashMap<String, HashMap<String, HashMap<String, String>>> messageJSON;

    @Resource
    private ImportFailureRepository importFailureRepository;

    public void addIntoListImportFailure(
            List<ImportFailure> importFailures,
            String primaryKey,
            String reasonKey,
            String reasonValue,
            ImportFailureType type) {
        ImportFailure importFailure = new ImportFailure(primaryKey, reasonKey, reasonValue, type.getValue());
        importFailures.add(importFailure);
    }

    public void setFileUUIDForListImportFailure(List<ImportFailure> importFailures, String fileUUID) {
        for (ImportFailure importFailure : importFailures) {
            importFailure.setFileUUID(fileUUID);
        }
    }

    public void mapReasonKeyWithReasonValue(List<ImportFailure> importFailures, String locale) {
        for (ImportFailure importFailure : importFailures) {
            String[] reasonValues = importFailure.getReasonValue().split("###");
            String baseMessage =
                    LocaleUtils.getMessage(messageJSON, locale, importFailure.getType(), importFailure.getReasonKey());
            importFailure.setReason(String.format(baseMessage, reasonValues));
        }
    }

    public Map<String, Integer> countErrorAndWarning(List<ImportFailure> importFailures) {
        Map<String, Integer> result = new HashMap<>();
        int error = 0;
        int warning = 0;
        for (ImportFailure importFailure : importFailures) {
            if (importFailure.getType().equals(ImportFailureType.ERROR.getValue())) {
                error++;
                continue;
            }
            if (importFailure.getType().equals(ImportFailureType.WARNING.getValue())) warning++;
        }
        result.put(ImportFailureType.ERROR.getValue(), error);
        result.put(ImportFailureType.WARNING.getValue(), warning);

        return result;
    }

    public Map<String, Object> getDataForTable(ImportFailureFilter filter, int pageNo, int perPage, String locale) {
        Map<String, Object> result = new HashMap<>();

        Pageable pageable = PageRequest.of(pageNo == 0 ? pageNo : pageNo - 1, perPage == 0 ? 100 : perPage);
        List<ImportFailure> getImportFailureList = importFailureRepository.getByFilter(
                ConvertDataFilterUtils.convertFilter(filter.getFileUUID()),
                ConvertDataFilterUtils.convertFilter(filter.getSearch()),
                pageable);
        mapReasonKeyWithReasonValue(getImportFailureList, locale);
        result.put("listImportFailure", getImportFailureList);

        long countAllWithFilter = importFailureRepository.countAllWithFilter(
                ConvertDataFilterUtils.convertFilter(filter.getFileUUID()),
                ConvertDataFilterUtils.convertFilter(filter.getSearch()));
        result.put("totalItems", countAllWithFilter);

        int total = importFailureRepository.countAll(filter.getFileUUID());
        int totalError = importFailureRepository.countError(filter.getFileUUID());
        int totalWarning = total - totalError;

        result.put("overview", mapMessageCountAll(locale, totalError, totalWarning));

        return result;
    }

    public String mapMessageCountAll(String locale, int totalError, int totalWarning) {
        String baseMessage = LocaleUtils.getMessage(messageJSON, locale, "success", "totalError-totalWarning");
        return String.format(baseMessage, totalError, totalWarning);
    }
}
