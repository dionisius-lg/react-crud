import { useState } from "react";
import { EncryptStorage } from "encrypt-storage";
import moment from "moment";

export const isEmptyValue = (value) => {
    return (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0) ||
        (typeof value === 'number' && value < 1)
    )
}

export const isJson = (value) => {
    value = typeof value !== "string" ? JSON.stringify(value) : value

    try {
        value = JSON.parse(value)
    } catch (e) {
        return false
    }

    if (typeof value === "object" && value !== null) {
        return true
    }

    return false
}

export const formatDate = (value) => {
    const date = moment(value)

    if (date.isValid()) {
        return date.format('YYYY-MM-DD')
    }

    return false
}

export const formatExpiredDate = (value) => {
    const date = moment(value).add(30, 'days')

    if (date.isValid()) {
        return date.format('YYYY-MM-DD')
    }

    return false
}

export const formatDateTime = (value) => {
    const date = moment(value)

    if (date.isValid()) {
        return date.format('YYYY-MM-DD HH:mm:ss')
    }

    return false
}

export const encryptStorage = new EncryptStorage(process.env.REACT_APP_SECRET_KEY, {
    prefix: process.env.REACT_APP_NAME,
    storageType: 'sessionStorage',
})

export const diffDate = (value1, value2) => {
    const date1 = moment(value1)
    const date2 = moment(value2)

    if (date1.isValid() && date2.isValid()) {
        return date1.diff(date2)
    }

    return false
}

export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


export const strTok = (string, separator = null) => {
    if (isEmptyValue(separator)) {
        separator = " "
    }

    const index = string.indexOf(separator)

    if (index === -1) return string

    const token = string.substring(0, index)

    string = string.substring(index + 1)

    return token
}
