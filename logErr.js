
// e should be an axios error instance
function logAxErr(e) {
    if (!e.response) {
        return; // can't format err msg if e.response doesn't exist
    }
    const method = e.response.config.method;
    const url = e.response.config.baseURL + e.response.config.url;
    const statusCode = e.response.status;
    const errMessage = e.response.data && e.response.data.error;
    console.log(`${method} request to ${url} failed with status code: ${statusCode}`);
    console.log(`error message from server: ${errMessage}\n`);
}

module.exports = {logAxErr}