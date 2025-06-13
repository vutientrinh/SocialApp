package com.socialnetwork.advice;

import com.socialnetwork.exception.CannotCreateFileException;
import com.socialnetwork.exception.PostNotFoundException;
import com.socialnetwork.exception.TokenRefreshException;
import com.socialnetwork.response.ErrorResponse;
import com.socialnetwork.utils.LocaleUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;

@ControllerAdvice
@Slf4j
public class GlobalHandleException {

    @Resource
    private HashMap<String, HashMap<String, HashMap<String, String>>> messagesMap;

    protected void logError(String message, Exception... exception) {
        log.error(message, exception);
    }

    private String getMessageByLocaleForException(
            WebRequest request, String messageGroup, String messageKey, Object... messageValues) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) request;
        HttpServletRequest servletRequest = attributes.getRequest();
        String locale = servletRequest.getHeader("locale");
        locale = locale == null ? "en" : locale;
        String baseMessage = LocaleUtils.getMessage(messagesMap, locale, messageGroup, messageKey);
        return String.format(baseMessage, messageValues);
    }

    private ResponseEntity<ErrorResponse> handleExceptionHelper(
            Exception exception,
            WebRequest request,
            HttpStatus httpStatus,
            String messageGroup,
            String messageKey,
            Object... messageValues) {
        String message = getMessageByLocaleForException(request, messageGroup, messageKey, messageValues);
        logError(message, exception);
        return new ResponseEntity<>(new ErrorResponse(message), httpStatus);
    }

    @ExceptionHandler(value = TokenRefreshException.class)
    public ResponseEntity<ErrorResponse> handleTokenRefreshException(
            TokenRefreshException exception, WebRequest request) {
        return handleExceptionHelper(exception, request, HttpStatus.UNAUTHORIZED, "error", "token_refresh_error");
    }

    @ExceptionHandler(value = CannotCreateFileException.class)
    public ResponseEntity<ErrorResponse> handleCannotCreateFileException(
            CannotCreateFileException exception, WebRequest request) {
        return handleExceptionHelper(exception, request, HttpStatus.BAD_REQUEST, "error", "cannot_create_file", exception.getFileName());
    }

    @ExceptionHandler(value = PostNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePostNotFoundException(
            PostNotFoundException exception, WebRequest request) {
        return handleExceptionHelper(exception, request, HttpStatus.NOT_FOUND,
                "error", "post_not_found");
    }
}
