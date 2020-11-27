

class ProxyProviders {

    /**
     * @param {Object} axios - Preconfigured axios instance
     */
    constructor(axios) {
        this._axios = axios;
    }

    /**
     * List all proxy providers
     * @param {boolean} [includeProxyGroups=false] - Set to true to include the proxy groups under the key "proxy_groups" 
     * at the expense of more firebase reads and a larger response.
     * @returns {Promise<Array<Object>>} See api docs for return type
     * @throws Will throw on non 200 range status code
     */
    async listProxyProviders(includeProxyGroups = false) {
        const response = await this._axios.get('/proxy-providers', { params: { include_proxy_groups: includeProxyGroups } });
        return response.data;
    }

    /**
     * Creates a custom proxy provider. No proxies are actually assigned to the provider at this time. 
     * Proxies are assigned to a provider by adding proxy groups via the proxy-groups endpoint.
     * @param {string} name - desired name for the proxy provider
     * @param {number} [60] maxStaticMinutes - The maximum about of time before a proxy rotates
     * @returns {Promise<number>} id - id of the newly created proxy provider
     * @throws Will throw on non 200 range status code
     */
    async createProxyProvider(name, maxStaticMinutes = 60) {
        const response = await this._axios.post('/proxy-providers', { name, max_static_minutes: maxStaticMinutes });
        return response.data.id;
    }

    /**
     * Get a single proxy provider by ID
     * @param {boolean} [includeProxyGroups=false] - Set to true to include the proxy groups under the key "proxy_groups" 
     * at the expense of more firebase reads and a larger response.
     * @returns {Promise<Object>} See api docs for return type
     * @throws Will throw on non 200 range status code
     */
    async getProxyProvider(includeProxyGroups = false) {
        const response = await this._axios.get('/proxy-providers', { params: { include_proxy_groups: includeProxyGroups } });
        return response.data;
    }

    /**
     * Update a proxy providers name or max_static_minutes for the proxy provider with the given id.
     * @param {number} id - id of the proxy provider to update
     * @param {string} [name] - desired name for the proxy provider
     * @param {number} [maxStaticMinutes] - The maximum about of time before a proxy rotates
     * @throws Will throw on non 200 range status code
     */
    async updateProxyProvider(id, name, maxStaticMinutes) {

        if (!name || maxStaticMinutes == undefined) {
            throw new Error('Either name or maxStaticMinutes must be passed to updateProxyProvider');
        }

        let data = {};
        if (name) {
            data.name = name;
        }
        if (maxStaticMinutes != undefined) {
            data.max_static_minutes = maxStaticMinutes;
        }

        await this._axios.patch(`/proxy-providers/${id}`, data);
    }

    /**
     * Deletes the proxy provider with the specified ID AND all it's associated proxy groups.
     * @param {number} id - id of the proxy provider to delete
     * @throws Will throw on non 200 range status code
     */
    async deleteProxyProvider(id) {
        await this._axios.delete(`/proxy-providers/${id}`);
    }

    /**
     * Get bandwidth usage in Gb for a proxy provider for the specified time period.
     * @param {number} id - id of the proxy provider
     * @param {string} [timePeriod=month] - Available types: 24h, month, 7days, custom. If custom type is selected you must provide from and to parameters.
     * @param {string} [from] - Use date format yyyy-mm-dd
     * @param {string} [to] - Use date format yyyy-mm-dd
     * @returns {Promise<number>} Gb used for the specified time period
     * @throws Will throw on non 200 range status code
     */
    async getProxyProviderBandwidthUsage(id, timePeriod, from, to) {

        let params = {};
        if (timePeriod == 'custom' && (!from || !to)) {
            throw ("If 'custom' is passed as the timePeriod, 'from' and 'to' must also be provided");
        }

        if (timePeriod) {
            params.time_period = timePeriod;
        }
        if (from) {
            params.from = from;
        }
        if (to) {
            params.to = to;
        }

        const response = await this._axios.get(`/proxy-providers/${id}/bandwidth-usage`, { params });

        return response.data.gb_used;
    }

}

module.exports = ProxyProviders;