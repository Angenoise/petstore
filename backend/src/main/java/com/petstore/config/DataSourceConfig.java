package com.petstore.config;

import java.net.URI;
import java.net.URISyntaxException;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(
        @Value("${database.url}") String rawUrl,
        @Value("${database.username:petstore}") String configuredUsername,
        @Value("${database.password:petstore}") String configuredPassword
    ) {
        ParsedDatabaseUrl parsedUrl = parseDatabaseUrl(rawUrl);
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(parsedUrl.jdbcUrl());
        dataSource.setUsername(parsedUrl.username() == null || parsedUrl.username().isBlank() ? configuredUsername : parsedUrl.username());
        dataSource.setPassword(parsedUrl.password() == null || parsedUrl.password().isBlank() ? configuredPassword : parsedUrl.password());
        return dataSource;
    }

    private ParsedDatabaseUrl parseDatabaseUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.isBlank()) {
            return new ParsedDatabaseUrl("jdbc:postgresql://localhost:5432/petstore", null, null);
        }

        if (rawUrl.startsWith("jdbc:")) {
            return new ParsedDatabaseUrl(rawUrl, null, null);
        }

        try {
            URI uri = new URI(rawUrl);
            String jdbcUrl = "jdbc:postgresql://" + uri.getHost()
                + (uri.getPort() > 0 ? ":" + uri.getPort() : "")
                + uri.getPath()
                + (uri.getRawQuery() == null ? "" : "?" + uri.getRawQuery());

            String username = null;
            String password = null;
            if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                String[] credentials = uri.getUserInfo().split(":", 2);
                username = credentials[0];
                password = credentials.length > 1 ? credentials[1] : null;
            }

            return new ParsedDatabaseUrl(jdbcUrl, username, password);
        } catch (URISyntaxException ex) {
            return new ParsedDatabaseUrl(rawUrl, null, null);
        }
    }

    private record ParsedDatabaseUrl(String jdbcUrl, String username, String password) {}
}
