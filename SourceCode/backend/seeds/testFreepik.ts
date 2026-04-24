import axios from 'axios';

async function testFreepik() {
    try {
        const response = await axios.get('https://api.freepik.com/v1/resources', {
            params: {
                term: 'gym workout',
                limit: 5,
                'filters[content_type][]': 'photo'
            },
            headers: {
                'Accept-Language': 'en-US',
                'Accept': 'application/json',
                'x-freepik-api-key': 'FPSX7c48dc9083a72656bd1154d958b273bf'
            }
        });
        console.log(JSON.stringify(response.data.data.map((d:any) => d.image?.source?.url), null, 2));
    } catch (e: any) {
        console.error(e.response?.data || e.message);
    }
}

testFreepik();
