var jwt = require('jsonwebtoken');
const JWT_TOKEN = 'breakthematrix'

const SortSellerOrders = (orderArray) => {
    for (let i = 0; i < orderArray.length; i++) {
        const {
          OrderId,
          Manufacturer,
          SellerId,
          Status,
          ProductId,
          CreatedAt,
          DeliveredAt
        } = orderArray[i];
        let obj = {
          OrderId,
          Manufacturer,
          SellerId,
          Status,
          CreatedAt,
          DeliveredAt,
          Payload: [
              ProductId
          ],
        };
        orderArray[i] = obj;
      }
      orderArray.sort((a,b) => {
        return b.OrderId - a.OrderId
      })
      let newArr = []
      let p1 = 0, p2 = 1
      newArr.push(orderArray[0])
      while (p2 < orderArray.length) {
        if (newArr[p1].OrderId === orderArray[p2].OrderId) {
          newArr[p1].Payload.push(orderArray[p2].Payload[0])
          p2++
        } else {
          newArr.push(orderArray[p2])
          p1++
          p2++
        }
      }
      return newArr
}

const getSellerId = (token) => {
  const data = jwt.verify(token, JWT_TOKEN)
  let SellerId = data.seller.Id
  return SellerId
}


module.exports ={
    SortSellerOrders,
    getSellerId
}