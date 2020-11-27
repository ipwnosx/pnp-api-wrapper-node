const axios = require('axios').default;
const logAxErr = require('./logErr').logAxErr;
const Servers = require('./servers');
const ProxyNetworks = require('./proxyNetworks');
const ProxyProviders = require('./proxyProviders');
const ProxyGroups = require('./proxyGroups');
const Users = require('./users');
const License = require('./license');


class PnpApiWrapper {

    /**
     * @param {string} endpointBaseUrl - The base url for the api. Example: https://111.111.111.111:9100
     * @param {string} apiKey - Your license key
     */
    constructor(endpointBaseUrl, apiKey) {

        const ax = axios.create({
            baseURL: endpointBaseUrl,
            headers: { 'X-API-KEY': apiKey },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        }); 

        ax.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            return response;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            logAxErr(error);
            return Promise.reject(error);
        });

        this.servers = new Servers(ax);
        this.proxyNetworks = new ProxyNetworks(ax);
        this.proxyProviders = new ProxyProviders(ax);
        this.proxyGroups = new ProxyGroups(ax);
        this.users = new Users(ax);
        this.license = new License(apiKey);
    }

}

module.exports = PnpApiWrapper;