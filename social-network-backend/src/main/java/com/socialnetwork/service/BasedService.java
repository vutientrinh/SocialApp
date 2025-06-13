package com.socialnetwork.service;

import java.io.*;

import com.socialnetwork.utils.EnvironmentUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class BasedService {

    protected void updateStateImportFile(String pathFile) {
        // Get path of file imported-file.log
        String pathLogFile = EnvironmentUtils.getEnvironmentValue("import-files.imported-files");
        try {
            File file = new File(pathLogFile);
            BufferedWriter bw = new BufferedWriter(new FileWriter(file, true));
            bw.write(pathFile);
            bw.newLine();
            bw.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean isImported(String pathFile) {
        // Get path of file imported-file.log
        String pathLogFile = EnvironmentUtils.getEnvironmentValue("import-files.imported-files");
        try {
            BufferedReader reader = new BufferedReader(new FileReader(pathLogFile));
            String line = reader.readLine();

            while (line != null) {
                if (line.equals(pathFile)) return true;
                // read next line
                line = reader.readLine();
            }
            reader.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return false;
    }
}
