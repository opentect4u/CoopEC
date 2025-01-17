import axios from "axios"
import { BASE_URL } from "../../routes/config"

export default function FaqData (){

    const FaqData_Async = async (para) => {
        return new Promise((resolve, reject) => {
          axios
            .post(`${BASE_URL}/wapi/faqlist`, {
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
      return { FaqData_Async };

}