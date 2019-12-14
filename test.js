const request = require('request')
const cbor = require('cbor')
const axios = require("axios");

// const getHistory = async (stateAddress) => {
//     let res = []
//     let parameters = {
//         limit: 10
//     }

//     //const url = "https://jsonplaceholder.typicode.com/posts/1";

//     const response = await axios.get('http://127.0.0.1:8008/transactions',
//         {
//             params: parameters
//         }
//     )
//     const transactions = response.data;
//     //console.log(transactions.data[0].payload)

//     let id = "62c100d33aad0f6bc79c6ce30942f320f6b5fdb984354e752d18ee029bd87ba6b26560"
//     let payloadList = []
//     transactions.data.filter(value => {
//         if (value.header.inputs.includes(id)) {
//             //console.log("matched")

//             // console.log(value.payload)
//             // console.log(Object.keys(value.payload));

//             payloadList.push(value.payload)
//         }
//     })
//     //console.log(requiredPayload)
//     //console.log(payloadList)

//     payloadList.forEach(element => {
//         let data = Buffer.from(element, 'base64')
//         data = cbor.decode(data)
//         //console.log(data)
//         res.push(data)
//     })

//     console.log(res)
//     return res
// }
const getHistory = async (stateAddress) => {
    
    let parameters = {
        limit: 10
    }

    //const url = "https://jsonplaceholder.typicode.com/posts/1";

    const result = await axios.get('http://127.0.0.1:8008/transactions',
        // {
        //     params: parameters
        // }
    ).then(response => {
        const transactions = response.data;
        let res = []
        //console.log(transactions.data[0].payload)

        let id = "62c1006691fbcbe9219771164d80fa59a3a462fb27176de26eba0bc1c593896ffa2521"
        let payloadList = []
        transactions.data.filter(value => {
            if (value.header.inputs.includes(id)) {
                //console.log("matched")

                // console.log(value.payload)
                // console.log(Object.keys(value.payload));

                payloadList.push(value.payload)
            }
        })
        //console.log(requiredPayload)
        //console.log(payloadList)

        payloadList.forEach(element => {
            let data = Buffer.from(element, 'base64')
            data = cbor.decode(data)
            //console.log(data)
            res.push(data)
        })

        //console.log(res)
        return res
    })
    console.log(result)
    return result
}
getHistory()