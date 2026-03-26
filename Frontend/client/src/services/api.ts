import axios from 'axios';
const api = {
    baseUrl: 'http://localhost:8080',   
}

const getGraphData = async () => {
    try {
        const response = await axios.get(`${api.baseUrl}/graph`);
        return response.data;
    } catch (error) {
        console.error('Error fetching graph data:', error);
        throw error;
    }
};

const proptQuery = async (query: string) => {
    try {
        const response = await axios.post(`${api.baseUrl}/query`, { query });   
        return response.data;
    } catch (error) {
        console.error('Error fetching query data:', error);
        throw error;
    }
};

export { getGraphData, proptQuery };

