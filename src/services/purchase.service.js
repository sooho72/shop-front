import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const API_URL=BASE_API_URL + '/api/purchase';

class PurchaseService{
    savePurchaseService(purchase){
        return axios.post(API_URL, purchase, {headers:authHeader()});
    }

    getAllPerchases(){
        return axios.get(API_URL,{headers:authHeader()});
    }
}
const purchaseService = new PurchaseService();
export default purchaseService;