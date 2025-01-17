import axios from "axios";
import { BASE_URL } from "../../routes/config";

export default function StatisticData() {
    const fetchStatistics = async (para) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${BASE_URL}/wapi/societyelectionstatus`, {
            auth_key:"xxxxx",
            election_status: para,
            })
          .then(res => {
            // console.log(res?.data?.msg, 'gggggggggggggggggggggggffff', 'jjjjjj');
            
            resolve(res?.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
    // return { login }
    return { fetchStatistics };
  }