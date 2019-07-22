module.exports = function ResponseHandler(isList, response, successMessage, errorMessage) {
    var result;
    if (isList && response.length === 0 || !isList && response === null) {
        result = {status: 'NotFound', message: errorMessage, response: response};
    } else {
        result = {status: 'Success', message: successMessage, response: response};
    }
    return Promise.resolve(result);
}