export const HTTPResponses = {
    Success : {
        200 : "Förfrågan genomfördes korrekt",
        201 : "Resursen skapades korrekt",
    },

    Error : {
        400 : "Information saknades i förfrågan",
        401 : "Användaren är inte autentiserad",
        /* 402 "", */
        403 : "Användaren saknar rättigheter för denna resurs",
        404 : "Resursen hittades inte",
        /* 405 : "", */
        /* 406 : "", */
        /* 407 : "", */
        /* 408 : "", */
        409 : "Resursen ändrades inte på grund av externa beroenden",
        /* 410 : "", */
        /* 411 : "", */
        /* 412 : "", */
        /* 413 : "", */
        /* 414 : "", */
        /* 415 : "", */
        /* 416 : "", */
        /* 417 : "", */
        /* 418 : "", */
        /* 421 : "", */
        /* 423 : "", */
        /* 424 : "", */
        /* 425 : "", */
        /* 426 : "", */
        /* 428 : "", */
        /* 429 : "", */
        /* 431 : "", */
        /* 451 : "", */
        500: "Någonting gick fel på vår sida",
    },
}

export const ConsoleResponses = {
    GET_ERROR               : "> Error fetching a resource",
    POST_ERROR              : "> Error creating a new resource",
    PUT_ERROR               : "> Error replacing an existing resource",
    PATCH_ERROR             : "> Error updating an existing resource",
    DELETE_ERROR            : "> Error deleting an existing resource",
    TRANSACTION_ROLLBACK    : "> Transaction was successfully rolled back.",
    TRANSACTION_ERROR       : "> Transaction did not work. Rolling back.",
    SERVER_ERROR            : "> Something went wrong on the server",
}