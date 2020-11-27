

class Users {

    /**
     * @param {Object} axios - Preconfigured axios instance
     */
    constructor(axios) {
        this._axios = axios;
    }

    /**
     * Lists all users
     * @returns {Promise<Array<Object>>} - See api docs for return type
     * @throws Will throw on non 200 range status code
     */
    async getUsers() {
        const response = await this._axios.get('/users');
        return response.data;
    }

    /**
     * Create a new user. The retrieval key allows retrieving this user without api authentication. 
     * A good value for the retrieval key would be a hash of your users password. 
     * If a retrieval key is not set, api authentication will always be required to retrieve the user. 
     *
     * @typedef {{id: string, proxy_username: string, proxy_password: string}} cuResponse
     * @param {string} email - Users email
     * @param {string} [retrievalKey] - Secret key used only for authentication while retrieving this user
     * @returns {Promise<cuResponse>}
     * @throws Will throw on non 200 range status code
     */
    async createUser(email, retrievalKey) {

        const data = {email};
        if (retrievalKey) {
            data.retrieval_key = retrievalKey;
        }

        const response = await this._axios.post('/users', data);

        return response.data;
    }

    /**
     * Get a single user. API authentication is not required. 
     * Perfect for use on your frontend.
     * @param {string} email - Users email
     * @param {string} retrievalKey - Key specified when user was created
     * @returns {Promise<Object>} - See api docs for return type
     * @throws Will throw on non 200 range status code
     */
    async getSingleUser(email, retrievalKey) {
        const response = await this._axios.get(`/users/${email}/${retrievalKey}`);
        return response.data;
    }

    /**
     * Get a single user by id. Requires authentication.
     * @param {string} id - id returned when user was created
     * @returns {Promise<Object>} - See api docs for return type
     * @throws Will throw on non 200 range status code
     */
    async getSingleUserById(id) {
        const response = await this._axios.get(`/users/${id}`);
        return response.data;
    }

    /**
     * Allows updating the retrieval_key
     * @param {string} id - id returned when user was created
     * @param {string} retrievalKey - new retrieval key
     * @throws Will throw on non 200 range status code
     */
    async updateUser(id, retrievalKey) {
        await this._axios.patch(`/users/${id}`, {retrieval_key: retrievalKey});
    }

    /**
     * Delete a user with the given ID.
     * @param {string} id - id of the user
     * @throws Will throw on non 200 range status code
     */
    async deleteUser(id) {
        await this._axios.delete(`/users/${id}`);
    }

    /**
     * Add a proxy network the user can use, 
     * or update bandwidth for a network the user is already assigned.
     * @param {string} userId - id of the user
     * @param {number} proxyNetworkId - id of the proxy network to add or modify
     * @param {number} gbUsed - The number of gb used. Does not have to be an integer.
     * @param {number} gbAllotted - The number of gb the user is allowed to use. Does not have to be an integer.
     * @throws Will throw on non 200 range status code
     */
    async updateProxyNetworks(userId, proxyNetworkId, gbUsed, gbAllotted) {
        if (userId == undefined || proxyNetworkId == undefined || gbUsed == undefined || gbAllotted == undefined) {
            throw new Error('missing some arguments');
        }

        const data = {
            proxy_network_id: proxyNetworkId,
            used: gbUsed,
            allotted: gbAllotted
        }

        await this._axios.put(`/users/${userId}/proxy-networks`, data);
    }

    /**
     * Removes a proxy network from a user. 
     * The user will no longer be able to use proxies in this proxy network.
     * @param {string} userId - id of the user
     * @param {number} proxyNetworkId - id of the proxy network
     * @throws Will throw on non 200 range status code
     */
    async removeProxyNetwork(userId, proxyNetworkId) {
        await this._axios.delete(`/users/${userId}/proxy-networks/${proxyNetworkId}`);
    }
}

module.exports = Users;