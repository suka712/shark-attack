CAPTURED MEXC REQUESTS

- URL: https://p2p.mexc.com/api/order/deal/history?coinId=&orderDealStates=NOT_PAID%2CPROCESSING%2CPAID%2CCOMPLAINING&page=1&tradeType=

```json
{
    "responseTime": 1758341279642,
    "msg": "success",
    "code": 0,
    "data": [
        {
            "id": "d1550768525717771264",
            "quantity": 75.5287,
            "price": 26480,
            "amount": 2000000,
            "coinName": "USDT",
            "state": 0,
            "paymentInfo": [
                {
                    "id": 1716627,
                    "payMethod": 1,
                    "bankName": "MB",
                    "account": "0201000670358",
                    "bankAddress": "MB"
                }
            ],
            "expirationTime": 1758342118000,
            "tradeType": 0,
            "currency": "VND",
            "createTime": 1758341218000,
            "merchantInfo": {
                "uid": "95657997",
                "realName": "DAU VAN DUC",
                "nickName": "P2P- Nhanh286",
                "memberId": "e86d5acdaa654c31be90f8a0b55a1afe",
                "greenDiamond": false,
                "roleType": 0,
                "roleName": ""
            },
            "complaining": false,
            "unreadCount": 0,
            "fastTrade": false
        }
    ],
    "page": {
        "total": 1,
        "currPage": 1,
        "pageSize": 10,
        "totalPage": 1
    }
}
```

- Raw data from the same link. 
- There are two different shapes. One where `data` is one single object. And the other is where `data` is inside of an array
- `paymentInfo` is always an array as seen so far
```json
"text": "{\"responseTime\":1758341258801,\"msg\":\"success\",\"code\":0,\"data\":{\"id\":\"d1550768525717771264\",\"orderId\":\"a1550763157008657408\",\"hasBeenReviewed\":false,\"isPopupDisplayed\":true,\"quantity\":75.5287,\"price\":26480.0,\"amount\":2000000.0,\"coinName\":\"USDT\",\"state\":0,\"paymentInfo\":[{\"id\":1716627,\"payMethod\":1,\"bankName\":\"MB\",\"account\":\"0201000670358\",\"bankAddress\":\"MB\"}],\"expirationTime\":1758342118000,\"tradeType\":0,\"currency\":\"VND\",\"createTime\":1758341218000,\"updateTime\":1758341218000,\"autoResponse\":\"Cảm ơn b đã gd với P2P-Nhanh286\\nChuyển khoản xong chụp bill để được mở khoá nhanh nhất . xin cảm ơn\",\"merchantInfo\":{\"uid\":\"95657997\",\"realName\":\"DAU VAN DUC\",\"nickName\":\"P2P- Nhanh286\",\"imId\":\"95657997\",\"memberId\":\"e86d5acdaa654c31be90f8a0b55a1afe\",\"mobile\":\"+84********86\",\"registry\":1737646457000,\"vipLevel\":0,\"greenDiamond\":false,\"badge\":\"0\",\"merchantType\":\"normal\",\"roleType\":0,\"roleName\":\"\",\"profilePhoto\":\"\"},\"complained\":false,\"unreadCount\":0,\"paymentReceipt\":1,\"overVerifyState\":1,\"fastTrade\":false}}"

"text": "{\"responseTime\":1758341263539,\"msg\":\"success\",\"code\":0,\"data\":[{\"id\":\"d1550768525717771264\",\"quantity\":75.5287,\"price\":26480.0,\"amount\":2000000.0,\"coinName\":\"USDT\",\"state\":0,\"paymentInfo\":[{\"id\":1716627,\"payMethod\":1,\"bankName\":\"MB\",\"account\":\"0201000670358\",\"bankAddress\":\"MB\"}],\"expirationTime\":1758342118000,\"tradeType\":0,\"currency\":\"VND\",\"createTime\":1758341218000,\"merchantInfo\":{\"uid\":\"95657997\",\"realName\":\"DAU VAN DUC\",\"nickName\":\"P2P- Nhanh286\",\"memberId\":\"e86d5acdaa654c31be90f8a0b55a1afe\",\"greenDiamond\":false,\"roleType\":0,\"roleName\":\"\"},\"complaining\":false,\"unreadCount\":0,\"fastTrade\":false}],\"page\":{\"total\":1,\"currPage\":1,\"pageSize\":10,\"totalPage\":1}}"
```