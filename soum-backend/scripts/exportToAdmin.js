var aggr = [
    {
        $unwind: "$bidding"
    },
    {
        $match : {
            'bidding.bid_date' : {
                $gte : new Date('2021-08-01T00:00:00').toISOString()
            }
        }
    },
    {
        $project: {
            _id: 0,
            productId: "$_id",
            biddId: "$bidding.bid_id",
            bidder: "$bidding.use_id",
            pay_bid_amount: "$bidding.pay_bid_amount",
            payment_type: "$bidding.payment_type",
            remaining_bid_amount: "$bidding.remaining_bid_amount",
            grand_total: "$bidding.grand_total",
            vat: "$bidding.vat",
            commission: "$bidding.commission",
            shipping_charge: "$bidding.shipping_charge",
            buy_amount: "$bidding.buy_amount",
            bid_status: "$bidding.bid_status",
            transaction_status: "$bidding.transaction_status",
            payment_take: "$bidding.payment_take",
            bid_date: "$bidding.bid_date",
            order_number: "$bidding.order_number",
        }
    }
];
var productbids = db.products.aggregate(aggr).toArray();
db.productbids.insertMany(productbids);


var aggrProd = [
    {
        $match : {
            'createdDate' : {
                $gte : new Date('2021-08-01T00:00:00')
            }
        }
    },
    {
        $project: {
            user_id: 1,
            category_id: 1,
            brand_id: 1,
            model_id: 1,
            varient: 1,
            sell_price: 1,
            bid_price: 1,
            description: 1,
            grade: 1,
            score: 1,
            current_bid_price: 1,
            status: 1,
            sell_status: 1,
            isApproved: 1,
            isExpired: 1,
            expiryDate: 1,
            updatedDate: 1,
            createdDate: 1,
        }
    }
]
var products = db.products.aggregate(aggrProd).toArray();
db.productExport.insertMany(products);


var aggrUser = [
    {
        $match : {
            'createdDate' : {
                $gte : new Date('2021-08-01T00:00:00')
            }
        }
    },
    {
        $project: {
            name: 1,
            email: 1,
            mobileNumber: 1,
            countryCode:1,
            language: 1,
            loginWith: 1,
            status: 1,
            userType : 1,
            createdDate : 1,
            address : "$address.address",
            city : "$address.city",
            postal_code : "$address.postal_code",
        }
    }
]

var users = db.users.aggregate(aggrUser).toArray();
db.userExport.insertMany(users);

var aggrOrder = [
    {
        $match : {
            'created_at' : {
                $gte : new Date('2021-08-01T00:00:00')
            }
        }
    },
    {
        $project: {
            product: 1,
            seller: 1,
            buyer: 1,
            buy_amount: 1,
            shipping_charge: 1,
            vat: 1,
            commission: 1,
            grand_total : 1,
            checkout_id : 1,
            order_number : 1,
            payment_type : 1,
            transaction_id : 1,
            return_reason : 1,
            dispute_comment : 1,
            dispute_validity : 1,
            transaction_detail : 1,
            split_payout_detail : 1,
            transaction_status: 1,
            paymentReceivedFromBuyer: 1,
            paymentMadeToSeller: 1,
            buy_type: 1,
            dispute: 1,
            status: 1,
            created_at : 1,
        }
    }
]

var orders = db.orders.aggregate(aggrOrder).toArray();
db.OrderExport.insertMany(orders);