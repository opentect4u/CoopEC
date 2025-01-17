import axios from "axios"
import { BASE_URL } from "../../routes/config"

export default function RangeList (){

    const RangeList_Async = async (para) => {
        return new Promise((resolve, reject) => {
          axios
            .post(`${BASE_URL}/wapi/rangedtllist`, {
              auth_key:"xxxxx",
              })
            .then(res => {
            //   console.log(res?.data, 'gggggggggggggggggggggggffff', 'jjjjjj');
              
              resolve(res?.data)
            })
            .catch(err => {
              reject(err)
            })
        })
      }
      // return { login }
      return { RangeList_Async };

}