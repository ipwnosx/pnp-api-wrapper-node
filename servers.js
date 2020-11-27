

/**
 * @typedef {{id: string, ip: string}} Server
 */

class Servers {

    /**
     * @param {Object} axios - Preconfigured axios instance
     */
    constructor(axios) {
        this._axios = axios;
    }

    /**
     * Add information about a server. 
     * This information is needed so that proxies can be generated on the frontend. 
     * Returns the ID of the server that was added.
     * @param {string} ip - ip of the server you want to add
     * @returns {Promise<string>} id - The id of the server
     * @throws Will throw on non 200 range status code
     */
    async addServer(ip) {
        const response = await this._axios.post('/servers', { ip });
        return response.data.id;
    }

    /**
     * List all servers
     * @return {Array<Server>} - Array of Server objects
     * @throws Will throw on non 200 range status code
     */
    async listServers() {
        const response = await this._axios.get('/servers');
        return response.data;
    }

    /**
     * Deletes a server
     * @param {string} id - id returned when the server was created
     * @throws Will throw on non 200 range status code
     */
    async deleteServer(id) {
        await this._axios.delete(`/servers/${id}`);
    }

}

module.exports = Servers;
