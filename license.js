const axios = require('axios').default;
const logAxErr = require('./logErr').logAxErr;


class License {

    constructor(apiKey) {
        this._axios = axios.create({
            baseURL: 'https://ls.proxynetworkpro.com/v1',
            headers: { 'X-API-KEY': apiKey },
        });

        this._axios.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            return response;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            logAxErr(error);
            return Promise.reject(error);
        });
    }

    /**
     * List all authorized domains
     * @returns {Promise<Array<string>>}
     * @throws Will throw on non 200 range status code
     */
    async getAuthorizedDomains() {
        const response = await this._axios.get('/authorized-domains');
        return response.data;
    }

    /**
     * Adds a domain
     * @param {string} domain - The domain that you want to authorize
     * @throws Will throw on non 200 range status code
     */
    async addAuthorizedDomain(domain) {
        await this._axios.post('/authorized-domains', {domain});
    }

    /**
     * Delete a domain
     * @param {string} domain - The domain that you want to deauthorize
     * @throws Will throw on non 200 range status code
     */
    async deleteAuthorizedDomain(domain) {
        await this._axios.delete('/authorized-domains', { params: {domain} });
    }
}

module.exports = License;