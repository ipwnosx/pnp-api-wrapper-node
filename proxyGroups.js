

class ProxyGroups {

    /**
     * @param {Object} axios - Preconfigured axios instance
     */
    constructor(axios) {
        this._axios = axios;
    }

    /**
     * Lists all proxy groups. Optionally filter by proxy provider. 
     * Proxy groups are linked to a single provider, so you'll likely want to filter by provider.
     * @param {number} [proxyProviderId] - Optionaly filter by proxy provider
     * @param {boolean} [excludeProxies=false] - Set to true to exclude the "proxies" key from the response.
     * @returns {Promise<Array<Object>>} See api docs for return type
     * @throws Will throw on non 200 range status code
     */
    async listProxyGroups(proxyProviderId, excludeProxies = false) {

        const params = { exclude_proxies: excludeProxies };
        if (proxyProviderId != undefined) {
            params.proxy_provider_id = proxyProviderId;
        }

        const response = await this._axios.get('/proxy-groups', { params });

        return response.data
    }

    /**
     * Create a new proxy group for a provider to use. A proxy group is just a container for a list of proxy strings. 
     * The "rotating" key specifies whether these proxies rotate on every request. 
     * Not whether you want them to rotate, but whether they already rotate on every request.
     * @typedef {{longname: string, shortname: string}} Region
     * @param {number} proxyProviderId
     * @param {string} name - A name for the proxy group
     * @param {Array<string>} proxies - Array of proxy strings in the format: ip:port:username:password 
     * @param {Region} region - Region names. Both longname and shortname should be unique
     * @param {boolean} [rotating=false] - Whether these proxies rotate on every request
     * @returns {Promise<string>} id - The id of the newly created proxy group
     * @throws Will throw on non 200 range status code
     */
    async createProxyGroup(proxyProviderId, name, proxies, region, rotating = false) {

        const data = {
            name,
            proxies,
            region,
            rotating
        }

        const response = await this._axios.post(`/proxy-groups/${proxyProviderId}`, data);

        return response.data.id;
    }

    /**
     * Delete a proxy group by ID. 
     * Proxies from this group will no longer be used by the associated proxy provider.
     * @param {string} id - id of the proxy group to delete
     * @throws Will throw on non 200 range status code
     */
    async deleteProxyGroup(id) {
        await this._axios.delete(`/proxy-groups/${id}`);
    }

}

module.exports = ProxyGroups;