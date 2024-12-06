export default class Purchase {
    constructor(username, productId, quantity, purchaseTime, id){
        this.username = username;
        this.productId = productId;
        this.quantity = quantity;
        this.purchaseTime = purchaseTime;
        this.id = id;
    }
}