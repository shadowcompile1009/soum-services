const creditTransaction = {
  ownerId: '',
  walletId: '',
  orderId: '',
  amount: 0.94,
  status: 'Success',
  type: 'Credit',
  createdAt: {
    $date: '2022-12-12T09:07:04.730Z',
  },
  updatedAt: {
    $date: '2022-12-12T09:10:03.320Z',
  },
  __v: 0,
  history: [
    {
      transactionId: {
        $oid: '6396ef386684b4dfc5036f02',
      },
      agentId: '634d677fcdf0d90034dc7490',
      agentName: 'slubbad',
      status: 'Success',
      createdAt: {
        $date: '2022-12-12T09:10:03.336Z',
      },
      updatedAt: {
        $date: '2022-12-12T09:10:03.336Z',
      },
      hyperpayCreatedAt: null,
      hyperpayBatchId: null,
      hyperpayUniqueId: null,
    },
  ],
};

const depositTransaction = {
  ownerId: '',
  walletId: '',
  amount: 1,
  status: 'Pending',
  type: 'Deposit',
  createdAt: {
    $date: '2023-01-04T14:33:02.894Z',
  },
  updatedAt: {
    $date: '2023-01-04T14:33:02.894Z',
  },
  __v: 0,
};

const pendingTransaction = {
  ownerId: '',
  walletId: '',
  amount: 0.94,
  status: 'Success',
  type: 'Withdrawal',
  createdAt: {
    $date: '2022-12-12T09:10:53.907Z',
  },
  updatedAt: {
    $date: '2022-12-12T09:11:59.148Z',
  },
  __v: 0,
  history: [
    {
      transactionId: '6396f01d8e0aef45ff692104',
      status: 'Completed',
      agentId: '634d677fcdf0d90034dc7490',
      agentName: 'slubbad',
      hyperpayCreatedAt: {
        $date: '2022-12-12T09:11:55.000Z',
      },
      hyperpayBatchId: 29837039,
      hyperpayUniqueId: 'f3650e03d0f28cb3437d813323ea2982',
      createdAt: {
        $date: '2022-12-12T09:11:59.158Z',
      },
      updatedAt: {
        $date: '2022-12-12T09:11:59.158Z',
      },
    },
  ],
};

export { creditTransaction, depositTransaction, pendingTransaction };
