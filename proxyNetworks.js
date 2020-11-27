

class ProxyNetworks {

    /**
     * @param {Object} axios - Preconfigured axios instance
     */
    constructor(axios) {
        this._axios = axios;
    }

    /**
     * List all proxy networks. Does not require authentication.
     * @returns {Promise<Array<Object>>}
     * @throws Will throw on non 200 range status code
     */
    async listProxyNetworks() {
        const response = await this._axios.get('/proxy-networks');
        return response.data;
    }

    /**
     * Create a proxy network
     * @param {string} name - desired name
     * @param {Array<number>} [proxyProviders] - IDs of proxy providers 
     * @returns {Promise<string>} id of the proxy network
     * @throws Will throw on non 200 range status code
     */
    async createProxyNetwork(name, proxyProviders) {

        const data = {};
        data.name = name;
        if (proxyProviders) {
            data.proxy_providers = proxyProviders;
        }

        const response = await this._axios.post('/proxy-networks', data);

        return response.data.id;
    }

    /**
     * Get a proxy network by ID. Does not require authentication.
     * @param {string} id 
     * @returns {Promise<Object>} proxyNetwork - see api docs for format
     * @throws Will throw on non 200 range status code
     */
    async getProxyNetwork(id) {
        const response = await this._axios.get(`/proxy-networks/${id}`);
        return response.data;
    }

    /**
     * Update a proxy networks proxy providers or name
     * @param {string} id - id of the proxy network
     * @param {string} [name] - optionally pass a new name
     * @param {Array<number>} [providerIDs] - optionally pass an array of proxy provider ids
     * @throws Will throw on non 200 range status code
     */
    async updateProxyNetwork(id, name, providerIDs) {

        if (!name && !providerIDs) {
            throw new Error('Must pass either name or providers');
        }

        const data = {};
        if (name) {
            data.name = name;
        }
        if (providerIDs) {
            data.proxy_providers = providerIDs;
        }

        await this._axios.patch(`/proxy-networks/${id}`, data);
    }

    /**
     * Delete a proxy network with the given ID. Associated proxy providers will not be deleted.
     * @param {string} id - id of the proxy network
     * @throws Will throw on non 200 range status code
     */
    async deleteProxyNetwork(id) {
        await this._axios.delete(`/proxy-networks/${id}`);
    }
}

module.exports = ProxyNetworks;